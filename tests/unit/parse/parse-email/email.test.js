import { describe, test, expect } from '@jest/globals';
import Email from 'src/commands/parse/parse-email/email.js';
import SaltoolsError from 'src/errors/saltools-error.js';

describe('Email', () => {
  test('test_constructor_WHEN_validEmail_THEN_setsValueDomainAndLocal', () => {
    const email = new Email('test@example.com');

    expect(email.value).toBe('test@example.com');
    expect(email.domain).toBe('example.com');
    expect(email.local).toBe('test');
  });

  test('test_constructor_WHEN_emailWithUppercase_THEN_convertsToLowercase', () => {
    const email = new Email('TEST@EXAMPLE.COM');

    expect(email.value).toBe('test@example.com');
    expect(email.domain).toBe('example.com');
    expect(email.local).toBe('test');
  });

  test('test_constructor_WHEN_emailWithWhitespace_THEN_trimsWhitespace', () => {
    const email = new Email('  test@example.com  ');

    expect(email.value).toBe('test@example.com');
    expect(email.domain).toBe('example.com');
    expect(email.local).toBe('test');
  });

  test('test_constructor_WHEN_emailWithUppercaseAndWhitespace_THEN_convertsAndTrims', () => {
    const email = new Email('  TEST@EXAMPLE.COM  ');

    expect(email.value).toBe('test@example.com');
    expect(email.domain).toBe('example.com');
    expect(email.local).toBe('test');
  });

  test('test_constructor_WHEN_emailWithoutAtSymbol_THEN_throwsSaltoolsError', () => {
    expect(() => {
      new Email('invalidemail.com');
    }).toThrow(SaltoolsError);
  });

  test('test_constructor_WHEN_emailWithoutDomain_THEN_throwsSaltoolsError', () => {
    expect(() => {
      new Email('test@');
    }).toThrow(SaltoolsError);
  });

  test('test_constructor_WHEN_emailWithoutLocal_THEN_throwsSaltoolsError', () => {
    expect(() => {
      new Email('@example.com');
    }).toThrow(SaltoolsError);
  });

  test('test_constructor_WHEN_emptyString_THEN_throwsSaltoolsError', () => {
    expect(() => {
      new Email('');
    }).toThrow(SaltoolsError);
  });

  test('test_constructor_WHEN_emailWithPlusAlias_THEN_preservesAlias', () => {
    const email = new Email('test+alias@example.com');

    expect(email.value).toBe('test+alias@example.com');
    expect(email.domain).toBe('example.com');
    expect(email.local).toBe('test+alias');
  });

  test('test_constructor_WHEN_emailWithDotInLocal_THEN_preservesDot', () => {
    const email = new Email('test.name@example.com');

    expect(email.value).toBe('test.name@example.com');
    expect(email.domain).toBe('example.com');
    expect(email.local).toBe('test.name');
  });

  test('test_constructor_WHEN_emailWithSubdomain_THEN_preservesSubdomain', () => {
    const email = new Email('test@mail.example.com');

    expect(email.value).toBe('test@mail.example.com');
    expect(email.domain).toBe('mail.example.com');
    expect(email.local).toBe('test');
  });
});

