import { describe, test, expect } from '@jest/globals';
import SaltoolsError from 'src/errors/saltools-error.js';

describe('saltools-error', () => {
  test('test_SaltoolsError_WHEN_created_THEN_hasCorrectName', () => {
    const error = new SaltoolsError('Test error');
    expect(error.name).toBe('SaltoolsError');
  });

  test('test_SaltoolsError_WHEN_created_THEN_hasPrefixedMessage', () => {
    const error = new SaltoolsError('Test error');
    expect(error.message).toBe('[Saltools] Test error');
  });

  test('test_SaltoolsError_WHEN_createdWithOptions_THEN_storesOptions', () => {
    const options = { code: 'TEST_ERROR' };
    const error = new SaltoolsError('Test error', options);
    expect(error.options).toEqual(options);
  });

  test('test_SaltoolsError_WHEN_thrown_THEN_isInstanceOfError', () => {
    const error = new SaltoolsError('Test error');
    expect(error instanceof Error).toBe(true);
  });
});

