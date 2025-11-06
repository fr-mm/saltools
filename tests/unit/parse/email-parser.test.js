import { describe, test, expect } from '@jest/globals';
import EmailParser from 'src/commands/parse/email-parser.js';
import SaltoolsError from 'src/errors/saltools-error.js';

describe('EmailParser', () => {

  describe('parse', () => {
    test('test_parse_WHEN_validEmail_THEN_returnsEmailValue', async () => {
      const result = await EmailParser.parse('test@example.com');
      expect(result).toBe('test@example.com');
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

    test('test_parse_WHEN_emptyString_THEN_throwsSaltoolsError', async () => {
      await expect(EmailParser.parse('')).rejects.toThrow(SaltoolsError);
    });

    test('test_parse_WHEN_onlyAtSign_THEN_throwsSaltoolsError', async () => {
      await expect(EmailParser.parse('@')).rejects.toThrow(SaltoolsError);
      await expect(EmailParser.parse('@')).rejects.toThrow('inválido');
    });

    test('test_parse_WHEN_missingLocalPart_THEN_throwsSaltoolsError', async () => {
      await expect(EmailParser.parse('@example.com')).rejects.toThrow(SaltoolsError);
      await expect(EmailParser.parse('@example.com')).rejects.toThrow('inválido');
    });

    test('test_parse_WHEN_missingDomainPart_THEN_throwsSaltoolsError', async () => {
      await expect(EmailParser.parse('test@')).rejects.toThrow(SaltoolsError);
      await expect(EmailParser.parse('test@')).rejects.toThrow('inválido');
    });

    test('test_parse_WHEN_multipleAtSigns_THEN_throwsSaltoolsError', async () => {
      await expect(EmailParser.parse('test@@example.com')).rejects.toThrow(SaltoolsError);
    });

    test('test_parse_WHEN_whitespaceOnly_THEN_throwsSaltoolsError', async () => {
      await expect(EmailParser.parse('   ')).rejects.toThrow(SaltoolsError);
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

    test('test_parse_WHEN_aliasWithDotCharacter_THEN_detectsAsAlias', async () => {
      await expect(EmailParser.parse('test.alias@gmail.com', { allowAlias: false })).rejects.toThrow(SaltoolsError);
      await expect(EmailParser.parse('test.alias@gmail.com', { allowAlias: false })).rejects.toThrow('alias');
    });

    test('test_parse_WHEN_aliasWithDotAndAllowAliasTrue_THEN_returnsEmail', async () => {
      const result = await EmailParser.parse('test.alias@gmail.com', { allowAlias: true });
      expect(result).toBe('test.alias@gmail.com');
    });

    test('test_parse_WHEN_gmailWithoutAliasCharacters_THEN_notTreatedAsAlias', async () => {
      const result = await EmailParser.parse('test@gmail.com', { allowAlias: false });
      expect(result).toBe('test@gmail.com');
    });

    test('test_parse_WHEN_nonGmailDomainWithPlus_THEN_notTreatedAsAlias', async () => {
      const result = await EmailParser.parse('test+alias@example.com', { allowAlias: false });
      expect(result).toBe('test+alias@example.com');
    });

    test('test_parse_WHEN_allowDisposableFalseAndIsDisposable_THEN_throwsSaltoolsError', async () => {
      await expect(EmailParser.parse('test@mailinator.com', { allowDisposable: false })).rejects.toThrow(SaltoolsError);
      await expect(EmailParser.parse('test@mailinator.com', { allowDisposable: false })).rejects.toThrow('temporário');
    });

    test('test_parse_WHEN_allowDisposableTrueAndIsDisposable_THEN_returnsEmail', async () => {
      const result = await EmailParser.parse('test@mailinator.com', { allowDisposable: true });
      expect(result).toBe('test@mailinator.com');
    });

    test('test_parse_WHEN_tempmailDomain_THEN_detectsAsDisposable', async () => {
      await expect(EmailParser.parse('test@tempmail.com', { allowDisposable: false })).rejects.toThrow(SaltoolsError);
      await expect(EmailParser.parse('test@tempmail.com', { allowDisposable: false })).rejects.toThrow('temporário');
    });

    test('test_parse_WHEN_dispostableDomain_THEN_detectsAsDisposable', async () => {
      await expect(EmailParser.parse('test@dispostable.com', { allowDisposable: false })).rejects.toThrow(SaltoolsError);
      await expect(EmailParser.parse('test@dispostable.com', { allowDisposable: false })).rejects.toThrow('temporário');
    });

    test('test_parse_WHEN_allowAliasIsNotBoolean_THEN_throwsSaltoolsError', async () => {
      await expect(EmailParser.parse('test@example.com', { allowAlias: 'true' })).rejects.toThrow(SaltoolsError);
    });

    test('test_parse_WHEN_allowDisposableIsNotBoolean_THEN_throwsSaltoolsError', async () => {
      await expect(EmailParser.parse('test@example.com', { allowDisposable: 'false' })).rejects.toThrow(SaltoolsError);
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

    test('test_parse_WHEN_throwErrorDefaultTrueAndInvalidEmail_THEN_throwsSaltoolsError', async () => {
      await expect(EmailParser.parse('invalid-email')).rejects.toThrow(SaltoolsError);
    });

    test('test_parse_WHEN_throwErrorIsNotBoolean_THEN_throwsSaltoolsError', async () => {
      await expect(EmailParser.parse('test@example.com', { throwError: 'true' })).rejects.toThrow(SaltoolsError);
    });

    test('test_parse_WHEN_defaultOptions_THEN_usesDefaultValues', async () => {
      const result = await EmailParser.parse('test@example.com');
      expect(result).toBe('test@example.com');
    });

    test('test_parse_WHEN_defaultOptionsAllowAlias_THEN_allowsAlias', async () => {
      const result = await EmailParser.parse('test+alias@gmail.com');
      expect(result).toBe('test+alias@gmail.com');
    });

    test('test_parse_WHEN_defaultOptionsDisallowDisposable_THEN_blocksDisposable', async () => {
      await expect(EmailParser.parse('test@mailinator.com')).rejects.toThrow(SaltoolsError);
      await expect(EmailParser.parse('test@mailinator.com')).rejects.toThrow('temporário');
    });

    test('test_parse_WHEN_emptyOptionsObject_THEN_usesDefaults', async () => {
      const result = await EmailParser.parse('test@example.com', {});
      expect(result).toBe('test@example.com');
    });

    test('test_parse_WHEN_validEmailWithSpecialCharacters_THEN_returnsEmail', async () => {
      const result = await EmailParser.parse('user.name+tag@example.co.uk');
      expect(result).toBe('user.name+tag@example.co.uk');
    });

    test('test_parse_WHEN_validEmailWithNumbers_THEN_returnsEmail', async () => {
      const result = await EmailParser.parse('user123@example123.com');
      expect(result).toBe('user123@example123.com');
    });

    test('test_parse_WHEN_validEmailWithHyphens_THEN_returnsEmail', async () => {
      const result = await EmailParser.parse('user-name@example-domain.com');
      expect(result).toBe('user-name@example-domain.com');
    });

    test('test_parse_WHEN_throwErrorFalseAndEmptyString_THEN_returnsNull', async () => {
      const result = await EmailParser.parse('', { throwError: false });
      expect(result).toBeNull();
    });

    test('test_parse_WHEN_throwErrorFalseAndOnlyAtSign_THEN_returnsNull', async () => {
      const result = await EmailParser.parse('@', { throwError: false });
      expect(result).toBeNull();
    });
  });
});

