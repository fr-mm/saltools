import { describe, test, expect, beforeEach } from '@jest/globals';
import StringToDateParser from 'src/commands/parse/parse-date/string-to-date-parser.js';
import SaltoolsError from 'src/errors/saltools-error.js';

describe('StringToDateParser', () => {
  let parser;

  beforeEach(() => {
    parser = new StringToDateParser();
  });

  describe('parse - ISO format', () => {
    test('test_parse_WHEN_isoFormatWithValidDate_THEN_returnsDateObject', () => {
      const result = parser.parse('2024-03-15T10:30:00Z', 'iso');
      expect(result).toBeInstanceOf(Date);
      expect(result.getFullYear()).toBe(2024);
      expect(result.getMonth()).toBe(2);
      expect(result.getDate()).toBe(15);
    });

    test('test_parse_WHEN_isoFormatCaseInsensitive_THEN_returnsDateObject', () => {
      const result = parser.parse('2024-03-15T10:30:00Z', 'ISO');
      expect(result).toBeInstanceOf(Date);
    });

    test('test_parse_WHEN_isoFormatWithInvalidDate_THEN_throwsSaltoolsError', () => {
      expect(() => parser.parse('invalid-date', 'iso')).toThrow(SaltoolsError);
    });
  });

  describe('parse - formats with separators', () => {
    test('test_parse_WHEN_ddSlashMmSlashYyyy_THEN_returnsCorrectDate', () => {
      const result = parser.parse('15/03/2024', 'dd/mm/yyyy');
      expect(result).toBeInstanceOf(Date);
      expect(result.getFullYear()).toBe(2024);
      expect(result.getMonth()).toBe(2);
      expect(result.getDate()).toBe(15);
    });

    test('test_parse_WHEN_dSlashMSlashYy_THEN_returnsCorrectDate', () => {
      const result = parser.parse('5/3/24', 'd/m/yy');
      expect(result).toBeInstanceOf(Date);
      expect(result.getFullYear()).toBe(2024);
      expect(result.getMonth()).toBe(2);
      expect(result.getDate()).toBe(5);
    });

    test('test_parse_WHEN_ddDashMmDashYyyy_THEN_returnsCorrectDate', () => {
      const result = parser.parse('15-03-2024', 'dd-mm-yyyy');
      expect(result).toBeInstanceOf(Date);
      expect(result.getFullYear()).toBe(2024);
      expect(result.getMonth()).toBe(2);
      expect(result.getDate()).toBe(15);
    });

    test('test_parse_WHEN_ddDotMmDotYyyy_THEN_returnsCorrectDate', () => {
      const result = parser.parse('15.03.2024', 'dd.mm.yyyy');
      expect(result).toBeInstanceOf(Date);
      expect(result.getFullYear()).toBe(2024);
      expect(result.getMonth()).toBe(2);
      expect(result.getDate()).toBe(15);
    });

    test('test_parse_WHEN_yyyySlashMmSlashDd_THEN_returnsCorrectDate', () => {
      const result = parser.parse('2024/03/15', 'yyyy/mm/dd');
      expect(result).toBeInstanceOf(Date);
      expect(result.getFullYear()).toBe(2024);
      expect(result.getMonth()).toBe(2);
      expect(result.getDate()).toBe(15);
    });

    test('test_parse_WHEN_mmSlashDdSlashYyyy_THEN_returnsCorrectDate', () => {
      const result = parser.parse('03/15/2024', 'mm/dd/yyyy');
      expect(result).toBeInstanceOf(Date);
      expect(result.getFullYear()).toBe(2024);
      expect(result.getMonth()).toBe(2);
      expect(result.getDate()).toBe(15);
    });

    test('test_parse_WHEN_twoDigitYearLessThan50_THEN_returnsCurrentCentury', () => {
      const currentYear = new Date().getFullYear();
      const currentCentury = Math.floor(currentYear / 100) * 100;
      const result = parser.parse('15/03/24', 'dd/mm/yy');
      expect(result.getFullYear()).toBe(currentCentury + 24);
    });

    test('test_parse_WHEN_twoDigitYearGreaterThanOrEqual50_THEN_returnsPreviousCentury', () => {
      const currentYear = new Date().getFullYear();
      const previousCentury = Math.floor(currentYear / 100) * 100 - 100;
      const result = parser.parse('15/03/99', 'dd/mm/yy');
      expect(result.getFullYear()).toBe(previousCentury + 99);
    });
  });

  describe('parse - formats without separators', () => {
    test('test_parse_WHEN_ddmmyyyyFormat_THEN_returnsCorrectDate', () => {
      const result = parser.parse('15032024', 'ddmmyyyy');
      expect(result).toBeInstanceOf(Date);
      expect(result.getFullYear()).toBe(2024);
      expect(result.getMonth()).toBe(2);
      expect(result.getDate()).toBe(15);
    });

    test('test_parse_WHEN_dmmyyyyFormat_THEN_returnsCorrectDate', () => {
      const result = parser.parse('5032024', 'dmmyyyy');
      expect(result).toBeInstanceOf(Date);
      expect(result.getFullYear()).toBe(2024);
      expect(result.getMonth()).toBe(2);
      expect(result.getDate()).toBe(5);
    });

    test('test_parse_WHEN_ddmmyyFormat_THEN_returnsCorrectDate', () => {
      const currentYear = new Date().getFullYear();
      const currentCentury = Math.floor(currentYear / 100) * 100;
      const result = parser.parse('150324', 'ddmmyy');
      expect(result.getFullYear()).toBe(currentCentury + 24);
      expect(result.getMonth()).toBe(2);
      expect(result.getDate()).toBe(15);
    });

    test('test_parse_WHEN_yyyymmddFormat_THEN_returnsCorrectDate', () => {
      const result = parser.parse('20240315', 'yyyymmdd');
      expect(result).toBeInstanceOf(Date);
      expect(result.getFullYear()).toBe(2024);
      expect(result.getMonth()).toBe(2);
      expect(result.getDate()).toBe(15);
    });

    test('test_parse_WHEN_mmddyyyyFormat_THEN_returnsCorrectDate', () => {
      const result = parser.parse('03152024', 'mmddyyyy');
      expect(result).toBeInstanceOf(Date);
      expect(result.getFullYear()).toBe(2024);
      expect(result.getMonth()).toBe(2);
      expect(result.getDate()).toBe(15);
    });
  });

  describe('parse - validation errors', () => {
    test('test_parse_WHEN_dateIsNotString_THEN_throwsSaltoolsError', () => {
      expect(() => parser.parse(123, 'dd/mm/yyyy')).toThrow(SaltoolsError);
      expect(() => parser.parse(123, 'dd/mm/yyyy')).toThrow('date deve ser string');
    });

    test('test_parse_WHEN_formatIsNotString_THEN_throwsSaltoolsError', () => {
      expect(() => parser.parse('15/03/2024', 123)).toThrow(SaltoolsError);
      expect(() => parser.parse('15/03/2024', 123)).toThrow('format deve ser string');
    });

    test('test_parse_WHEN_formatIsNull_THEN_throwsSaltoolsError', () => {
      expect(() => parser.parse('15/03/2024', null)).toThrow(SaltoolsError);
      expect(() => parser.parse('15/03/2024', null)).toThrow('format é obrigatório');
    });

    test('test_parse_WHEN_dateIsNull_THEN_throwsSaltoolsError', () => {
      expect(() => parser.parse(null, 'dd/mm/yyyy')).toThrow(SaltoolsError);
      expect(() => parser.parse(null, 'dd/mm/yyyy')).toThrow('date é obrigatório');
    });

    test('test_parse_WHEN_invalidFormatTooManyD_THEN_throwsSaltoolsError', () => {
      expect(() => parser.parse('15/03/2024', 'ddd/mm/yyyy')).toThrow(SaltoolsError);
      expect(() => parser.parse('15/03/2024', 'ddd/mm/yyyy')).toThrow('format deve conter 1 ou 2 "d", 1 ou 2 "m" e 2 ou 4 "y"');
    });

    test('test_parse_WHEN_invalidFormatTooManyM_THEN_throwsSaltoolsError', () => {
      expect(() => parser.parse('15/03/2024', 'dd/mmm/yyyy')).toThrow(SaltoolsError);
      expect(() => parser.parse('15/03/2024', 'dd/mmm/yyyy')).toThrow('format deve conter 1 ou 2 "d", 1 ou 2 "m" e 2 ou 4 "y"');
    });

    test('test_parse_WHEN_invalidFormatWrongYearCount_THEN_throwsSaltoolsError', () => {
      expect(() => parser.parse('15/03/2024', 'dd/mm/yyyyy')).toThrow(SaltoolsError);
      expect(() => parser.parse('15/03/2024', 'dd/mm/yyyyy')).toThrow('format deve conter 1 ou 2 "d", 1 ou 2 "m" e 2 ou 4 "y"');
    });

    test('test_parse_WHEN_inconsistentFormatSeparators_THEN_throwsSaltoolsError', () => {
      expect(() => parser.parse('15/03/2024', 'dd/mm-yyyy')).toThrow(SaltoolsError);
      expect(() => parser.parse('15/03/2024', 'dd/mm-yyyy')).toThrow('Formato contém separadores inconsistentes');
    });

    test('test_parse_WHEN_inconsistentDateSeparators_THEN_throwsSaltoolsError', () => {
      expect(() => parser.parse('15/03-2024', 'dd/mm/yyyy')).toThrow(SaltoolsError);
      expect(() => parser.parse('15/03-2024', 'dd/mm/yyyy')).toThrow('Data contém separadores inconsistentes');
    });

    test('test_parse_WHEN_separatorMismatch_THEN_throwsSaltoolsError', () => {
      expect(() => parser.parse('15-03-2024', 'dd/mm/yyyy')).toThrow(SaltoolsError);
      expect(() => parser.parse('15-03-2024', 'dd/mm/yyyy')).toThrow('Separador da data não corresponde ao formato');
    });

    test('test_parse_WHEN_invalidDateValue_THEN_throwsSaltoolsError', () => {
      expect(() => parser.parse('32/03/2024', 'dd/mm/yyyy')).toThrow(SaltoolsError);
      expect(() => parser.parse('32/03/2024', 'dd/mm/yyyy')).toThrow('Data inválida: 32/03/2024');
    });

    test('test_parse_WHEN_invalidMonthValue_THEN_throwsSaltoolsError', () => {
      expect(() => parser.parse('15/13/2024', 'dd/mm/yyyy')).toThrow(SaltoolsError);
      expect(() => parser.parse('15/13/2024', 'dd/mm/yyyy')).toThrow('Data inválida: 15/13/2024');
    });

    test('test_parse_WHEN_invalidDateWithSeparator_THEN_throwsSaltoolsError', () => {
      expect(() => parser.parse('15/03/2024/extra', 'dd/mm/yyyy')).toThrow(SaltoolsError);
      expect(() => parser.parse('15/03/2024/extra', 'dd/mm/yyyy')).toThrow('Data contém separadores inconsistentes');
    });

    test('test_parse_WHEN_invalidDateWithoutSeparator_THEN_throwsSaltoolsError', () => {
      expect(() => parser.parse('150320240', 'ddmmyyyy')).toThrow(SaltoolsError);
      expect(() => parser.parse('150320240', 'ddmmyyyy')).toThrow('Formato de data inválido');
    });

    test('test_parse_WHEN_invalidDateShortWithoutSeparator_THEN_throwsSaltoolsError', () => {
      expect(() => parser.parse('1503202', 'ddmmyyyy')).toThrow(SaltoolsError);
      expect(() => parser.parse('1503202', 'ddmmyyyy')).toThrow('Formato de data inválido');
    });

    test('test_parse_WHEN_invalidDateWithNonNumeric_THEN_throwsSaltoolsError', () => {
      expect(() => parser.parse('15/ab/2024', 'dd/mm/yyyy')).toThrow(SaltoolsError);
      expect(() => parser.parse('15/ab/2024', 'dd/mm/yyyy')).toThrow('Data contém separadores inconsistentes');
    });

    test('test_parse_WHEN_formatWithoutD_THEN_throwsSaltoolsError', () => {
      expect(() => parser.parse('15/03/2024', 'mm/yyyy')).toThrow(SaltoolsError);
    });

    test('test_parse_WHEN_formatWithoutM_THEN_throwsSaltoolsError', () => {
      expect(() => parser.parse('15/03/2024', 'dd/yyyy')).toThrow(SaltoolsError);
    });

    test('test_parse_WHEN_formatWithoutY_THEN_throwsSaltoolsError', () => {
      expect(() => parser.parse('15/03/2024', 'dd/mm')).toThrow(SaltoolsError);
    });
  });

  describe('parse - edge cases', () => {
    test('test_parse_WHEN_leapYearDate_THEN_returnsCorrectDate', () => {
      const result = parser.parse('29/02/2024', 'dd/mm/yyyy');
      expect(result).toBeInstanceOf(Date);
      expect(result.getFullYear()).toBe(2024);
      expect(result.getMonth()).toBe(1);
      expect(result.getDate()).toBe(29);
    });

    test('test_parse_WHEN_invalidLeapYearDate_THEN_throwsSaltoolsError', () => {
      expect(() => parser.parse('29/02/2023', 'dd/mm/yyyy')).toThrow(SaltoolsError);
      expect(() => parser.parse('29/02/2023', 'dd/mm/yyyy')).toThrow('Data inválida: 29/02/2023');
    });

    test('test_parse_WHEN_firstDayOfYear_THEN_returnsCorrectDate', () => {
      const result = parser.parse('01/01/2024', 'dd/mm/yyyy');
      expect(result).toBeInstanceOf(Date);
      expect(result.getFullYear()).toBe(2024);
      expect(result.getMonth()).toBe(0);
      expect(result.getDate()).toBe(1);
    });

    test('test_parse_WHEN_lastDayOfYear_THEN_returnsCorrectDate', () => {
      const result = parser.parse('31/12/2024', 'dd/mm/yyyy');
      expect(result).toBeInstanceOf(Date);
      expect(result.getFullYear()).toBe(2024);
      expect(result.getMonth()).toBe(11);
      expect(result.getDate()).toBe(31);
    });
  });

  describe('parse - cache optimization', () => {
    test('test_parse_WHEN_sameFormatUsedMultipleTimes_THEN_usesCache', () => {
      const parser1 = new StringToDateParser();
      const parser2 = new StringToDateParser();

      const result1 = parser1.parse('15/03/2024', 'dd/mm/yyyy');
      const result2 = parser2.parse('20/04/2024', 'dd/mm/yyyy');
      const result3 = parser1.parse('25/05/2024', 'dd/mm/yyyy');

      expect(result1).toBeInstanceOf(Date);
      expect(result2).toBeInstanceOf(Date);
      expect(result3).toBeInstanceOf(Date);
      expect(result1.getDate()).toBe(15);
      expect(result2.getDate()).toBe(20);
      expect(result3.getDate()).toBe(25);
    });

    test('test_parse_WHEN_differentFormatUsed_THEN_updatesCache', () => {
      parser.parse('15/03/2024', 'dd/mm/yyyy');
      const result = parser.parse('15032024', 'ddmmyyyy');

      expect(result).toBeInstanceOf(Date);
      expect(result.getFullYear()).toBe(2024);
      expect(result.getMonth()).toBe(2);
      expect(result.getDate()).toBe(15);
    });
  });

  describe('parse - trim', () => {
    test('test_parse_WHEN_dateWithLeadingSpaces_THEN_trimsAndReturnsCorrectDate', () => {
      const result = parser.parse('  15/03/2024', 'dd/mm/yyyy');
      expect(result).toBeInstanceOf(Date);
      expect(result.getFullYear()).toBe(2024);
      expect(result.getMonth()).toBe(2);
      expect(result.getDate()).toBe(15);
    });

    test('test_parse_WHEN_dateWithTrailingSpaces_THEN_trimsAndReturnsCorrectDate', () => {
      const result = parser.parse('15/03/2024  ', 'dd/mm/yyyy');
      expect(result).toBeInstanceOf(Date);
      expect(result.getFullYear()).toBe(2024);
      expect(result.getMonth()).toBe(2);
      expect(result.getDate()).toBe(15);
    });

    test('test_parse_WHEN_dateWithLeadingAndTrailingSpaces_THEN_trimsAndReturnsCorrectDate', () => {
      const result = parser.parse('  15/03/2024  ', 'dd/mm/yyyy');
      expect(result).toBeInstanceOf(Date);
      expect(result.getFullYear()).toBe(2024);
      expect(result.getMonth()).toBe(2);
      expect(result.getDate()).toBe(15);
    });

    test('test_parse_WHEN_formatWithLeadingSpaces_THEN_trimsAndReturnsCorrectDate', () => {
      const result = parser.parse('15/03/2024', '  dd/mm/yyyy');
      expect(result).toBeInstanceOf(Date);
      expect(result.getFullYear()).toBe(2024);
      expect(result.getMonth()).toBe(2);
      expect(result.getDate()).toBe(15);
    });

    test('test_parse_WHEN_formatWithTrailingSpaces_THEN_trimsAndReturnsCorrectDate', () => {
      const result = parser.parse('15/03/2024', 'dd/mm/yyyy  ');
      expect(result).toBeInstanceOf(Date);
      expect(result.getFullYear()).toBe(2024);
      expect(result.getMonth()).toBe(2);
      expect(result.getDate()).toBe(15);
    });

    test('test_parse_WHEN_formatWithLeadingAndTrailingSpaces_THEN_trimsAndReturnsCorrectDate', () => {
      const result = parser.parse('15/03/2024', '  dd/mm/yyyy  ');
      expect(result).toBeInstanceOf(Date);
      expect(result.getFullYear()).toBe(2024);
      expect(result.getMonth()).toBe(2);
      expect(result.getDate()).toBe(15);
    });

    test('test_parse_WHEN_bothDateAndFormatWithSpaces_THEN_trimsAndReturnsCorrectDate', () => {
      const result = parser.parse('  15/03/2024  ', '  dd/mm/yyyy  ');
      expect(result).toBeInstanceOf(Date);
      expect(result.getFullYear()).toBe(2024);
      expect(result.getMonth()).toBe(2);
      expect(result.getDate()).toBe(15);
    });

    test('test_parse_WHEN_isoFormatWithSpaces_THEN_trimsAndReturnsCorrectDate', () => {
      const result = parser.parse('  2024-03-15T10:30:00Z  ', '  iso  ');
      expect(result).toBeInstanceOf(Date);
      expect(result.getFullYear()).toBe(2024);
      expect(result.getMonth()).toBe(2);
      expect(result.getDate()).toBe(15);
    });

    test('test_parse_WHEN_formatWithoutSeparatorWithSpaces_THEN_trimsAndReturnsCorrectDate', () => {
      const result = parser.parse('  15032024  ', '  ddmmyyyy  ');
      expect(result).toBeInstanceOf(Date);
      expect(result.getFullYear()).toBe(2024);
      expect(result.getMonth()).toBe(2);
      expect(result.getDate()).toBe(15);
    });

    test('test_parse_WHEN_dateWithoutSeparatorWithSpaces_THEN_trimsAndReturnsCorrectDate', () => {
      const result = parser.parse('  15032024  ', 'ddmmyyyy');
      expect(result).toBeInstanceOf(Date);
      expect(result.getFullYear()).toBe(2024);
      expect(result.getMonth()).toBe(2);
      expect(result.getDate()).toBe(15);
    });
  });
});

