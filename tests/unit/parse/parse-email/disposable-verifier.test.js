import { describe, test, expect } from '@jest/globals';
import DisposableVerifier from 'src/commands/parse/parse-email/disposable-verifier.js';
import Email from 'src/commands/parse/parse-email/email.js';
import SaltoolsError from 'src/errors/saltools-error.js';

describe('DisposableVerifier', () => {
  test('test_isDisposable_WHEN_mailinatorDomain_THEN_returnsTrue', () => {
    const verifier = new DisposableVerifier();
    const email = new Email('test@mailinator.com');

    const result = verifier.isDisposable(email);

    expect(result).toBe(true);
  });

  test('test_isDisposable_WHEN_tempmailDomain_THEN_returnsTrue', () => {
    const verifier = new DisposableVerifier();
    const email = new Email('test@tempmail.com');

    const result = verifier.isDisposable(email);

    expect(result).toBe(true);
  });

  test('test_isDisposable_WHEN_dispostableDomain_THEN_returnsTrue', () => {
    const verifier = new DisposableVerifier();
    const email = new Email('test@dispostable.com');

    const result = verifier.isDisposable(email);

    expect(result).toBe(true);
  });

  test('test_isDisposable_WHEN_gmailDomain_THEN_returnsFalse', () => {
    const verifier = new DisposableVerifier();
    const email = new Email('test@gmail.com');

    const result = verifier.isDisposable(email);

    expect(result).toBe(false);
  });

  test('test_isDisposable_WHEN_regularDomain_THEN_returnsFalse', () => {
    const verifier = new DisposableVerifier();
    const email = new Email('test@example.com');

    const result = verifier.isDisposable(email);

    expect(result).toBe(false);
  });

  test('test_isDisposable_WHEN_notEmailInstance_THEN_throwsSaltoolsError', () => {
    const verifier = new DisposableVerifier();

    expect(() => {
      verifier.isDisposable('test@mailinator.com');
    }).toThrow(SaltoolsError);
  });

  test('test_isDisposable_WHEN_notEmailInstanceWithObject_THEN_throwsSaltoolsError', () => {
    const verifier = new DisposableVerifier();
    const fakeEmail = { domain: 'mailinator.com', value: 'test@mailinator.com' };

    expect(() => {
      verifier.isDisposable(fakeEmail);
    }).toThrow(SaltoolsError);
  });

  test('test_isDisposable_WHEN_null_THEN_throwsSaltoolsError', () => {
    const verifier = new DisposableVerifier();

    expect(() => {
      verifier.isDisposable(null);
    }).toThrow(SaltoolsError);
  });

  test('test_isDisposable_WHEN_undefined_THEN_throwsSaltoolsError', () => {
    const verifier = new DisposableVerifier();

    expect(() => {
      verifier.isDisposable(undefined);
    }).toThrow(SaltoolsError);
  });

  test('test_isDisposable_WHEN_disposableDomainWithDifferentLocalPart_THEN_returnsTrue', () => {
    const verifier = new DisposableVerifier();
    const email = new Email('any.local+part@mailinator.com');

    const result = verifier.isDisposable(email);

    expect(result).toBe(true);
  });

  test('test_isDisposable_WHEN_uppercaseDisposableDomain_THEN_returnsTrue', () => {
    const verifier = new DisposableVerifier();
    const email = new Email('test@MAILINATOR.COM');

    const result = verifier.isDisposable(email);

    expect(result).toBe(true);
  });
});

