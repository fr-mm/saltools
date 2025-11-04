import { describe, test, expect } from '@jest/globals';
import { number, integer } from 'src/commands/parse/index.js';
import SaltoolsError from 'src/errors/saltools-error.js';

describe('parse-number', () => {
  describe('number function', () => {
    test('test_number_WHEN_validNumberString_THEN_returnsNumber', () => {
      const result = number('123');
      expect(result).toBe(123);
    });

    test('test_number_WHEN_validNumber_THEN_returnsNumber', () => {
      const result = number(123);
      expect(result).toBe(123);
    });

    test('test_number_WHEN_decimalString_THEN_returnsDecimalNumber', () => {
      const result = number('123.456');
      expect(result).toBe(123.456);
    });

    test('test_number_WHEN_decimalNumber_THEN_returnsDecimalNumber', () => {
      const result = number(123.456);
      expect(result).toBe(123.456);
    });

    test('test_number_WHEN_zeroStringWithAllowZeroTrue_THEN_returnsZero', () => {
      const result = number('0', { allowZero: true });
      expect(result).toBe(0);
    });

    test('test_number_WHEN_zeroWithAllowZeroTrue_THEN_returnsZero', () => {
      const result = number(0, { allowZero: true });
      expect(result).toBe(0);
    });

    test('test_number_WHEN_zeroStringWithAllowZeroFalse_THEN_throwsError', () => {
      expect(() => {
        number('0', { allowZero: false });
      }).toThrow(SaltoolsError);
    });

    test('test_number_WHEN_zeroWithAllowZeroFalse_THEN_throwsError', () => {
      expect(() => {
        number(0, { allowZero: false });
      }).toThrow(SaltoolsError);
    });

    test('test_number_WHEN_negativeStringWithAllowNegativeTrue_THEN_returnsNegativeNumber', () => {
      const result = number('-123', { allowNegative: true });
      expect(result).toBe(-123);
    });

    test('test_number_WHEN_negativeNumberWithAllowNegativeTrue_THEN_returnsNegativeNumber', () => {
      const result = number(-123, { allowNegative: true });
      expect(result).toBe(-123);
    });

    test('test_number_WHEN_negativeStringWithAllowNegativeFalse_THEN_throwsError', () => {
      expect(() => {
        number('-123', { allowNegative: false });
      }).toThrow(SaltoolsError);
    });

    test('test_number_WHEN_negativeNumberWithAllowNegativeFalse_THEN_throwsError', () => {
      expect(() => {
        number(-123, { allowNegative: false });
      }).toThrow(SaltoolsError);
    });

    test('test_number_WHEN_negativeZeroWithAllowNegativeFalse_THEN_throwsError', () => {
      expect(() => {
        number(-0, { allowNegative: false });
      }).toThrow(SaltoolsError);
    });

    test('test_number_WHEN_emptyStringWithAllowEmptyTrue_THEN_returnsZero', () => {
      const result = number('', { allowEmptyString: true, allowZero: true });
      expect(result).toBe(0);
    });

    test('test_number_WHEN_emptyStringWithAllowEmptyFalse_THEN_throwsError', () => {
      expect(() => {
        number('', { allowEmptyString: false });
      }).toThrow(SaltoolsError);
    });

    test('test_number_WHEN_nullWithAllowNullTrue_THEN_returnsZero', () => {
      const result = number(null, { allowNull: true, allowZero: true });
      expect(result).toBe(0);
    });

    test('test_number_WHEN_nullWithAllowNullFalse_THEN_throwsError', () => {
      expect(() => {
        number(null, { allowNull: false });
      }).toThrow(SaltoolsError);
    });

    test('test_number_WHEN_undefined_THEN_throwsError', () => {
      expect(() => {
        number(undefined);
      }).toThrow(SaltoolsError);
    });

    test('test_number_WHEN_boolean_THEN_throwsError', () => {
      expect(() => {
        number(true);
      }).toThrow(SaltoolsError);
      expect(() => {
        number(false);
      }).toThrow(SaltoolsError);
    });

    test('test_number_WHEN_invalidString_THEN_throwsError', () => {
      expect(() => {
        number('abc');
      }).toThrow(SaltoolsError);
    });

    test('test_number_WHEN_array_THEN_throwsError', () => {
      expect(() => {
        number([1, 2, 3]);
      }).toThrow(SaltoolsError);
    });

    test('test_number_WHEN_object_THEN_throwsError', () => {
      expect(() => {
        number({});
      }).toThrow(SaltoolsError);
    });

    test('test_number_WHEN_emptyStringWithVarName_THEN_errorIncludesVarName', () => {
      expect(() => {
        number('', { allowEmptyString: false, varName: 'age' });
      }).toThrow(SaltoolsError);
    });

    test('test_number_WHEN_nullWithVarName_THEN_errorIncludesVarName', () => {
      expect(() => {
        number(null, { allowNull: false, varName: 'count' });
      }).toThrow(SaltoolsError);
    });

    test('test_number_WHEN_invalidStringWithVarName_THEN_errorIncludesVarName', () => {
      expect(() => {
        number('abc', { varName: 'price' });
      }).toThrow(SaltoolsError);
    });

    test('test_number_WHEN_varNameIsNull_THEN_errorDoesNotIncludeVarName', () => {
      expect(() => {
        number('', { allowEmptyString: false, varName: null });
      }).toThrow(SaltoolsError);
    });

    test('test_number_WHEN_validNumberWithVarName_THEN_returnsNumber', () => {
      const result = number(123, { varName: 'testVar' });
      expect(result).toBe(123);
    });

    test('test_number_WHEN_zeroWithVarNameAndAllowZeroFalse_THEN_errorIncludesVarName', () => {
      expect(() => {
        number(0, { allowZero: false, varName: 'count' });
      }).toThrow(SaltoolsError);
    });

    test('test_number_WHEN_negativeWithVarNameAndAllowNegativeFalse_THEN_errorIncludesVarName', () => {
      expect(() => {
        number(-123, { allowNegative: false, varName: 'price' });
      }).toThrow(SaltoolsError);
    });
  });

  describe('integer function', () => {
    test('test_integer_WHEN_validIntegerString_THEN_returnsInteger', () => {
      const result = integer('123');
      expect(result).toBe(123);
    });

    test('test_integer_WHEN_validInteger_THEN_returnsInteger', () => {
      const result = integer(123);
      expect(result).toBe(123);
    });

    test('test_integer_WHEN_zeroStringWithAllowZeroTrue_THEN_returnsZero', () => {
      const result = integer('0', { allowZero: true });
      expect(result).toBe(0);
    });

    test('test_integer_WHEN_zeroWithAllowZeroTrue_THEN_returnsZero', () => {
      const result = integer(0, { allowZero: true });
      expect(result).toBe(0);
    });

    test('test_integer_WHEN_zeroStringWithAllowZeroFalse_THEN_throwsError', () => {
      expect(() => {
        integer('0', { allowZero: false });
      }).toThrow(SaltoolsError);
    });

    test('test_integer_WHEN_zeroWithAllowZeroFalse_THEN_throwsError', () => {
      expect(() => {
        integer(0, { allowZero: false });
      }).toThrow(SaltoolsError);
    });

    test('test_integer_WHEN_negativeIntegerStringWithAllowNegativeTrue_THEN_returnsNegativeInteger', () => {
      const result = integer('-123', { allowNegative: true });
      expect(result).toBe(-123);
    });

    test('test_integer_WHEN_negativeIntegerWithAllowNegativeTrue_THEN_returnsNegativeInteger', () => {
      const result = integer(-123, { allowNegative: true });
      expect(result).toBe(-123);
    });

    test('test_integer_WHEN_negativeIntegerStringWithAllowNegativeFalse_THEN_throwsError', () => {
      expect(() => {
        integer('-123', { allowNegative: false });
      }).toThrow(SaltoolsError);
    });

    test('test_integer_WHEN_negativeIntegerWithAllowNegativeFalse_THEN_throwsError', () => {
      expect(() => {
        integer(-123, { allowNegative: false });
      }).toThrow(SaltoolsError);
    });

    test('test_integer_WHEN_decimalString_THEN_throwsError', () => {
      expect(() => {
        integer('123.456');
      }).toThrow(SaltoolsError);
    });

    test('test_integer_WHEN_decimalNumber_THEN_throwsError', () => {
      expect(() => {
        integer(123.456);
      }).toThrow(SaltoolsError);
    });

    test('test_integer_WHEN_emptyStringWithAllowEmptyTrue_THEN_returnsZero', () => {
      const result = integer('', { allowEmptyString: true, allowZero: true });
      expect(result).toBe(0);
    });

    test('test_integer_WHEN_emptyStringWithAllowEmptyFalse_THEN_throwsError', () => {
      expect(() => {
        integer('', { allowEmptyString: false });
      }).toThrow(SaltoolsError);
    });

    test('test_integer_WHEN_nullWithAllowNullTrue_THEN_returnsZero', () => {
      const result = integer(null, { allowNull: true, allowZero: true });
      expect(result).toBe(0);
    });

    test('test_integer_WHEN_nullWithAllowNullFalse_THEN_throwsError', () => {
      expect(() => {
        integer(null, { allowNull: false });
      }).toThrow(SaltoolsError);
    });

    test('test_integer_WHEN_decimalWithVarName_THEN_errorIncludesVarName', () => {
      expect(() => {
        integer(123.456, { varName: 'count' });
      }).toThrow(SaltoolsError);
    });

    test('test_integer_WHEN_validIntegerWithVarName_THEN_returnsInteger', () => {
      const result = integer(123, { varName: 'testVar' });
      expect(result).toBe(123);
    });

    test('test_integer_WHEN_zeroWithVarNameAndAllowZeroFalse_THEN_errorIncludesVarName', () => {
      expect(() => {
        integer(0, { allowZero: false, varName: 'count' });
      }).toThrow(SaltoolsError);
    });

    test('test_integer_WHEN_negativeWithVarNameAndAllowNegativeFalse_THEN_errorIncludesVarName', () => {
      expect(() => {
        integer(-123, { allowNegative: false, varName: 'price' });
      }).toThrow(SaltoolsError);
    });
  });

  describe('option type validation', () => {
    test('test_number_WHEN_allowEmptyStringIsNotBoolean_THEN_throwsError', () => {
      expect(() => {
        number(123, { allowEmptyString: 'true' });
      }).toThrow(SaltoolsError);
    });

    test('test_number_WHEN_allowNullIsNotBoolean_THEN_throwsError', () => {
      expect(() => {
        number(123, { allowNull: 1 });
      }).toThrow(SaltoolsError);
    });

    test('test_number_WHEN_allowNegativeIsNotBoolean_THEN_throwsError', () => {
      expect(() => {
        number(123, { allowNegative: 'yes' });
      }).toThrow(SaltoolsError);
    });

    test('test_number_WHEN_allowZeroIsNotBoolean_THEN_throwsError', () => {
      expect(() => {
        number(123, { allowZero: {} });
      }).toThrow(SaltoolsError);
    });

    test('test_number_WHEN_varNameIsNotString_THEN_throwsError', () => {
      expect(() => {
        number(123, { varName: 456 });
      }).toThrow(SaltoolsError);
    });

    test('test_integer_WHEN_allowEmptyStringIsNotBoolean_THEN_throwsError', () => {
      expect(() => {
        integer(123, { allowEmptyString: 'true' });
      }).toThrow(SaltoolsError);
    });

    test('test_integer_WHEN_allowNullIsNotBoolean_THEN_throwsError', () => {
      expect(() => {
        integer(123, { allowNull: 'yes' });
      }).toThrow(SaltoolsError);
    });

    test('test_integer_WHEN_varNameIsNotString_THEN_throwsError', () => {
      expect(() => {
        integer(123, { varName: false });
      }).toThrow(SaltoolsError);
    });

    test('test_integer_WHEN_allowNegativeIsNotBoolean_THEN_throwsError', () => {
      expect(() => {
        integer(123, { allowNegative: 'yes' });
      }).toThrow(SaltoolsError);
    });

    test('test_integer_WHEN_allowZeroIsNotBoolean_THEN_throwsError', () => {
      expect(() => {
        integer(123, { allowZero: {} });
      }).toThrow(SaltoolsError);
    });
  });

  describe('throwError option', () => {
    test('test_number_WHEN_invalidInputAndThrowErrorFalse_THEN_returnsNull', () => {
      const result = number('abc', { throwError: false });
      expect(result).toBeNull();
    });

    test('test_number_WHEN_nullNotAllowedAndThrowErrorFalse_THEN_returnsNull', () => {
      const result = number(null, { allowNull: false, throwError: false });
      expect(result).toBeNull();
    });

    test('test_integer_WHEN_decimalAndThrowErrorFalse_THEN_returnsNull', () => {
      const result = integer('1.2', { throwError: false });
      expect(result).toBeNull();
    });

    test('test_integer_WHEN_nullNotAllowedAndThrowErrorFalse_THEN_returnsNull', () => {
      const result = integer(null, { allowNull: false, throwError: false });
      expect(result).toBeNull();
    });

    test('test_number_WHEN_zeroNotAllowedAndThrowErrorFalse_THEN_returnsNull', () => {
      const result = number(0, { allowZero: false, throwError: false });
      expect(result).toBeNull();
    });

    test('test_number_WHEN_negativeNotAllowedAndThrowErrorFalse_THEN_returnsNull', () => {
      const result = number(-123, { allowNegative: false, throwError: false });
      expect(result).toBeNull();
    });

    test('test_integer_WHEN_zeroNotAllowedAndThrowErrorFalse_THEN_returnsNull', () => {
      const result = integer(0, { allowZero: false, throwError: false });
      expect(result).toBeNull();
    });

    test('test_integer_WHEN_negativeNotAllowedAndThrowErrorFalse_THEN_returnsNull', () => {
      const result = integer(-123, { allowNegative: false, throwError: false });
      expect(result).toBeNull();
    });
  });
});

