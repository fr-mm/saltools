import { describe, test, expect } from '@jest/globals';
import { param } from 'src/helper/validate-param.js';
import SaltoolsError from 'src/errors/saltools-error.js';

describe('param', () => {
  describe('bool', () => {
    test('test_bool_WHEN_validBooleanTrue_THEN_returnsTrue', () => {
      const result = param.bool({ value: true, name: 'test' });
      expect(result).toBe(true);
    });

    test('test_bool_WHEN_validBooleanFalse_THEN_returnsFalse', () => {
      const result = param.bool({ value: false, name: 'test' });
      expect(result).toBe(false);
    });

    test('test_bool_WHEN_null_THEN_returnsNull', () => {
      const result = param.bool({ value: null, name: 'test' });
      expect(result).toBeNull();
    });

    test('test_bool_WHEN_undefined_THEN_returnsUndefined', () => {
      const result = param.bool({ value: undefined, name: 'test' });
      expect(result).toBeUndefined();
    });

    test('test_bool_WHEN_invalidType_THEN_throwsError', () => {
      expect(() => {
        param.bool({ value: 'string', name: 'allowEmpty' });
      }).toThrow(SaltoolsError);
    });

    test('test_bool_WHEN_number_THEN_throwsError', () => {
      expect(() => {
        param.bool({ value: 123, name: 'cast' });
      }).toThrow(SaltoolsError);
    });

    test('test_bool_WHEN_object_THEN_throwsError', () => {
      expect(() => {
        param.bool({ value: {}, name: 'trim' });
      }).toThrow(SaltoolsError);
    });
  });

  describe('string', () => {
    test('test_string_WHEN_validString_THEN_returnsString', () => {
      const result = param.string({ value: 'test', name: 'varName' });
      expect(result).toBe('test');
    });

    test('test_string_WHEN_emptyString_THEN_returnsEmptyString', () => {
      const result = param.string({ value: '', name: 'varName' });
      expect(result).toBe('');
    });

    test('test_string_WHEN_null_THEN_returnsNull', () => {
      const result = param.string({ value: null, name: 'varName' });
      expect(result).toBeNull();
    });

    test('test_string_WHEN_undefined_THEN_returnsUndefined', () => {
      const result = param.string({ value: undefined, name: 'varName' });
      expect(result).toBeUndefined();
    });

    test('test_string_WHEN_booleanForString_THEN_throwsError', () => {
      expect(() => {
        param.string({ value: true, name: 'varName' });
      }).toThrow(SaltoolsError);
    });

    test('test_string_WHEN_numberForString_THEN_throwsError', () => {
      expect(() => {
        param.string({ value: 123, name: 'varName' });
      }).toThrow(SaltoolsError);
    });
  });

  describe('number', () => {
    test('test_number_WHEN_validNumber_THEN_returnsNumber', () => {
      const result = param.number({ value: 123, name: 'count' });
      expect(result).toBe(123);
    });

    test('test_number_WHEN_zero_THEN_returnsZero', () => {
      const result = param.number({ value: 0, name: 'count' });
      expect(result).toBe(0);
    });

    test('test_number_WHEN_negativeNumber_THEN_returnsNumber', () => {
      const result = param.number({ value: -123, name: 'count' });
      expect(result).toBe(-123);
    });

    test('test_number_WHEN_floatNumber_THEN_returnsNumber', () => {
      const result = param.number({ value: 123.45, name: 'count' });
      expect(result).toBe(123.45);
    });

    test('test_number_WHEN_null_THEN_returnsNull', () => {
      const result = param.number({ value: null, name: 'count' });
      expect(result).toBeNull();
    });

    test('test_number_WHEN_undefined_THEN_returnsUndefined', () => {
      const result = param.number({ value: undefined, name: 'count' });
      expect(result).toBeUndefined();
    });

    test('test_number_WHEN_stringForNumber_THEN_throwsError', () => {
      expect(() => {
        param.number({ value: '123', name: 'count' });
      }).toThrow(SaltoolsError);
    });
  });

  describe('integer', () => {
    test('test_integer_WHEN_validInteger_THEN_returnsInteger', () => {
      const result = param.integer({ value: 123, name: 'count' });
      expect(result).toBe(123);
    });

    test('test_integer_WHEN_zero_THEN_returnsZero', () => {
      const result = param.integer({ value: 0, name: 'count' });
      expect(result).toBe(0);
    });

    test('test_integer_WHEN_negativeInteger_THEN_returnsInteger', () => {
      const result = param.integer({ value: -123, name: 'count' });
      expect(result).toBe(-123);
    });

    test('test_integer_WHEN_null_THEN_returnsNull', () => {
      const result = param.integer({ value: null, name: 'count' });
      expect(result).toBeNull();
    });

    test('test_integer_WHEN_undefined_THEN_returnsUndefined', () => {
      const result = param.integer({ value: undefined, name: 'count' });
      expect(result).toBeUndefined();
    });

    test('test_integer_WHEN_floatNumber_THEN_throwsError', () => {
      expect(() => {
        param.integer({ value: 123.45, name: 'count' });
      }).toThrow(SaltoolsError);
    });

    test('test_integer_WHEN_stringForNumber_THEN_throwsError', () => {
      expect(() => {
        param.integer({ value: '123', name: 'count' });
      }).toThrow(SaltoolsError);
    });
  });
});
