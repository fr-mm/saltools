import { describe, test, expect } from '@jest/globals';
import CustomError from 'src/errors/custom-error.js';

describe('custom-error', () => {
  test('test_CustomError_WHEN_created_THEN_hasCorrectName', () => {
    const error = new CustomError('Test error');
    expect(error.name).toBe('SaltoolsError');
  });

  test('test_CustomError_WHEN_created_THEN_hasPrefixedMessage', () => {
    const error = new CustomError('Test error');
    expect(error.message).toBe('[Saltools] Test error');
  });

  test('test_CustomError_WHEN_createdWithOptions_THEN_storesOptions', () => {
    const options = { code: 'TEST_ERROR' };
    const error = new CustomError('Test error', options);
    expect(error.options).toEqual(options);
  });

  test('test_CustomError_WHEN_thrown_THEN_isInstanceOfError', () => {
    const error = new CustomError('Test error');
    expect(error instanceof Error).toBe(true);
  });
});

