import { describe, test, expect, jest, beforeEach } from '@jest/globals';
import EmailParser from 'src/commands/parse/parse-email/email-parser.js';
import Email from 'src/commands/parse/parse-email/email.js';
import DNSValidator from 'src/commands/parse/parse-email/dns-validator.js';
import AliasVerifier from 'src/commands/parse/parse-email/alias-verifier.js';
import DisposableVerifier from 'src/commands/parse/parse-email/disposable-verifier.js';
import MailboxVerifier from 'src/commands/parse/parse-email/mailbox-verifier.js';
import NeverbounceVerifier from 'src/commands/parse/parse-email/neverbounce-verifier.js';
import SaltoolsError from 'src/errors/saltools-error.js';

describe('EmailParser', () => {
  let mockDnsValidator;
  let mockAliasVerifier;
  let mockDisposableVerifier;
  let mockMailboxVerifier;
  let mockNeverbounceVerifier;
  let emailParser;

  beforeEach(() => {
    mockDnsValidator = {
      verify: jest.fn().mockResolvedValue(undefined),
    };
    mockAliasVerifier = {
      isAlias: jest.fn().mockReturnValue(false),
    };
    mockDisposableVerifier = {
      isDisposable: jest.fn().mockReturnValue(false),
    };
    mockMailboxVerifier = {
      verify: jest.fn().mockResolvedValue(undefined),
    };
    mockNeverbounceVerifier = {
      verify: jest.fn().mockResolvedValue(undefined),
    };
    emailParser = new EmailParser({
      dnsValidator: mockDnsValidator,
      aliasVerifier: mockAliasVerifier,
      disposableVerifier: mockDisposableVerifier,
      mailboxVerifier: mockMailboxVerifier,
      neverbounceVerifier: mockNeverbounceVerifier,
    });
  });

  describe('constructor', () => {
    test('test_constructor_WHEN_noOptions_THEN_createsInstanceWithDefaults', () => {
      const parser = new EmailParser();
      expect(parser).toBeInstanceOf(EmailParser);
    });

    test('test_constructor_WHEN_withDependencies_THEN_usesInjectedDependencies', () => {
      const parser = new EmailParser({
        dnsValidator: mockDnsValidator,
        aliasVerifier: mockAliasVerifier,
        disposableVerifier: mockDisposableVerifier,
        mailboxVerifier: mockMailboxVerifier,
        neverbounceVerifier: mockNeverbounceVerifier,
      });
      expect(parser).toBeInstanceOf(EmailParser);
    });
  });

  describe('parse', () => {
    test('test_parse_WHEN_validEmail_THEN_returnsEmailValue', async () => {
      const result = await emailParser.parse('test@example.com');
      expect(result).toBe('test@example.com');
      expect(mockDnsValidator.verify).toHaveBeenCalled();
    });

    test('test_parse_WHEN_validEmailWithUppercase_THEN_returnsLowercaseEmail', async () => {
      const result = await emailParser.parse('TEST@EXAMPLE.COM');
      expect(result).toBe('test@example.com');
    });

    test('test_parse_WHEN_validEmailWithWhitespace_THEN_returnsTrimmedEmail', async () => {
      const result = await emailParser.parse('  test@example.com  ');
      expect(result).toBe('test@example.com');
    });

    test('test_parse_WHEN_invalidEmailSyntax_THEN_throwsSaltoolsError', async () => {
      await expect(emailParser.parse('invalid-email')).rejects.toThrow(SaltoolsError);
      await expect(emailParser.parse('invalid-email')).rejects.toThrow('inválido');
    });

    test('test_parse_WHEN_emailIsNull_THEN_throwsTypeError', async () => {
      await expect(emailParser.parse(null)).rejects.toThrow(TypeError);
    });

    test('test_parse_WHEN_emailIsUndefined_THEN_throwsTypeError', async () => {
      await expect(emailParser.parse(undefined)).rejects.toThrow(TypeError);
    });

    test('test_parse_WHEN_emailIsNumber_THEN_throwsSaltoolsError', async () => {
      await expect(emailParser.parse(123)).rejects.toThrow(SaltoolsError);
    });

    test('test_parse_WHEN_allowAliasFalseAndIsAlias_THEN_throwsSaltoolsError', async () => {
      mockAliasVerifier.isAlias.mockReturnValue(true);
      await expect(emailParser.parse('test+alias@gmail.com', { allowAlias: false })).rejects.toThrow(SaltoolsError);
      await expect(emailParser.parse('test+alias@gmail.com', { allowAlias: false })).rejects.toThrow('alias');
    });

    test('test_parse_WHEN_allowAliasTrueAndIsAlias_THEN_returnsEmail', async () => {
      mockAliasVerifier.isAlias.mockReturnValue(true);
      const result = await emailParser.parse('test+alias@gmail.com', { allowAlias: true });
      expect(result).toBe('test+alias@gmail.com');
    });

    test('test_parse_WHEN_allowDisposableFalseAndIsDisposable_THEN_throwsSaltoolsError', async () => {
      mockDisposableVerifier.isDisposable.mockReturnValue(true);
      await expect(emailParser.parse('test@mailinator.com', { allowDisposable: false })).rejects.toThrow(SaltoolsError);
      await expect(emailParser.parse('test@mailinator.com', { allowDisposable: false })).rejects.toThrow('temporário');
    });

    test('test_parse_WHEN_allowDisposableTrueAndIsDisposable_THEN_returnsEmail', async () => {
      mockDisposableVerifier.isDisposable.mockReturnValue(true);
      const result = await emailParser.parse('test@mailinator.com', { allowDisposable: true });
      expect(result).toBe('test@mailinator.com');
    });

    test('test_parse_WHEN_useMailboxTrue_THEN_callsMailboxVerifier', async () => {
      await emailParser.parse('test@example.com', { useMailbox: true });
      expect(mockMailboxVerifier.verify).toHaveBeenCalledWith(expect.any(Email));
    });

    test('test_parse_WHEN_useMailboxFalse_THEN_doesNotCallMailboxVerifier', async () => {
      await emailParser.parse('test@example.com', { useMailbox: false });
      expect(mockMailboxVerifier.verify).not.toHaveBeenCalled();
    });

    test('test_parse_WHEN_useNeverbounceTrue_THEN_callsNeverbounceVerifier', async () => {
      await emailParser.parse('test@example.com', { useNeverbounce: true });
      expect(mockNeverbounceVerifier.verify).toHaveBeenCalledWith(expect.any(Email));
    });

    test('test_parse_WHEN_useNeverbounceFalse_THEN_doesNotCallNeverbounceVerifier', async () => {
      await emailParser.parse('test@example.com', { useNeverbounce: false });
      expect(mockNeverbounceVerifier.verify).not.toHaveBeenCalled();
    });

    test('test_parse_WHEN_validateSPFFalse_THEN_passesFalseToDnsValidator', async () => {
      await emailParser.parse('test@example.com', { validateSPF: false });
      expect(mockDnsValidator.verify).toHaveBeenCalledWith(
        expect.any(Email),
        expect.objectContaining({ validateSPF: false })
      );
    });

    test('test_parse_WHEN_validateDMARCFalse_THEN_passesFalseToDnsValidator', async () => {
      await emailParser.parse('test@example.com', { validateDMARC: false });
      expect(mockDnsValidator.verify).toHaveBeenCalledWith(
        expect.any(Email),
        expect.objectContaining({ validateDMARC: false })
      );
    });

    test('test_parse_WHEN_validateDKIMFalse_THEN_passesFalseToDnsValidator', async () => {
      await emailParser.parse('test@example.com', { validateDKIM: false });
      expect(mockDnsValidator.verify).toHaveBeenCalledWith(
        expect.any(Email),
        expect.objectContaining({ validateDKIM: false })
      );
    });

    test('test_parse_WHEN_validateMXFalse_THEN_passesFalseToDnsValidator', async () => {
      await emailParser.parse('test@example.com', { validateMX: false });
      expect(mockDnsValidator.verify).toHaveBeenCalledWith(
        expect.any(Email),
        expect.objectContaining({ validateMX: false })
      );
    });

    test('test_parse_WHEN_validateSMTPFalse_THEN_passesFalseToDnsValidator', async () => {
      await emailParser.parse('test@example.com', { validateSMTP: false });
      expect(mockDnsValidator.verify).toHaveBeenCalledWith(
        expect.any(Email),
        expect.objectContaining({ validateSMTP: false })
      );
    });

    test('test_parse_WHEN_allDnsOptionsFalse_THEN_passesAllFalseToDnsValidator', async () => {
      await emailParser.parse('test@example.com', {
        validateSPF: false,
        validateDMARC: false,
        validateDKIM: false,
        validateMX: false,
        validateSMTP: false,
      });
      expect(mockDnsValidator.verify).toHaveBeenCalledWith(
        expect.any(Email),
        {
          validateSPF: false,
          validateDMARC: false,
          validateDKIM: false,
          validateMX: false,
          validateSMTP: false,
        }
      );
    });

    test('test_parse_WHEN_defaultOptions_THEN_usesDefaultValues', async () => {
      await emailParser.parse('test@example.com');
      expect(mockDnsValidator.verify).toHaveBeenCalledWith(
        expect.any(Email),
        {
          validateSPF: true,
          validateDMARC: true,
          validateDKIM: true,
          validateMX: true,
          validateSMTP: true,
        }
      );
      expect(mockMailboxVerifier.verify).not.toHaveBeenCalled();
      expect(mockNeverbounceVerifier.verify).not.toHaveBeenCalled();
      expect(mockAliasVerifier.isAlias).toHaveBeenCalled();
      expect(mockDisposableVerifier.isDisposable).toHaveBeenCalled();
    });

    test('test_parse_WHEN_allowAliasIsNotBoolean_THEN_throwsSaltoolsError', async () => {
      await expect(emailParser.parse('test@example.com', { allowAlias: 'true' })).rejects.toThrow(SaltoolsError);
    });

    test('test_parse_WHEN_allowDisposableIsNotBoolean_THEN_throwsSaltoolsError', async () => {
      await expect(emailParser.parse('test@example.com', { allowDisposable: 'false' })).rejects.toThrow(SaltoolsError);
    });

    test('test_parse_WHEN_useMailboxIsNotBoolean_THEN_throwsSaltoolsError', async () => {
      await expect(emailParser.parse('test@example.com', { useMailbox: 'true' })).rejects.toThrow(SaltoolsError);
    });

    test('test_parse_WHEN_useNeverbounceIsNotBoolean_THEN_throwsSaltoolsError', async () => {
      await expect(emailParser.parse('test@example.com', { useNeverbounce: 'false' })).rejects.toThrow(SaltoolsError);
    });

    test('test_parse_WHEN_dnsValidatorThrowsError_THEN_propagatesError', async () => {
      const error = new SaltoolsError('DNS validation failed');
      mockDnsValidator.verify.mockRejectedValue(error);
      await expect(emailParser.parse('test@example.com')).rejects.toThrow(error);
    });

    test('test_parse_WHEN_mailboxVerifierThrowsError_THEN_propagatesError', async () => {
      const error = new SaltoolsError('Mailbox validation failed');
      mockMailboxVerifier.verify.mockRejectedValue(error);
      await expect(emailParser.parse('test@example.com', { useMailbox: true })).rejects.toThrow(error);
    });

    test('test_parse_WHEN_neverbounceVerifierThrowsError_THEN_propagatesError', async () => {
      const error = new SaltoolsError('Neverbounce validation failed');
      mockNeverbounceVerifier.verify.mockRejectedValue(error);
      await expect(emailParser.parse('test@example.com', { useNeverbounce: true })).rejects.toThrow(error);
    });
  });
});

