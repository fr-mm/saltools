import { describe, test, expect } from '@jest/globals';
import AliasVerifier from 'src/commands/parse/parse-email/alias-verifier.js';
import Email from 'src/commands/parse/parse-email/email.js';
import SaltoolsError from 'src/errors/saltools-error.js';

describe('AliasVerifier', () => {
  test('test_isAlias_WHEN_gmailWithPlusAlias_THEN_returnsTrue', () => {
    const verifier = new AliasVerifier();
    const email = new Email('test+alias@gmail.com');

    const result = verifier.isAlias(email);

    expect(result).toBe(true);
  });

  test('test_isAlias_WHEN_gmailWithDotAlias_THEN_returnsTrue', () => {
    const verifier = new AliasVerifier();
    const email = new Email('test.name@gmail.com');

    const result = verifier.isAlias(email);

    expect(result).toBe(true);
  });

  test('test_isAlias_WHEN_gmailWithPlusAndDotAlias_THEN_returnsTrue', () => {
    const verifier = new AliasVerifier();
    const email = new Email('test.name+alias@gmail.com');

    const result = verifier.isAlias(email);

    expect(result).toBe(true);
  });

  test('test_isAlias_WHEN_gmailWithoutAlias_THEN_returnsFalse', () => {
    const verifier = new AliasVerifier();
    const email = new Email('test@gmail.com');

    const result = verifier.isAlias(email);

    expect(result).toBe(false);
  });

  test('test_isAlias_WHEN_nonGmailDomain_THEN_returnsFalse', () => {
    const verifier = new AliasVerifier();
    const email = new Email('test+alias@example.com');

    const result = verifier.isAlias(email);

    expect(result).toBe(false);
  });

  test('test_isAlias_WHEN_nonGmailDomainWithDot_THEN_returnsFalse', () => {
    const verifier = new AliasVerifier();
    const email = new Email('test.name@example.com');

    const result = verifier.isAlias(email);

    expect(result).toBe(false);
  });

  test('test_isAlias_WHEN_notEmailInstance_THEN_throwsSaltoolsError', () => {
    const verifier = new AliasVerifier();

    expect(() => {
      verifier.isAlias('test@gmail.com');
    }).toThrow(SaltoolsError);
  });

  test('test_isAlias_WHEN_notEmailInstanceWithObject_THEN_throwsSaltoolsError', () => {
    const verifier = new AliasVerifier();
    const fakeEmail = { domain: 'gmail.com', local: 'test' };

    expect(() => {
      verifier.isAlias(fakeEmail);
    }).toThrow(SaltoolsError);
  });

  test('test_isAlias_WHEN_gmailWithMultipleDots_THEN_returnsTrue', () => {
    const verifier = new AliasVerifier();
    const email = new Email('t.e.s.t@gmail.com');

    const result = verifier.isAlias(email);

    expect(result).toBe(true);
  });

  test('test_isAlias_WHEN_gmailWithMultiplePluses_THEN_returnsTrue', () => {
    const verifier = new AliasVerifier();
    const email = new Email('test+alias+another@gmail.com');

    const result = verifier.isAlias(email);

    expect(result).toBe(true);
  });

  test('test_isAlias_WHEN_gmailWithPlusAtStart_THEN_returnsTrue', () => {
    const verifier = new AliasVerifier();
    const email = new Email('+test@gmail.com');

    const result = verifier.isAlias(email);

    expect(result).toBe(true);
  });

  test('test_isAlias_WHEN_gmailWithDotAtStart_THEN_returnsTrue', () => {
    const verifier = new AliasVerifier();
    const email = new Email('.test@gmail.com');

    const result = verifier.isAlias(email);

    expect(result).toBe(true);
  });
});

