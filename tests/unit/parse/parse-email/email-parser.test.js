import { describe, test, expect, jest, beforeEach, afterEach } from '@jest/globals';
import EmailParser from 'src/commands/parse/parse-email/email-parser.js';
import DNSValidator from 'src/commands/parse/parse-email/dns-validator.js';
import SaltoolsError from 'src/errors/saltools-error.js';

describe('EmailParser', () => {
  let dnsValidatorSpy;

  beforeEach(() => {
    dnsValidatorSpy = jest.spyOn(DNSValidator, 'verify').mockResolvedValue(undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('parse', () => {
    test('test_parse_WHEN_validEmail_THEN_returnsEmailValue', async () => {
      const result = await EmailParser.parse('test@example.com');
      expect(result).toBe('test@example.com');
      expect(dnsValidatorSpy).toHaveBeenCalled();
    });

    test('test_parse_WHEN_validEmailWithUppercase_THEN_returnsLowercaseEmail', async () => {
      const result = await EmailParser.parse('TEST@EXAMPLE.COM');
      expect(result).toBe('test@example.com');
    });

    test('test_parse_WHEN_validEmailWithWhitespace_THEN_returnsTrimmedEmail', async () => {
      const result = await EmailParser.parse('  test@example.com  ');
      expect(result).toBe('test@example.com');
    });

    test('test_parse_WHEN_invalidEmailSyntax_THEN_throwsSaltoolsError', async () => {
      await expect(EmailParser.parse('invalid-email')).rejects.toThrow(SaltoolsError);
      await expect(EmailParser.parse('invalid-email')).rejects.toThrow('inválido');
    });

    test('test_parse_WHEN_emailIsNull_THEN_throwsSaltoolsError', async () => {
      await expect(EmailParser.parse(null)).rejects.toThrow(SaltoolsError);
    });

    test('test_parse_WHEN_emailIsUndefined_THEN_throwsSaltoolsError', async () => {
      await expect(EmailParser.parse(undefined)).rejects.toThrow(SaltoolsError);
    });

    test('test_parse_WHEN_emailIsNumber_THEN_throwsSaltoolsError', async () => {
      await expect(EmailParser.parse(123)).rejects.toThrow(SaltoolsError);
    });

    test('test_parse_WHEN_allowAliasFalseAndIsAlias_THEN_throwsSaltoolsError', async () => {
      await expect(EmailParser.parse('test+alias@gmail.com', { allowAlias: false })).rejects.toThrow(SaltoolsError);
      await expect(EmailParser.parse('test+alias@gmail.com', { allowAlias: false })).rejects.toThrow('alias');
    });

    test('test_parse_WHEN_allowAliasTrueAndIsAlias_THEN_returnsEmail', async () => {
      const result = await EmailParser.parse('test+alias@gmail.com', { allowAlias: true });
      expect(result).toBe('test+alias@gmail.com');
    });

    test('test_parse_WHEN_allowDisposableFalseAndIsDisposable_THEN_throwsSaltoolsError', async () => {
      await expect(EmailParser.parse('test@mailinator.com', { allowDisposable: false })).rejects.toThrow(SaltoolsError);
      await expect(EmailParser.parse('test@mailinator.com', { allowDisposable: false })).rejects.toThrow('temporário');
    });

    test('test_parse_WHEN_allowDisposableTrueAndIsDisposable_THEN_returnsEmail', async () => {
      const result = await EmailParser.parse('test@mailinator.com', { allowDisposable: true });
      expect(result).toBe('test@mailinator.com');
    });

    test('test_parse_WHEN_validateSPFFalse_THEN_passesFalseToDnsValidator', async () => {
      await EmailParser.parse('test@example.com', { validateSPF: false });
      expect(dnsValidatorSpy).toHaveBeenCalledWith(
        expect.objectContaining({ value: 'test@example.com', domain: 'example.com', local: 'test' }),
        expect.objectContaining({ validateSPF: false })
      );
    });

    test('test_parse_WHEN_validateDMARCFalse_THEN_passesFalseToDnsValidator', async () => {
      await EmailParser.parse('test@example.com', { validateDMARC: false });
      expect(dnsValidatorSpy).toHaveBeenCalledWith(
        expect.objectContaining({ value: 'test@example.com', domain: 'example.com', local: 'test' }),
        expect.objectContaining({ validateDMARC: false })
      );
    });

    test('test_parse_WHEN_validateDKIMFalse_THEN_passesFalseToDnsValidator', async () => {
      await EmailParser.parse('test@example.com', { validateDKIM: false });
      expect(dnsValidatorSpy).toHaveBeenCalledWith(
        expect.objectContaining({ value: 'test@example.com', domain: 'example.com', local: 'test' }),
        expect.objectContaining({ validateDKIM: false })
      );
    });

    test('test_parse_WHEN_validateMXFalse_THEN_passesFalseToDnsValidator', async () => {
      await EmailParser.parse('test@example.com', { validateMX: false });
      expect(dnsValidatorSpy).toHaveBeenCalledWith(
        expect.objectContaining({ value: 'test@example.com', domain: 'example.com', local: 'test' }),
        expect.objectContaining({ validateMX: false })
      );
    });

    test('test_parse_WHEN_validateSMTPFalse_THEN_passesFalseToDnsValidator', async () => {
      await EmailParser.parse('test@example.com', { validateSMTP: false });
      expect(dnsValidatorSpy).toHaveBeenCalledWith(
        expect.objectContaining({ value: 'test@example.com', domain: 'example.com', local: 'test' }),
        expect.objectContaining({ validateSMTP: false })
      );
    });

    test('test_parse_WHEN_allDnsOptionsFalse_THEN_passesAllFalseToDnsValidator', async () => {
      await EmailParser.parse('test@example.com', {
        validateSPF: false,
        validateDMARC: false,
        validateDKIM: false,
        validateMX: false,
        validateSMTP: false,
      });
      expect(dnsValidatorSpy).toHaveBeenCalledWith(
        expect.objectContaining({ value: 'test@example.com', domain: 'example.com', local: 'test' }),
        {
          allowAlias: true,
          allowDisposable: false,
          validateSPF: false,
          validateDMARC: false,
          validateDKIM: false,
          validateMX: false,
          validateSMTP: false,
          throwError: true,
        }
      );
    });

    test('test_parse_WHEN_defaultOptions_THEN_usesDefaultValues', async () => {
      await EmailParser.parse('test@example.com');
      expect(dnsValidatorSpy).toHaveBeenCalledWith(
        expect.objectContaining({ value: 'test@example.com', domain: 'example.com', local: 'test' }),
        {
          allowAlias: true,
          allowDisposable: false,
          validateSPF: true,
          validateDMARC: true,
          validateDKIM: true,
          validateMX: true,
          validateSMTP: true,
          throwError: true,
        }
      );
    });

    test('test_parse_WHEN_allowAliasIsNotBoolean_THEN_throwsSaltoolsError', async () => {
      await expect(EmailParser.parse('test@example.com', { allowAlias: 'true' })).rejects.toThrow(SaltoolsError);
    });

    test('test_parse_WHEN_allowDisposableIsNotBoolean_THEN_throwsSaltoolsError', async () => {
      await expect(EmailParser.parse('test@example.com', { allowDisposable: 'false' })).rejects.toThrow(SaltoolsError);
    });

    test('test_parse_WHEN_dnsValidatorThrowsError_THEN_propagatesError', async () => {
      const error = new SaltoolsError('DNS validation failed');
      dnsValidatorSpy.mockRejectedValue(error);
      await expect(EmailParser.parse('test@example.com')).rejects.toThrow(error);
    });

    test('test_parse_WHEN_throwErrorTrueAndInvalidEmail_THEN_throwsSaltoolsError', async () => {
      await expect(EmailParser.parse('invalid-email', { throwError: true })).rejects.toThrow(SaltoolsError);
    });

    test('test_parse_WHEN_throwErrorFalseAndInvalidEmail_THEN_returnsNull', async () => {
      const result = await EmailParser.parse('invalid-email', { throwError: false });
      expect(result).toBeNull();
    });

    test('test_parse_WHEN_throwErrorFalseAndInvalidSyntax_THEN_returnsNull', async () => {
      const result = await EmailParser.parse('not-an-email', { throwError: false });
      expect(result).toBeNull();
    });

    test('test_parse_WHEN_throwErrorFalseAndIsAlias_THEN_returnsNull', async () => {
      const result = await EmailParser.parse('test+alias@gmail.com', {
        allowAlias: false,
        throwError: false,
      });
      expect(result).toBeNull();
    });

    test('test_parse_WHEN_throwErrorFalseAndIsDisposable_THEN_returnsNull', async () => {
      const result = await EmailParser.parse('test@mailinator.com', {
        allowDisposable: false,
        throwError: false,
      });
      expect(result).toBeNull();
    });

    test('test_parse_WHEN_throwErrorFalseAndDnsValidatorThrowsError_THEN_returnsNull', async () => {
      const error = new SaltoolsError('DNS validation failed');
      dnsValidatorSpy.mockRejectedValue(error);
      const result = await EmailParser.parse('test@example.com', { throwError: false });
      expect(result).toBeNull();
    });

    test('test_parse_WHEN_throwErrorFalseAndNonSaltoolsError_THEN_propagatesError', async () => {
      const error = new Error('Non-SaltoolsError');
      dnsValidatorSpy.mockRejectedValue(error);
      await expect(EmailParser.parse('test@example.com', { throwError: false })).rejects.toThrow(error);
    });

    test('test_parse_WHEN_throwErrorDefaultTrueAndInvalidEmail_THEN_throwsSaltoolsError', async () => {
      await expect(EmailParser.parse('invalid-email')).rejects.toThrow(SaltoolsError);
    });

    test('test_parse_WHEN_throwErrorIsNotBoolean_THEN_throwsSaltoolsError', async () => {
      await expect(EmailParser.parse('test@example.com', { throwError: 'true' })).rejects.toThrow(SaltoolsError);
    });
  });
});

