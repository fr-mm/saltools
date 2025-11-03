import { describe, test, expect, jest, beforeEach, afterEach } from '@jest/globals';
import DNSValidator from 'src/commands/parse/parse-email/dns-validator.js';
import Email from 'src/commands/parse/parse-email/email.js';
import SaltoolsError from 'src/errors/saltools-error.js';
import dns from 'dns';
import net from 'net';

describe('DNSValidator', () => {
  let validator;
  let dnsResolveMxSpy;
  let dnsResolveTxtSpy;
  let netCreateConnectionSpy;

  beforeEach(() => {
    validator = new DNSValidator();
    dnsResolveMxSpy = jest.spyOn(dns.promises, 'resolveMx');
    dnsResolveTxtSpy = jest.spyOn(dns.promises, 'resolveTxt');
    netCreateConnectionSpy = jest.spyOn(net, 'createConnection');
  });

  afterEach(() => {
    dnsResolveMxSpy.mockRestore();
    dnsResolveTxtSpy.mockRestore();
    netCreateConnectionSpy.mockRestore();
  });

  test('test_verify_WHEN_notEmailInstance_THEN_throwsSaltoolsError', async () => {
    await expect(validator.verify('test@example.com')).rejects.toThrow(SaltoolsError);
  });

  test('test_verify_WHEN_noValidationFlags_THEN_completesWithoutErrors', async () => {
    const email = new Email('test@example.com');

    await validator.verify(email, {});

    expect(dnsResolveMxSpy).not.toHaveBeenCalled();
    expect(dnsResolveTxtSpy).not.toHaveBeenCalled();
  });

  test('test_verify_WHEN_validateMXFlagTrue_THEN_validatesMX', async () => {
    const email = new Email('test@example.com');
    dnsResolveMxSpy.mockResolvedValue([{ priority: 10, exchange: 'mail.example.com' }]);

    await validator.verify(email, { validateMX: true });

    expect(dnsResolveMxSpy).toHaveBeenCalledWith('example.com');
  });

  test('test_verify_WHEN_validateMXWithEmptyRecords_THEN_throwsSaltoolsError', async () => {
    const email = new Email('test@example.com');
    dnsResolveMxSpy.mockResolvedValue([]);

    await expect(validator.verify(email, { validateMX: true })).rejects.toThrow(SaltoolsError);
  });

  test('test_verify_WHEN_validateMXWithDNSError_THEN_throwsSaltoolsError', async () => {
    const email = new Email('test@example.com');
    dnsResolveMxSpy.mockRejectedValue(new Error('DNS error'));

    await expect(validator.verify(email, { validateMX: true })).rejects.toThrow(SaltoolsError);
  });

  test('test_verify_WHEN_validateSPFFlagTrue_THEN_validatesSPF', async () => {
    const email = new Email('test@example.com');
    dnsResolveTxtSpy.mockResolvedValue([['v=spf1 include:_spf.example.com']]);

    await validator.verify(email, { validateSPF: true });

    expect(dnsResolveTxtSpy).toHaveBeenCalledWith('example.com');
  });

  test('test_verify_WHEN_validateSPFWithEmptyRecords_THEN_throwsSaltoolsError', async () => {
    const email = new Email('test@example.com');
    dnsResolveTxtSpy.mockResolvedValue([]);

    await expect(validator.verify(email, { validateSPF: true })).rejects.toThrow(SaltoolsError);
  });

  test('test_verify_WHEN_validateSPFWithDNSError_THEN_throwsSaltoolsError', async () => {
    const email = new Email('test@example.com');
    dnsResolveTxtSpy.mockRejectedValue(new Error('DNS error'));

    await expect(validator.verify(email, { validateSPF: true })).rejects.toThrow(SaltoolsError);
  });

  test('test_verify_WHEN_validateDMARCFlagTrue_THEN_validatesDMARC', async () => {
    const email = new Email('test@example.com');
    dnsResolveTxtSpy.mockResolvedValue([['v=DMARC1; p=none']]);

    await validator.verify(email, { validateDMARC: true });

    expect(dnsResolveTxtSpy).toHaveBeenCalledWith('_dmarc.example.com');
  });

  test('test_verify_WHEN_validateDMARCWithEmptyRecords_THEN_throwsSaltoolsError', async () => {
    const email = new Email('test@example.com');
    dnsResolveTxtSpy.mockResolvedValue([]);

    await expect(validator.verify(email, { validateDMARC: true })).rejects.toThrow(SaltoolsError);
  });

  test('test_verify_WHEN_validateDKIMFlagTrue_THEN_validatesDKIM', async () => {
    const email = new Email('test@example.com');
    dnsResolveTxtSpy.mockResolvedValue([['v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3']]);

    await validator.verify(email, { validateDKIM: true });

    expect(dnsResolveTxtSpy).toHaveBeenCalledWith('default._domainkey.example.com');
  });

  test('test_verify_WHEN_validateDKIMWithEmptyRecords_THEN_throwsSaltoolsError', async () => {
    const email = new Email('test@example.com');
    dnsResolveTxtSpy.mockResolvedValue([]);

    await expect(validator.verify(email, { validateDKIM: true })).rejects.toThrow(SaltoolsError);
  });

  test('test_verify_WHEN_validateSMTPFlagTrue_THEN_validatesSMTP', async () => {
    const email = new Email('test@example.com');
    const mockSocket = {
      setEncoding: jest.fn(),
      setTimeout: jest.fn(),
      write: jest.fn(),
      end: jest.fn(),
      destroy: jest.fn(),
      on: jest.fn((event, handler) => {
        if (event === 'data') {
          setTimeout(() => {
            handler('220 mail.example.com ESMTP\r\n');
            handler('250 OK\r\n');
            handler('250 OK\r\n');
            handler('250 OK\r\n');
          }, 0);
        }
        return mockSocket;
      }),
    };
    dnsResolveMxSpy.mockResolvedValue([{ priority: 10, exchange: 'mail.example.com' }]);
    netCreateConnectionSpy.mockReturnValue(mockSocket);

    await validator.verify(email, { validateSMTP: true });

    expect(dnsResolveMxSpy).toHaveBeenCalledWith('example.com');
    expect(netCreateConnectionSpy).toHaveBeenCalledWith(25, 'mail.example.com');
  });

  test('test_verify_WHEN_validateSMTPWithNoMX_THEN_throwsSaltoolsError', async () => {
    const email = new Email('test@example.com');
    dnsResolveMxSpy.mockResolvedValue([]);

    await expect(validator.verify(email, { validateSMTP: true })).rejects.toThrow(SaltoolsError);
  });

  test('test_verify_WHEN_validateSMTPWithEmptyMXHost_THEN_throwsSaltoolsError', async () => {
    const email = new Email('test@example.com');
    dnsResolveMxSpy.mockResolvedValue([{ priority: 10, exchange: null }]);

    await expect(validator.verify(email, { validateSMTP: true })).rejects.toThrow(SaltoolsError);
  });

  test('test_verify_WHEN_validateSMTPWithInvalidResponse_THEN_throwsSaltoolsError', async () => {
    const email = new Email('test@example.com');
    const mockSocket = {
      setEncoding: jest.fn(),
      setTimeout: jest.fn(),
      write: jest.fn(),
      end: jest.fn(),
      destroy: jest.fn(),
      on: jest.fn((event, handler) => {
        if (event === 'data') {
          setTimeout(() => {
            handler('220 mail.example.com ESMTP\r\n');
            handler('250 OK\r\n');
            handler('250 OK\r\n');
            handler('550 Mailbox unavailable\r\n');
          }, 0);
        }
        return mockSocket;
      }),
    };
    dnsResolveMxSpy.mockResolvedValue([{ priority: 10, exchange: 'mail.example.com' }]);
    netCreateConnectionSpy.mockReturnValue(mockSocket);

    await expect(validator.verify(email, { validateSMTP: true })).rejects.toThrow(SaltoolsError);
  });

  test('test_verify_WHEN_validateSMTPWithSocketError_THEN_throwsSaltoolsError', async () => {
    const email = new Email('test@example.com');
    const mockSocket = {
      setEncoding: jest.fn(),
      setTimeout: jest.fn(),
      write: jest.fn(),
      end: jest.fn(),
      destroy: jest.fn(),
      on: jest.fn((event, handler) => {
        if (event === 'error') {
          setTimeout(() => handler(new Error('Connection error')), 0);
        }
        return mockSocket;
      }),
    };
    dnsResolveMxSpy.mockResolvedValue([{ priority: 10, exchange: 'mail.example.com' }]);
    netCreateConnectionSpy.mockReturnValue(mockSocket);

    await expect(validator.verify(email, { validateSMTP: true })).rejects.toThrow(SaltoolsError);
  });

  test('test_verify_WHEN_validateSMTPWithTimeout_THEN_throwsSaltoolsError', async () => {
    const email = new Email('test@example.com');
    const mockSocket = {
      setEncoding: jest.fn(),
      setTimeout: jest.fn(),
      write: jest.fn(),
      end: jest.fn(),
      destroy: jest.fn(),
      on: jest.fn((event, handler) => {
        if (event === 'timeout') {
          setTimeout(() => handler(), 0);
        }
        return mockSocket;
      }),
    };
    dnsResolveMxSpy.mockResolvedValue([{ priority: 10, exchange: 'mail.example.com' }]);
    netCreateConnectionSpy.mockReturnValue(mockSocket);

    await expect(validator.verify(email, { validateSMTP: true })).rejects.toThrow(SaltoolsError);
  });

  test('test_verify_WHEN_multipleValidations_THEN_runsAllValidations', async () => {
    const email = new Email('test@example.com');
    dnsResolveMxSpy.mockResolvedValue([{ priority: 10, exchange: 'mail.example.com' }]);
    dnsResolveTxtSpy.mockResolvedValue([['v=spf1 include:_spf.example.com']]);
    const mockSocket = {
      setEncoding: jest.fn(),
      setTimeout: jest.fn(),
      write: jest.fn(),
      end: jest.fn(),
      destroy: jest.fn(),
      on: jest.fn((event, handler) => {
        if (event === 'data') {
          setTimeout(() => {
            handler('220 mail.example.com ESMTP\r\n');
            handler('250 OK\r\n');
            handler('250 OK\r\n');
            handler('250 OK\r\n');
          }, 0);
        }
        return mockSocket;
      }),
    };
    netCreateConnectionSpy.mockReturnValue(mockSocket);

    await validator.verify(email, {
      validateSPF: true,
      validateDMARC: true,
      validateDKIM: true,
      validateMX: true,
      validateSMTP: true,
    });

    expect(dnsResolveMxSpy).toHaveBeenCalled();
    expect(dnsResolveTxtSpy).toHaveBeenCalled();
    expect(netCreateConnectionSpy).toHaveBeenCalled();
  });

  test('test_verify_WHEN_validateSMTPWithMXPrioritySort_THEN_usesLowestPriority', async () => {
    const email = new Email('test@example.com');
    const mockSocket = {
      setEncoding: jest.fn(),
      setTimeout: jest.fn(),
      write: jest.fn(),
      end: jest.fn(),
      destroy: jest.fn(),
      on: jest.fn((event, handler) => {
        if (event === 'data') {
          setTimeout(() => {
            handler('220 mail.example.com ESMTP\r\n');
            handler('250 OK\r\n');
            handler('250 OK\r\n');
            handler('250 OK\r\n');
          }, 0);
        }
        return mockSocket;
      }),
    };
    dnsResolveMxSpy.mockResolvedValue([
      { priority: 20, exchange: 'mail2.example.com' },
      { priority: 10, exchange: 'mail1.example.com' },
    ]);
    netCreateConnectionSpy.mockReturnValue(mockSocket);

    await validator.verify(email, { validateSMTP: true });

    expect(netCreateConnectionSpy).toHaveBeenCalledWith(25, 'mail1.example.com');
  });
});

