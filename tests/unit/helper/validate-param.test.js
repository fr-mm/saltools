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

    test('test_bool_WHEN_requiredTrueAndNull_THEN_throwsError', () => {
      expect(() => {
        param.bool({ value: null, name: 'test', required: true });
      }).toThrow(SaltoolsError);
    });

    test('test_bool_WHEN_requiredTrueAndUndefined_THEN_throwsError', () => {
      expect(() => {
        param.bool({ value: undefined, name: 'test', required: true });
      }).toThrow(SaltoolsError);
    });

    test('test_bool_WHEN_requiredTrueAndValidValue_THEN_returnsValue', () => {
      const result = param.bool({ value: true, name: 'test', required: true });
      expect(result).toBe(true);
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

    test('test_string_WHEN_requiredTrueAndNull_THEN_throwsError', () => {
      expect(() => {
        param.string({ value: null, name: 'varName', required: true });
      }).toThrow(SaltoolsError);
    });

    test('test_string_WHEN_requiredTrueAndUndefined_THEN_throwsError', () => {
      expect(() => {
        param.string({ value: undefined, name: 'varName', required: true });
      }).toThrow(SaltoolsError);
    });

    test('test_string_WHEN_requiredTrueAndValidValue_THEN_returnsValue', () => {
      const result = param.string({ value: 'test', name: 'varName', required: true });
      expect(result).toBe('test');
    });

    test('test_string_WHEN_optionsIsNull_THEN_returnsValue', () => {
      const result = param.string({ value: 'test', name: 'varName', options: null });
      expect(result).toBe('test');
    });

    test('test_string_WHEN_optionsIsArrayAndValueInOptions_THEN_returnsValue', () => {
      const result = param.string({ value: 'option1', name: 'varName', options: ['option1', 'option2', 'option3'] });
      expect(result).toBe('option1');
    });

    test('test_string_WHEN_optionsIsArrayAndValueInOptionsWithDifferentIndex_THEN_returnsValue', () => {
      const result = param.string({ value: 'option3', name: 'varName', options: ['option1', 'option2', 'option3'] });
      expect(result).toBe('option3');
    });

    test('test_string_WHEN_optionsIsNotArray_THEN_throwsError', () => {
      expect(() => {
        param.string({ value: 'test', name: 'varName', options: 'not-an-array' });
      }).toThrow(SaltoolsError);
    });

    test('test_string_WHEN_optionsIsNotArrayWithNumber_THEN_throwsError', () => {
      expect(() => {
        param.string({ value: 'test', name: 'varName', options: 123 });
      }).toThrow(SaltoolsError);
    });

    test('test_string_WHEN_optionsIsNotArrayWithObject_THEN_throwsError', () => {
      expect(() => {
        param.string({ value: 'test', name: 'varName', options: {} });
      }).toThrow(SaltoolsError);
    });

    test('test_string_WHEN_optionsIsArrayAndValueNotInOptions_THEN_throwsError', () => {
      expect(() => {
        param.string({ value: 'invalid', name: 'varName', options: ['option1', 'option2', 'option3'] });
      }).toThrow(SaltoolsError);
    });

    test('test_string_WHEN_optionsIsArrayAndNullValue_THEN_returnsNull', () => {
      const result = param.string({ value: null, name: 'varName', options: ['option1', 'option2'] });
      expect(result).toBeNull();
    });

    test('test_string_WHEN_optionsIsArrayAndUndefinedValue_THEN_returnsUndefined', () => {
      const result = param.string({ value: undefined, name: 'varName', options: ['option1', 'option2'] });
      expect(result).toBeUndefined();
    });

    test('test_string_WHEN_optionsIsArrayAndRequiredTrueAndValueInOptions_THEN_returnsValue', () => {
      const result = param.string({ value: 'option1', name: 'varName', required: true, options: ['option1', 'option2'] });
      expect(result).toBe('option1');
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

    test('test_number_WHEN_requiredTrueAndNull_THEN_throwsError', () => {
      expect(() => {
        param.number({ value: null, name: 'count', required: true });
      }).toThrow(SaltoolsError);
    });

    test('test_number_WHEN_requiredTrueAndUndefined_THEN_throwsError', () => {
      expect(() => {
        param.number({ value: undefined, name: 'count', required: true });
      }).toThrow(SaltoolsError);
    });

    test('test_number_WHEN_requiredTrueAndValidValue_THEN_returnsValue', () => {
      const result = param.number({ value: 123, name: 'count', required: true });
      expect(result).toBe(123);
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

    test('test_integer_WHEN_requiredTrueAndNull_THEN_throwsError', () => {
      expect(() => {
        param.integer({ value: null, name: 'count', required: true });
      }).toThrow(SaltoolsError);
    });

    test('test_integer_WHEN_requiredTrueAndUndefined_THEN_throwsError', () => {
      expect(() => {
        param.integer({ value: undefined, name: 'count', required: true });
      }).toThrow(SaltoolsError);
    });

    test('test_integer_WHEN_requiredTrueAndValidValue_THEN_returnsValue', () => {
      const result = param.integer({ value: 123, name: 'count', required: true });
      expect(result).toBe(123);
    });
  });

  describe('object', () => {
    test('test_object_WHEN_validObject_THEN_returnsObject', () => {
      const value = { key: 'value' };
      const result = param.object({ value, name: 'config' });
      expect(result).toBe(value);
    });

    test('test_object_WHEN_null_THEN_returnsNull', () => {
      const result = param.object({ value: null, name: 'config' });
      expect(result).toBeNull();
    });

    test('test_object_WHEN_undefined_THEN_returnsUndefined', () => {
      const result = param.object({ value: undefined, name: 'config' });
      expect(result).toBeUndefined();
    });

    test('test_object_WHEN_array_THEN_returnsArray', () => {
      const value = [1, 2, 3];
      const result = param.object({ value, name: 'items' });
      expect(result).toBe(value);
    });

    test('test_object_WHEN_stringForObject_THEN_throwsError', () => {
      expect(() => {
        param.object({ value: 'string', name: 'config' });
      }).toThrow(SaltoolsError);
    });

    test('test_object_WHEN_numberForObject_THEN_throwsError', () => {
      expect(() => {
        param.object({ value: 123, name: 'config' });
      }).toThrow(SaltoolsError);
    });

    test('test_object_WHEN_booleanForObject_THEN_throwsError', () => {
      expect(() => {
        param.object({ value: true, name: 'config' });
      }).toThrow(SaltoolsError);
    });

    test('test_object_WHEN_requiredTrueAndNull_THEN_throwsError', () => {
      expect(() => {
        param.object({ value: null, name: 'config', required: true });
      }).toThrow(SaltoolsError);
    });

    test('test_object_WHEN_requiredTrueAndUndefined_THEN_throwsError', () => {
      expect(() => {
        param.object({ value: undefined, name: 'config', required: true });
      }).toThrow(SaltoolsError);
    });

    test('test_object_WHEN_requiredTrueAndValidValue_THEN_returnsValue', () => {
      const value = { key: 'value' };
      const result = param.object({ value, name: 'config', required: true });
      expect(result).toBe(value);
    });
  });

  describe('error', () => {
    test('test_error_WHEN_validError_THEN_returnsError', () => {
      const error = new Error('Test error');
      const result = param.error({ value: error, name: 'error' });
      expect(result).toBe(error);
    });

    test('test_error_WHEN_SaltoolsError_THEN_returnsError', () => {
      const error = new SaltoolsError('Test error');
      const result = param.error({ value: error, name: 'error' });
      expect(result).toBe(error);
    });

    test('test_error_WHEN_null_THEN_returnsNull', () => {
      const result = param.error({ value: null, name: 'error' });
      expect(result).toBeNull();
    });

    test('test_error_WHEN_undefined_THEN_returnsUndefined', () => {
      const result = param.error({ value: undefined, name: 'error' });
      expect(result).toBeUndefined();
    });

    test('test_error_WHEN_stringForError_THEN_throwsError', () => {
      expect(() => {
        param.error({ value: 'string', name: 'error' });
      }).toThrow(SaltoolsError);
    });

    test('test_error_WHEN_numberForError_THEN_throwsError', () => {
      expect(() => {
        param.error({ value: 123, name: 'error' });
      }).toThrow(SaltoolsError);
    });

    test('test_error_WHEN_booleanForError_THEN_throwsError', () => {
      expect(() => {
        param.error({ value: true, name: 'error' });
      }).toThrow(SaltoolsError);
    });

    test('test_error_WHEN_objectForError_THEN_throwsError', () => {
      expect(() => {
        param.error({ value: {}, name: 'error' });
      }).toThrow(SaltoolsError);
    });

    test('test_error_WHEN_arrayForError_THEN_throwsError', () => {
      expect(() => {
        param.error({ value: [], name: 'error' });
      }).toThrow(SaltoolsError);
    });

    test('test_error_WHEN_requiredTrueAndNull_THEN_throwsError', () => {
      expect(() => {
        param.error({ value: null, name: 'error', required: true });
      }).toThrow(SaltoolsError);
    });

    test('test_error_WHEN_requiredTrueAndUndefined_THEN_throwsError', () => {
      expect(() => {
        param.error({ value: undefined, name: 'error', required: true });
      }).toThrow(SaltoolsError);
    });

    test('test_error_WHEN_requiredTrueAndValidValue_THEN_returnsValue', () => {
      const error = new Error('Test error');
      const result = param.error({ value: error, name: 'error', required: true });
      expect(result).toBe(error);
    });
  });
});
