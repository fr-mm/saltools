import { describe, test, expect, jest, beforeEach, afterEach } from '@jest/globals';
import DNSParser from 'src/commands/parse/parse-dns.js';
import SaltoolsError from 'src/errors/saltools-error.js';
import dns from 'dns';
import net from 'net';

describe('DNSParser', () => {
  let dnsResolveMxSpy;
  let dnsResolveTxtSpy;
  let netCreateConnectionSpy;

  beforeEach(() => {
    dnsResolveMxSpy = jest.spyOn(dns.promises, 'resolveMx');
    dnsResolveTxtSpy = jest.spyOn(dns.promises, 'resolveTxt');
    netCreateConnectionSpy = jest.spyOn(net, 'createConnection');
  });

  afterEach(() => {
    dnsResolveMxSpy.mockRestore();
    dnsResolveTxtSpy.mockRestore();
    netCreateConnectionSpy.mockRestore();
  });

  test('test_parse_WHEN_emailString_THEN_extractsDomainAndValidates', async () => {
    dnsResolveMxSpy.mockResolvedValue([{ priority: 10, exchange: 'mail.example.com' }]);
    dnsResolveTxtSpy.mockResolvedValue([['v=spf1 include:_spf.example.com']]);

    const result = await DNSParser.parse('test@example.com', {
      validateSPF: true,
      validateMX: true,
      validateDMARC: false,
      validateDKIM: false,
      validateSMTP: false,
    });

    expect(result).toBe('example.com');
    expect(dnsResolveMxSpy).toHaveBeenCalledWith('example.com');
    expect(dnsResolveTxtSpy).toHaveBeenCalledWith('example.com');
  });

  test('test_parse_WHEN_domainString_THEN_validatesDomain', async () => {
    dnsResolveMxSpy.mockResolvedValue([{ priority: 10, exchange: 'mail.example.com' }]);
    dnsResolveTxtSpy.mockResolvedValue([['v=spf1 include:_spf.example.com']]);

    const result = await DNSParser.parse('example.com', {
      validateSPF: true,
      validateMX: true,
      validateDMARC: false,
      validateDKIM: false,
      validateSMTP: false,
    });

    expect(result).toBe('example.com');
    expect(dnsResolveMxSpy).toHaveBeenCalledWith('example.com');
  });

  test('test_parse_WHEN_noValidationFlags_THEN_completesWithoutErrors', async () => {
    const result = await DNSParser.parse('test@example.com', {
      validateSPF: false,
      validateDMARC: false,
      validateDKIM: false,
      validateMX: false,
      validateSMTP: false,
    });

    expect(result).toBe('example.com');
    expect(dnsResolveMxSpy).not.toHaveBeenCalled();
    expect(dnsResolveTxtSpy).not.toHaveBeenCalled();
  });

  test('test_parse_WHEN_validateMXFlagTrue_THEN_validatesMX', async () => {
    dnsResolveMxSpy.mockResolvedValue([{ priority: 10, exchange: 'mail.example.com' }]);

    await DNSParser.parse('test@example.com', {
      validateMX: true,
      validateSPF: false,
      validateDMARC: false,
      validateDKIM: false,
      validateSMTP: false,
    });

    expect(dnsResolveMxSpy).toHaveBeenCalledWith('example.com');
  });

  test('test_parse_WHEN_validateMXWithEmptyRecords_THEN_throwsSaltoolsError', async () => {
    dnsResolveMxSpy.mockResolvedValue([]);

    await expect(DNSParser.parse('test@example.com', { validateMX: true })).rejects.toThrow(
      SaltoolsError
    );
  });

  test('test_parse_WHEN_validateMXWithDNSError_THEN_throwsSaltoolsError', async () => {
    dnsResolveMxSpy.mockRejectedValue(new Error('DNS error'));

    await expect(DNSParser.parse('test@example.com', { validateMX: true })).rejects.toThrow(
      SaltoolsError
    );
  });

  test('test_parse_WHEN_validateSPFFlagTrue_THEN_validatesSPF', async () => {
    dnsResolveTxtSpy.mockResolvedValue([['v=spf1 include:_spf.example.com']]);

    await DNSParser.parse('test@example.com', {
      validateSPF: true,
      validateDMARC: false,
      validateDKIM: false,
      validateMX: false,
      validateSMTP: false,
    });

    expect(dnsResolveTxtSpy).toHaveBeenCalledWith('example.com');
  });

  test('test_parse_WHEN_validateSPFWithEmptyRecords_THEN_throwsSaltoolsError', async () => {
    dnsResolveTxtSpy.mockResolvedValue([]);

    await expect(DNSParser.parse('test@example.com', { validateSPF: true })).rejects.toThrow(
      SaltoolsError
    );
  });

  test('test_parse_WHEN_validateSPFWithDNSError_THEN_throwsSaltoolsError', async () => {
    dnsResolveTxtSpy.mockRejectedValue(new Error('DNS error'));

    await expect(DNSParser.parse('test@example.com', { validateSPF: true })).rejects.toThrow(
      SaltoolsError
    );
  });

  test('test_parse_WHEN_validateDMARCFlagTrue_THEN_validatesDMARC', async () => {
    dnsResolveTxtSpy.mockResolvedValue([['v=DMARC1; p=none']]);

    await DNSParser.parse('test@example.com', {
      validateDMARC: true,
      validateSPF: false,
      validateDKIM: false,
      validateMX: false,
      validateSMTP: false,
    });

    expect(dnsResolveTxtSpy).toHaveBeenCalledWith('_dmarc.example.com');
  });

  test('test_parse_WHEN_validateDMARCWithEmptyRecords_THEN_throwsSaltoolsError', async () => {
    dnsResolveTxtSpy.mockResolvedValue([]);

    await expect(DNSParser.parse('test@example.com', { validateDMARC: true })).rejects.toThrow(
      SaltoolsError
    );
  });

  test('test_parse_WHEN_validateDKIMFlagTrue_THEN_validatesDKIM', async () => {
    dnsResolveTxtSpy.mockResolvedValue([['v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3']]);

    await DNSParser.parse('test@example.com', {
      validateDKIM: true,
      validateSPF: false,
      validateDMARC: false,
      validateMX: false,
      validateSMTP: false,
    });

    expect(dnsResolveTxtSpy).toHaveBeenCalledWith('default._domainkey.example.com');
  });

  test('test_parse_WHEN_validateDKIMWithEmptyRecords_THEN_throwsSaltoolsError', async () => {
    dnsResolveTxtSpy.mockResolvedValue([]);

    await expect(DNSParser.parse('test@example.com', { validateDKIM: true })).rejects.toThrow(
      SaltoolsError
    );
  });

  test('test_parse_WHEN_validateSMTPFlagTrue_THEN_validatesSMTP', async () => {
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

    await DNSParser.parse('test@example.com', { validateSMTP: true });

    expect(dnsResolveMxSpy).toHaveBeenCalledWith('example.com');
    expect(netCreateConnectionSpy).toHaveBeenCalledWith(25, 'mail.example.com');
  });

  test('test_parse_WHEN_validateSMTPWithNoMX_THEN_throwsSaltoolsError', async () => {
    dnsResolveMxSpy.mockResolvedValue([]);

    await expect(DNSParser.parse('test@example.com', { validateSMTP: true })).rejects.toThrow(
      SaltoolsError
    );
  });

  test('test_parse_WHEN_validateSMTPWithEmptyMXHost_THEN_throwsSaltoolsError', async () => {
    dnsResolveMxSpy.mockResolvedValue([{ priority: 10, exchange: null }]);

    await expect(DNSParser.parse('test@example.com', { validateSMTP: true })).rejects.toThrow(
      SaltoolsError
    );
  });

  test('test_parse_WHEN_validateSMTPWithInvalidResponse_THEN_throwsSaltoolsError', async () => {
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

    await expect(DNSParser.parse('test@example.com', { validateSMTP: true })).rejects.toThrow(
      SaltoolsError
    );
  });

  test('test_parse_WHEN_validateSMTPWithSocketError_THEN_throwsSaltoolsError', async () => {
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

    await expect(DNSParser.parse('test@example.com', { validateSMTP: true })).rejects.toThrow(
      SaltoolsError
    );
  });

  test('test_parse_WHEN_validateSMTPWithTimeout_THEN_throwsSaltoolsError', async () => {
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

    await expect(DNSParser.parse('test@example.com', { validateSMTP: true })).rejects.toThrow(
      SaltoolsError
    );
  });

  test('test_parse_WHEN_multipleValidations_THEN_runsAllValidations', async () => {
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

    await DNSParser.parse('test@example.com', {
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

  test('test_parse_WHEN_validateSMTPWithMXPrioritySort_THEN_usesLowestPriority', async () => {
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

    await DNSParser.parse('test@example.com', { validateSMTP: true });

    expect(netCreateConnectionSpy).toHaveBeenCalledWith(25, 'mail1.example.com');
  });

  test('test_parse_WHEN_throwErrorFalseAndError_THEN_returnsNull', async () => {
    dnsResolveMxSpy.mockResolvedValue([]);

    const result = await DNSParser.parse('test@example.com', {
      validateMX: true,
      throwError: false,
    });

    expect(result).toBeNull();
  });
});

