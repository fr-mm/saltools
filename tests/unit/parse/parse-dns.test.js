import { describe, test, expect, jest, beforeEach, afterEach } from '@jest/globals';
import DNSParser from 'src/commands/parse/parse-dns.js';
import SaltoolsError from 'src/errors/saltools-error.js';
import dns from 'dns';
import net from 'net';

describe('DNSParser', () => {
  let dnsResolveMxSpy;
  let netCreateConnectionSpy;

  beforeEach(() => {
    dnsResolveMxSpy = jest.spyOn(dns.promises, 'resolveMx');
    netCreateConnectionSpy = jest.spyOn(net, 'createConnection');
  });

  afterEach(() => {
    dnsResolveMxSpy.mockRestore();
    netCreateConnectionSpy.mockRestore();
  });

  test('test_parse_WHEN_emailString_THEN_extractsDomainAndValidates', async () => {
    dnsResolveMxSpy.mockResolvedValue([{ priority: 10, exchange: 'mail.example.com' }]);

    const result = await DNSParser.parse('test@example.com', {
      validateMX: true,
      validateSMTP: false,
    });

    expect(result).toBe('example.com');
    expect(dnsResolveMxSpy).toHaveBeenCalledWith('example.com');
  });

  test('test_parse_WHEN_domainString_THEN_validatesDomain', async () => {
    dnsResolveMxSpy.mockResolvedValue([{ priority: 10, exchange: 'mail.example.com' }]);

    const result = await DNSParser.parse('example.com', {
      validateMX: true,
      validateSMTP: false,
    });

    expect(result).toBe('example.com');
    expect(dnsResolveMxSpy).toHaveBeenCalledWith('example.com');
  });

  test('test_parse_WHEN_noValidationFlags_THEN_completesWithoutErrors', async () => {
    const result = await DNSParser.parse('test@example.com', {
      validateMX: false,
      validateSMTP: false,
    });

    expect(result).toBe('example.com');
    expect(dnsResolveMxSpy).not.toHaveBeenCalled();
  });

  test('test_parse_WHEN_validateMXFlagTrue_THEN_validatesMX', async () => {
    dnsResolveMxSpy.mockResolvedValue([{ priority: 10, exchange: 'mail.example.com' }]);

    await DNSParser.parse('test@example.com', {
      validateMX: true,
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
      validateMX: true,
      validateSMTP: true,
    });

    expect(dnsResolveMxSpy).toHaveBeenCalled();
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

