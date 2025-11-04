import { describe, test, expect, beforeEach } from '@jest/globals';
import DocParser from 'src/commands/parse/doc-parser.js';
import SaltoolsError from 'src/errors/saltools-error.js';

describe('DocParser', () => {
  let parser;

  beforeEach(() => {
    parser = new DocParser();
  });

  describe('CPF parsing', () => {
    test('test_parse_WHEN_validCPFStringWithFormatting_THEN_returnsFormattedCPF', () => {
      const result = parser.parse('123.456.789-00', { numbersOnly: false, throwError: true });
      expect(result).toBe('123.456.789-00');
    });

    test('test_parse_WHEN_validCPFStringWithoutFormatting_THEN_returnsFormattedCPF', () => {
      const result = parser.parse('12345678900', { numbersOnly: false, throwError: true });
      expect(result).toBe('123.456.789-00');
    });

    test('test_parse_WHEN_validCPFStringWithSpaces_THEN_returnsFormattedCPF', () => {
      const result = parser.parse('123 456 789 00', { numbersOnly: false, throwError: true });
      expect(result).toBe('123.456.789-00');
    });

    test('test_parse_WHEN_validCPFStringWithMixedSpecialChars_THEN_returnsFormattedCPF', () => {
      const result = parser.parse('123.456-789/00', { numbersOnly: false, throwError: true });
      expect(result).toBe('123.456.789-00');
    });

    test('test_parse_WHEN_validCPFNumber_THEN_returnsFormattedCPF', () => {
      const result = parser.parse(12345678900, { numbersOnly: false, throwError: true });
      expect(result).toBe('123.456.789-00');
    });

    test('test_parse_WHEN_CPFNumberWithTypeCpf_THEN_returnsFormattedCPF', () => {
      const result = parser.parse(12345678900, { type: 'cpf', numbersOnly: false, throwError: true });
      expect(result).toBe('123.456.789-00');
    });

    test('test_parse_WHEN_CPFNumberShorterWithTypeCpf_THEN_padsAndReturnsFormattedCPF', () => {
      const result = parser.parse(123456789, { type: 'cpf', numbersOnly: false, throwError: true });
      expect(result).toBe('001.234.567-89');
    });

    test('test_parse_WHEN_CPFNumberVeryShortWithTypeCpf_THEN_padsAndReturnsFormattedCPF', () => {
      const result = parser.parse(1, { type: 'cpf', numbersOnly: false, throwError: true });
      expect(result).toBe('000.000.000-01');
    });

    test('test_parse_WHEN_validCPFStringWithNumbersOnlyTrue_THEN_returnsNumbersOnly', () => {
      const result = parser.parse('123.456.789-00', { numbersOnly: true, throwError: true });
      expect(result).toBe('12345678900');
    });

    test('test_parse_WHEN_validCPFNumberWithNumbersOnlyTrue_THEN_returnsNumbersOnly', () => {
      const result = parser.parse(12345678900, { numbersOnly: true, throwError: true });
      expect(result).toBe('12345678900');
    });
  });

  describe('CNPJ parsing', () => {
    test('test_parse_WHEN_validCNPJStringWithFormatting_THEN_returnsFormattedCNPJ', () => {
      const result = parser.parse('12.345.678/0001-90', { numbersOnly: false, throwError: true });
      expect(result).toBe('12.345.678/0001-90');
    });

    test('test_parse_WHEN_validCNPJStringWithoutFormatting_THEN_returnsFormattedCNPJ', () => {
      const result = parser.parse('12345678000190', { numbersOnly: false, throwError: true });
      expect(result).toBe('12.345.678/0001-90');
    });

    test('test_parse_WHEN_validCNPJStringWithSpaces_THEN_returnsFormattedCNPJ', () => {
      const result = parser.parse('12 345 678 0001 90', { numbersOnly: false, throwError: true });
      expect(result).toBe('12.345.678/0001-90');
    });

    test('test_parse_WHEN_validCNPJStringWithMixedSpecialChars_THEN_returnsFormattedCNPJ', () => {
      const result = parser.parse('12.345-678/0001.90', { numbersOnly: false, throwError: true });
      expect(result).toBe('12.345.678/0001-90');
    });

    test('test_parse_WHEN_validCNPJNumber_THEN_returnsFormattedCNPJ', () => {
      const result = parser.parse(12345678000190, { numbersOnly: false, throwError: true });
      expect(result).toBe('12.345.678/0001-90');
    });

    test('test_parse_WHEN_CNPJNumberWithTypeCnpj_THEN_returnsFormattedCNPJ', () => {
      const result = parser.parse(12345678000190, { type: 'cnpj', numbersOnly: false, throwError: true });
      expect(result).toBe('12.345.678/0001-90');
    });

    test('test_parse_WHEN_CNPJNumberShorterWithTypeCnpj_THEN_padsAndReturnsFormattedCNPJ', () => {
      const result = parser.parse(123456780001, { type: 'cnpj', numbersOnly: false, throwError: true });
      expect(result).toBe('00.012.345/6780-01');
    });

    test('test_parse_WHEN_CNPJNumberVeryShortWithTypeCnpj_THEN_padsAndReturnsFormattedCNPJ', () => {
      const result = parser.parse(1, { type: 'cnpj', numbersOnly: false, throwError: true });
      expect(result).toBe('00.000.000/0000-01');
    });

    test('test_parse_WHEN_validCNPJStringWithNumbersOnlyTrue_THEN_returnsNumbersOnly', () => {
      const result = parser.parse('12.345.678/0001-90', { numbersOnly: true, throwError: true });
      expect(result).toBe('12345678000190');
    });

    test('test_parse_WHEN_validCNPJNumberWithNumbersOnlyTrue_THEN_returnsNumbersOnly', () => {
      const result = parser.parse(12345678000190, { numbersOnly: true, throwError: true });
      expect(result).toBe('12345678000190');
    });
  });

  describe('default options', () => {
    test('test_parse_WHEN_validCPFWithDefaultOptions_THEN_returnsFormattedCPF', () => {
      const result = parser.parse('123.456.789-00');
      expect(result).toBe('123.456.789-00');
    });

    test('test_parse_WHEN_validCNPJWithDefaultOptions_THEN_returnsFormattedCNPJ', () => {
      const result = parser.parse('12.345.678/0001-90');
      expect(result).toBe('12.345.678/0001-90');
    });
  });

  describe('error handling', () => {
    test('test_parse_WHEN_invalidLength_THEN_throwsError', () => {
      expect(() => {
        parser.parse('123456789', { throwError: true });
      }).toThrow(SaltoolsError);
    });

    test('test_parse_WHEN_invalidLengthWithThrowErrorTrue_THEN_throwsError', () => {
      expect(() => {
        parser.parse('123456789', { throwError: true });
      }).toThrow('Documento deve ter 11 ou 14 caracteres');
    });

    test('test_parse_WHEN_invalidLengthWithThrowErrorFalse_THEN_returnsNull', () => {
      const result = parser.parse('123456789', { throwError: false });
      expect(result).toBeNull();
    });

    test('test_parse_WHEN_invalidType_THEN_throwsError', () => {
      expect(() => {
        parser.parse(null, { throwError: true });
      }).toThrow(SaltoolsError);
    });

    test('test_parse_WHEN_invalidTypeWithThrowErrorTrue_THEN_throwsError', () => {
      expect(() => {
        parser.parse(null, { throwError: true });
      }).toThrow('deve ser string ou number');
    });

    test('test_parse_WHEN_invalidTypeWithThrowErrorFalse_THEN_returnsNull', () => {
      const result = parser.parse(null, { throwError: false });
      expect(result).toBeNull();
    });

    test('test_parse_WHEN_booleanInput_THEN_throwsError', () => {
      expect(() => {
        parser.parse(true, { throwError: true });
      }).toThrow(SaltoolsError);
    });

    test('test_parse_WHEN_objectInput_THEN_throwsError', () => {
      expect(() => {
        parser.parse({}, { throwError: true });
      }).toThrow(SaltoolsError);
    });

    test('test_parse_WHEN_arrayInput_THEN_throwsError', () => {
      expect(() => {
        parser.parse([], { throwError: true });
      }).toThrow(SaltoolsError);
    });
  });

  describe('parameter validation', () => {
    test('test_parse_WHEN_numbersOnlyIsString_THEN_throwsError', () => {
      expect(() => {
        parser.parse('12345678900', { numbersOnly: 'true', throwError: true });
      }).toThrow(SaltoolsError);
    });

    test('test_parse_WHEN_numbersOnlyIsNumber_THEN_throwsError', () => {
      expect(() => {
        parser.parse('12345678900', { numbersOnly: 1, throwError: true });
      }).toThrow(SaltoolsError);
    });

    test('test_parse_WHEN_throwErrorIsString_THEN_throwsError', () => {
      expect(() => {
        parser.parse('12345678900', { numbersOnly: true, throwError: 'true' });
      }).toThrow(SaltoolsError);
    });

    test('test_parse_WHEN_throwErrorIsNumber_THEN_throwsError', () => {
      expect(() => {
        parser.parse('12345678900', { numbersOnly: true, throwError: 1 });
      }).toThrow(SaltoolsError);
    });

    test('test_parse_WHEN_typeIsNull_THEN_returnsValue', () => {
      const result = parser.parse('12345678900', { type: null, throwError: true });
      expect(result).toBe('123.456.789-00');
    });

    test('test_parse_WHEN_typeIsCpf_THEN_returnsValue', () => {
      const result = parser.parse('12345678900', { type: 'cpf', throwError: true });
      expect(result).toBe('123.456.789-00');
    });

    test('test_parse_WHEN_typeIsCnpj_THEN_returnsValue', () => {
      const result = parser.parse('12345678000190', { type: 'cnpj', throwError: true });
      expect(result).toBe('12.345.678/0001-90');
    });

    test('test_parse_WHEN_typeIsInvalidString_THEN_throwsError', () => {
      expect(() => {
        parser.parse('12345678900', { type: 'invalid', throwError: true });
      }).toThrow(SaltoolsError);
    });

    test('test_parse_WHEN_typeIsBoolean_THEN_throwsError', () => {
      expect(() => {
        parser.parse('12345678900', { type: true, throwError: true });
      }).toThrow(SaltoolsError);
    });

    test('test_parse_WHEN_typeIsNumber_THEN_throwsError', () => {
      expect(() => {
        parser.parse('12345678900', { type: 123, throwError: true });
      }).toThrow(SaltoolsError);
    });

    test('test_parse_WHEN_typeIsObject_THEN_throwsError', () => {
      expect(() => {
        parser.parse('12345678900', { type: {}, throwError: true });
      }).toThrow(SaltoolsError);
    });

    test('test_parse_WHEN_typeIsArray_THEN_throwsError', () => {
      expect(() => {
        parser.parse('12345678900', { type: [], throwError: true });
      }).toThrow(SaltoolsError);
    });
  });

  describe('number parsing with type inference', () => {
    test('test_parse_WHEN_numberShorterThan11Digits_THEN_infersAsCPF', () => {
      const result = parser.parse(123456789, { numbersOnly: false, throwError: true });
      expect(result).toBe('123.456.789-00');
    });

    test('test_parse_WHEN_numberLongerThan11Digits_THEN_infersAsCNPJ', () => {
      const result = parser.parse(123456780001, { numbersOnly: false, throwError: true });
      expect(result).toBe('12.345.678/0001-00');
    });

    test('test_parse_WHEN_numberWith11DigitsEndingIn000xxx_THEN_infersAsCNPJ', () => {
      const result = parser.parse(12345000011, { numbersOnly: false, throwError: true });
      expect(result).toBe('12.345.000/0011-00');
    });

    test('test_parse_WHEN_numberWith11DigitsNotEndingIn000xxx_THEN_infersAsCPF', () => {
      const result = parser.parse(12345678900, { numbersOnly: false, throwError: true });
      expect(result).toBe('123.456.789-00');
    });

    test('test_parse_WHEN_floatNumber_THEN_throwsError', () => {
      expect(() => {
        parser.parse(123.45, { throwError: true });
      }).toThrow(SaltoolsError);
    });

    test('test_parse_WHEN_floatNumber_THEN_throwsErrorWithCorrectMessage', () => {
      expect(() => {
        parser.parse(123.45, { throwError: true });
      }).toThrow('Não é possível converter float');
    });

    test('test_parse_WHEN_numberCannotInferType_THEN_throwsError', () => {
      expect(() => {
        parser.parse(12345678901, { numbersOnly: false, throwError: true });
      }).toThrow(SaltoolsError);
    });

    test('test_parse_WHEN_numberCannotInferType_THEN_throwsErrorWithCorrectMessage', () => {
      expect(() => {
        parser.parse(12345678901, { numbersOnly: false, throwError: true });
      }).toThrow('Não foi possível inferir o tipo de documento');
    });
  });

  describe('edge cases', () => {
    test('test_parse_WHEN_CPFWithLeadingZeros_THEN_preservesZeros', () => {
      const result = parser.parse('000.000.001-91', { numbersOnly: false, throwError: true });
      expect(result).toBe('000.000.001-91');
    });

    test('test_parse_WHEN_CNPJWithLeadingZeros_THEN_preservesZeros', () => {
      const result = parser.parse('00.000.000/0001-91', { numbersOnly: false, throwError: true });
      expect(result).toBe('00.000.000/0001-91');
    });

    test('test_parse_WHEN_CPFWithWhitespaceAtStartAndEnd_THEN_trimsWhitespace', () => {
      const result = parser.parse('  12345678900  ', { numbersOnly: false, throwError: true });
      expect(result).toBe('123.456.789-00');
    });

    test('test_parse_WHEN_CNPJWithWhitespaceAtStartAndEnd_THEN_trimsWhitespace', () => {
      const result = parser.parse('  12345678000190  ', { numbersOnly: false, throwError: true });
      expect(result).toBe('12.345.678/0001-90');
    });

    test('test_parse_WHEN_CPFWithLetters_THEN_removesLetters', () => {
      const result = parser.parse('123abc456def78900', { numbersOnly: false, throwError: true });
      expect(result).toBe('123.456.789-00');
    });

    test('test_parse_WHEN_CNPJWithLetters_THEN_removesLetters', () => {
      const result = parser.parse('12abc345def678ghi0001jkl90', { numbersOnly: false, throwError: true });
      expect(result).toBe('12.345.678/0001-90');
    });
  });

  describe('real-world scenarios', () => {
    test('test_parse_WHEN_CPFFromFormInput_THEN_parsesCorrectly', () => {
      const result = parser.parse(' 123.456.789-00 ', { numbersOnly: true, throwError: true });
      expect(result).toBe('12345678900');
    });

    test('test_parse_WHEN_CNPJFromFormInput_THEN_parsesCorrectly', () => {
      const result = parser.parse(' 12.345.678/0001-90 ', { numbersOnly: true, throwError: true });
      expect(result).toBe('12345678000190');
    });

    test('test_parse_WHEN_CPFAsNumberFromDatabase_THEN_parsesCorrectly', () => {
      const result = parser.parse(12345678900, { numbersOnly: true, throwError: true });
      expect(result).toBe('12345678900');
    });

    test('test_parse_WHEN_CNPJAsNumberFromDatabase_THEN_parsesCorrectly', () => {
      const result = parser.parse(12345678000190, { numbersOnly: true, throwError: true });
      expect(result).toBe('12345678000190');
    });
  });
});

