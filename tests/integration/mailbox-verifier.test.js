import { describe, test, expect, jest, beforeEach, afterEach } from '@jest/globals';
import MailboxVerifier from 'src/commands/parse/parse-email/mailbox-verifier.js';
import Email from 'src/commands/parse/parse-email/email.js';
import SaltoolsError from 'src/errors/saltools-error.js';
import axios from 'axios';

describe('MailboxVerifier', () => {
  let originalApiKey;
  let axiosGetSpy;

  beforeEach(() => {
    originalApiKey = process.env.MAILBOX_API_KEY;
    axiosGetSpy = jest.spyOn(axios, 'get');
  });

  afterEach(() => {
    process.env.MAILBOX_API_KEY = originalApiKey;
    axiosGetSpy.mockRestore();
  });

  test('test_verify_WHEN_apiKeyNotSet_THEN_throwsSaltoolsError', async () => {
    delete process.env.MAILBOX_API_KEY;
    const verifier = new MailboxVerifier();

    await expect(verifier.verify('test@example.com')).rejects.toThrow(SaltoolsError);
  });

  test('test_verify_WHEN_validEmailWithRealAPI_THEN_returnsEmail', async () => {
    if (!process.env.MAILBOX_API_KEY) {
      return;
    }

    axiosGetSpy.mockRestore();
    const verifier = new MailboxVerifier();

    const result = await verifier.verify('test@gmail.com');

    expect(result).toBeInstanceOf(Email);
    expect(result.value).toBe('test@gmail.com');
    expect(result.domain).toBe('gmail.com');
    expect(result.local).toBe('test');
  });

  test('test_verify_WHEN_responseStatusNot200_THEN_throwsSaltoolsError', async () => {
    process.env.MAILBOX_API_KEY = 'test-api-key';
    const verifier = new MailboxVerifier();
    const mockResponse = {
      status: 500,
      data: {},
    };
    axiosGetSpy.mockResolvedValue(mockResponse);

    await expect(verifier.verify('test@example.com')).rejects.toThrow(SaltoolsError);
  });

  test('test_verify_WHEN_responseDataIsEmpty_THEN_throwsSaltoolsError', async () => {
    process.env.MAILBOX_API_KEY = 'test-api-key';
    const verifier = new MailboxVerifier();
    const mockResponse = {
      status: 200,
      data: null,
    };
    axiosGetSpy.mockResolvedValue(mockResponse);

    await expect(verifier.verify('test@example.com')).rejects.toThrow(SaltoolsError);
    await expect(verifier.verify('test@example.com')).rejects.toThrow('Resposta do MailboxLayer veio vazia');
  });

  test('test_verify_WHEN_responseDataIsNotObject_THEN_throwsSaltoolsError', async () => {
    process.env.MAILBOX_API_KEY = 'test-api-key';
    const verifier = new MailboxVerifier();
    const mockResponse = {
      status: 200,
      data: 'invalid',
    };
    axiosGetSpy.mockResolvedValue(mockResponse);

    await expect(verifier.verify('test@example.com')).rejects.toThrow(SaltoolsError);
    await expect(verifier.verify('test@example.com')).rejects.toThrow('Resposta do MailboxLayer não é um objeto');
  });

  test('test_verify_WHEN_responseSuccessIsFalse_THEN_throwsSaltoolsError', async () => {
    process.env.MAILBOX_API_KEY = 'test-api-key';
    const verifier = new MailboxVerifier();
    const mockResponse = {
      status: 200,
      data: {
        success: false,
        error: { info: 'Invalid API key' },
      },
    };
    axiosGetSpy.mockResolvedValue(mockResponse);

    await expect(verifier.verify('test@example.com')).rejects.toThrow(SaltoolsError);
    await expect(verifier.verify('test@example.com')).rejects.toThrow('MailboxLayer retornou erro');
  });

  test('test_verify_WHEN_formatValidIsFalse_THEN_throwsSaltoolsError', async () => {
    process.env.MAILBOX_API_KEY = 'test-api-key';
    const verifier = new MailboxVerifier();
    const mockResponse = {
      status: 200,
      data: {
        success: true,
        format_valid: false,
        mx_found: true,
        smtp_check: true,
      },
    };
    axiosGetSpy.mockResolvedValue(mockResponse);

    await expect(verifier.verify('test@example.com')).rejects.toThrow(SaltoolsError);
    await expect(verifier.verify('test@example.com')).rejects.toThrow('MailboxLayer invalidou o email');
  });

  test('test_verify_WHEN_mxFoundIsFalse_THEN_throwsSaltoolsError', async () => {
    process.env.MAILBOX_API_KEY = 'test-api-key';
    const verifier = new MailboxVerifier();
    const mockResponse = {
      status: 200,
      data: {
        success: true,
        format_valid: true,
        mx_found: false,
        smtp_check: true,
      },
    };
    axiosGetSpy.mockResolvedValue(mockResponse);

    await expect(verifier.verify('test@example.com')).rejects.toThrow(SaltoolsError);
    await expect(verifier.verify('test@example.com')).rejects.toThrow('MailboxLayer invalidou o email');
  });

  test('test_verify_WHEN_smtpCheckIsFalse_THEN_throwsSaltoolsError', async () => {
    process.env.MAILBOX_API_KEY = 'test-api-key';
    const verifier = new MailboxVerifier();
    const mockResponse = {
      status: 200,
      data: {
        success: true,
        format_valid: true,
        mx_found: true,
        smtp_check: false,
      },
    };
    axiosGetSpy.mockResolvedValue(mockResponse);

    await expect(verifier.verify('test@example.com')).rejects.toThrow(SaltoolsError);
    await expect(verifier.verify('test@example.com')).rejects.toThrow('MailboxLayer invalidou o email');
  });

  test('test_verify_WHEN_axiosRequestFails_THEN_throwsError', async () => {
    process.env.MAILBOX_API_KEY = 'test-api-key';
    const verifier = new MailboxVerifier();
    axiosGetSpy.mockRejectedValue(new Error('Network error'));

    await expect(verifier.verify('test@example.com')).rejects.toThrow('Network error');
  });

  test('test_verify_WHEN_emailWithUppercase_THEN_convertsToLowercase', async () => {
    if (!process.env.MAILBOX_API_KEY) {
      return;
    }

    axiosGetSpy.mockRestore();
    const verifier = new MailboxVerifier();

    const result = await verifier.verify('TEST@GMAIL.COM');

    expect(result.value).toBe('test@gmail.com');
    expect(result.domain).toBe('gmail.com');
    expect(result.local).toBe('test');
  });

  test('test_verify_WHEN_emailWithWhitespace_THEN_trimsWhitespace', async () => {
    if (!process.env.MAILBOX_API_KEY) {
      return;
    }

    axiosGetSpy.mockRestore();
    const verifier = new MailboxVerifier();

    const result = await verifier.verify('  test@gmail.com  ');

    expect(result.value).toBe('test@gmail.com');
    expect(result.domain).toBe('gmail.com');
    expect(result.local).toBe('test');
  });

  test('test_verify_WHEN_invalidEmail_THEN_throwsSaltoolsError', async () => {
    if (!process.env.MAILBOX_API_KEY) {
      return;
    }

    axiosGetSpy.mockRestore();
    const verifier = new MailboxVerifier();

    await expect(verifier.verify('invalid-email')).rejects.toThrow(SaltoolsError);
  });

  test('test_verify_WHEN_emailDomainHasNoMX_THEN_throwsSaltoolsError', async () => {
    if (!process.env.MAILBOX_API_KEY) {
      return;
    }

    axiosGetSpy.mockRestore();
    const verifier = new MailboxVerifier();

    await expect(verifier.verify('test@nonexistentdomain123456.com')).rejects.toThrow(SaltoolsError);
  });
});

