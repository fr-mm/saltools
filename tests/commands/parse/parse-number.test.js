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

    test('test_number_WHEN_zeroString_THEN_returnsZero', () => {
      const result = number('0');
      expect(result).toBe(0);
    });

    test('test_number_WHEN_zero_THEN_returnsZero', () => {
      const result = number(0);
      expect(result).toBe(0);
    });

    test('test_number_WHEN_negativeString_THEN_returnsNegativeNumber', () => {
      const result = number('-123');
      expect(result).toBe(-123);
    });

    test('test_number_WHEN_negativeNumber_THEN_returnsNegativeNumber', () => {
      const result = number(-123);
      expect(result).toBe(-123);
    });

    test('test_number_WHEN_emptyStringWithAllowEmptyTrue_THEN_returnsZero', () => {
      const result = number('', { allowEmpty: true });
      expect(result).toBe(0);
    });

    test('test_number_WHEN_emptyStringWithAllowEmptyFalse_THEN_throwsError', () => {
      expect(() => {
        number('', { allowEmpty: false });
      }).toThrow(SaltoolsError);
      expect(() => {
        number('', { allowEmpty: false });
      }).toThrow('String não pode ser vazia quando {allowEmptyString: false}');
    });

    test('test_number_WHEN_nullWithAllowNullTrue_THEN_throwsError', () => {
      expect(() => {
        number(null, { allowNull: true });
      }).toThrow(SaltoolsError);
    });

    test('test_number_WHEN_nullWithAllowNullFalse_THEN_throwsError', () => {
      expect(() => {
        number(null, { allowNull: false });
      }).toThrow(SaltoolsError);
      expect(() => {
        number(null, { allowNull: false });
      }).toThrow('Não é possível converter');
    });

    test('test_number_WHEN_undefined_THEN_throwsError', () => {
      expect(() => {
        number(undefined);
      }).toThrow(SaltoolsError);
      expect(() => {
        number(undefined);
      }).toThrow('Não é possível converter');
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
      expect(() => {
        number('abc');
      }).toThrow('Não é possível converter');
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
        number('', { allowEmpty: false, varName: 'age' });
      }).toThrow(SaltoolsError);
      expect(() => {
        number('', { allowEmpty: false, varName: 'age' });
      }).toThrow('varName: age');
    });

    test('test_number_WHEN_nullWithVarName_THEN_errorIncludesVarName', () => {
      expect(() => {
        number(null, { allowNull: false, varName: 'count' });
      }).toThrow(SaltoolsError);
      expect(() => {
        number(null, { allowNull: false, varName: 'count' });
      }).toThrow('varName: count');
    });

    test('test_number_WHEN_invalidStringWithVarName_THEN_errorIncludesVarName', () => {
      expect(() => {
        number('abc', { varName: 'price' });
      }).toThrow(SaltoolsError);
      expect(() => {
        number('abc', { varName: 'price' });
      }).toThrow('varName: price');
    });

    test('test_number_WHEN_varNameIsNull_THEN_errorDoesNotIncludeVarName', () => {
      expect(() => {
        number('', { allowEmpty: false, varName: null });
      }).toThrow(SaltoolsError);
      const errorMessage = (() => {
        try {
          number('', { allowEmpty: false, varName: null });
        } catch (error) {
          return error.message;
        }
      })();
      expect(errorMessage).not.toContain('varName:');
    });

    test('test_number_WHEN_validNumberWithVarName_THEN_returnsNumber', () => {
      const result = number(123, { varName: 'testVar' });
      expect(result).toBe(123);
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

    test('test_integer_WHEN_zeroString_THEN_returnsZero', () => {
      const result = integer('0');
      expect(result).toBe(0);
    });

    test('test_integer_WHEN_zero_THEN_returnsZero', () => {
      const result = integer(0);
      expect(result).toBe(0);
    });

    test('test_integer_WHEN_negativeIntegerString_THEN_returnsNegativeInteger', () => {
      const result = integer('-123');
      expect(result).toBe(-123);
    });

    test('test_integer_WHEN_negativeInteger_THEN_returnsNegativeInteger', () => {
      const result = integer(-123);
      expect(result).toBe(-123);
    });

    test('test_integer_WHEN_decimalString_THEN_throwsError', () => {
      expect(() => {
        integer('123.456');
      }).toThrow(SaltoolsError);
      expect(() => {
        integer('123.456');
      }).toThrow('não é um inteiro');
    });

    test('test_integer_WHEN_decimalNumber_THEN_throwsError', () => {
      expect(() => {
        integer(123.456);
      }).toThrow(SaltoolsError);
      expect(() => {
        integer(123.456);
      }).toThrow('não é um inteiro');
    });

    test('test_integer_WHEN_emptyStringWithAllowEmptyTrue_THEN_returnsZero', () => {
      const result = integer('', { allowEmpty: true });
      expect(result).toBe(0);
    });

    test('test_integer_WHEN_emptyStringWithAllowEmptyFalse_THEN_throwsError', () => {
      expect(() => {
        integer('', { allowEmpty: false });
      }).toThrow(SaltoolsError);
      expect(() => {
        integer('', { allowEmpty: false });
      }).toThrow('String não pode ser vazia quando {allowEmptyString: false}');
    });

    test('test_integer_WHEN_nullWithAllowNullTrue_THEN_throwsError', () => {
      expect(() => {
        integer(null, { allowNull: true });
      }).toThrow(SaltoolsError);
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
      expect(() => {
        integer(123.456, { varName: 'count' });
      }).toThrow('varName: count');
    });

    test('test_integer_WHEN_validIntegerWithVarName_THEN_returnsInteger', () => {
      const result = integer(123, { varName: 'testVar' });
      expect(result).toBe(123);
    });
  });
});

