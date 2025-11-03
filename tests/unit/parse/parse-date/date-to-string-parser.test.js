import { describe, test, expect, beforeEach } from '@jest/globals';
import DateToStringParser from 'src/commands/parse/parse-date/date-to-string-parser.js';
import SaltoolsError from 'src/errors/saltools-error.js';

describe('DateToStringParser', () => {
  let parser;

  beforeEach(() => {
    parser = new DateToStringParser();
  });

  describe('parse - ISO format', () => {
    test('test_parse_WHEN_isoFormatWithValidDate_THEN_returnsIsoString', () => {
      const date = new Date('2024-03-15T10:30:00Z');
      const result = parser.parse(date, 'iso');
      expect(typeof result).toBe('string');
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    });

    test('test_parse_WHEN_isoFormatCaseInsensitive_THEN_returnsIsoString', () => {
      const date = new Date('2024-03-15T10:30:00Z');
      const result = parser.parse(date, 'ISO');
      expect(typeof result).toBe('string');
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    });

    test('test_parse_WHEN_isoFormatWithInvalidDate_THEN_throwsSaltoolsError', () => {
      const invalidDate = new Date('invalid-date');
      expect(() => parser.parse(invalidDate, 'iso')).toThrow(SaltoolsError);
      expect(() => parser.parse(invalidDate, 'iso')).toThrow('date deve ser uma data válida');
    });
  });

  describe('parse - formats with separators', () => {
    test('test_parse_WHEN_ddSlashMmSlashYyyy_THEN_returnsCorrectString', () => {
      const date = new Date(2024, 2, 15);
      const result = parser.parse(date, 'dd/mm/yyyy');
      expect(result).toBe('15/03/2024');
    });

    test('test_parse_WHEN_dSlashMSlashYy_THEN_returnsCorrectString', () => {
      const date = new Date(2024, 2, 5);
      const result = parser.parse(date, 'd/m/yy');
      expect(result).toBe('5/3/24');
    });

    test('test_parse_WHEN_ddDashMmDashYyyy_THEN_returnsCorrectString', () => {
      const date = new Date(2024, 2, 15);
      const result = parser.parse(date, 'dd-mm-yyyy');
      expect(result).toBe('15-03-2024');
    });

    test('test_parse_WHEN_ddDotMmDotYyyy_THEN_returnsCorrectString', () => {
      const date = new Date(2024, 2, 15);
      const result = parser.parse(date, 'dd.mm.yyyy');
      expect(result).toBe('15.03.2024');
    });

    test('test_parse_WHEN_yyyySlashMmSlashDd_THEN_returnsCorrectString', () => {
      const date = new Date(2024, 2, 15);
      const result = parser.parse(date, 'yyyy/mm/dd');
      expect(result).toBe('2024/03/15');
    });

    test('test_parse_WHEN_mmSlashDdSlashYyyy_THEN_returnsCorrectString', () => {
      const date = new Date(2024, 2, 15);
      const result = parser.parse(date, 'mm/dd/yyyy');
      expect(result).toBe('03/15/2024');
    });

    test('test_parse_WHEN_twoDigitYear_THEN_returnsTwoDigitYear', () => {
      const date = new Date(2024, 2, 15);
      const result = parser.parse(date, 'dd/mm/yy');
      expect(result).toBe('15/03/24');
    });

    test('test_parse_WHEN_singleDigitDayAndMonth_THEN_returnsCorrectString', () => {
      const date = new Date(2024, 2, 5);
      const result = parser.parse(date, 'd/m/yyyy');
      expect(result).toBe('5/3/2024');
    });

    test('test_parse_WHEN_doubleDigitDayAndMonth_THEN_returnsPaddedString', () => {
      const date = new Date(2024, 2, 5);
      const result = parser.parse(date, 'dd/mm/yyyy');
      expect(result).toBe('05/03/2024');
    });
  });

  describe('parse - formats without separators', () => {
    test('test_parse_WHEN_ddmmyyyyFormat_THEN_returnsCorrectString', () => {
      const date = new Date(2024, 2, 15);
      const result = parser.parse(date, 'ddmmyyyy');
      expect(result).toBe('15032024');
    });

    test('test_parse_WHEN_dmmyyyyFormat_THEN_returnsCorrectString', () => {
      const date = new Date(2024, 2, 5);
      const result = parser.parse(date, 'dmmyyyy');
      expect(result).toBe('5032024');
    });

    test('test_parse_WHEN_ddmmyyFormat_THEN_returnsCorrectString', () => {
      const date = new Date(2024, 2, 15);
      const result = parser.parse(date, 'ddmmyy');
      expect(result).toBe('150324');
    });

    test('test_parse_WHEN_yyyymmddFormat_THEN_returnsCorrectString', () => {
      const date = new Date(2024, 2, 15);
      const result = parser.parse(date, 'yyyymmdd');
      expect(result).toBe('20240315');
    });

    test('test_parse_WHEN_mmddyyyyFormat_THEN_returnsCorrectString', () => {
      const date = new Date(2024, 2, 15);
      const result = parser.parse(date, 'mmddyyyy');
      expect(result).toBe('03152024');
    });
  });

  describe('parse - validation errors', () => {
    test('test_parse_WHEN_dateIsNotDateInstance_THEN_throwsSaltoolsError', () => {
      expect(() => parser.parse('2024-03-15', 'dd/mm/yyyy')).toThrow(SaltoolsError);
      expect(() => parser.parse('2024-03-15', 'dd/mm/yyyy')).toThrow('date deve ser uma instância de Date');
    });

    test('test_parse_WHEN_dateIsNull_THEN_throwsSaltoolsError', () => {
      expect(() => parser.parse(null, 'dd/mm/yyyy')).toThrow(SaltoolsError);
    });

    test('test_parse_WHEN_dateIsUndefined_THEN_throwsSaltoolsError', () => {
      expect(() => parser.parse(undefined, 'dd/mm/yyyy')).toThrow(SaltoolsError);
    });

    test('test_parse_WHEN_formatIsNotString_THEN_throwsSaltoolsError', () => {
      const date = new Date(2024, 2, 15);
      expect(() => parser.parse(date, 123)).toThrow(SaltoolsError);
      expect(() => parser.parse(date, 123)).toThrow('format deve ser string');
    });

    test('test_parse_WHEN_formatIsNull_THEN_throwsSaltoolsError', () => {
      const date = new Date(2024, 2, 15);
      expect(() => parser.parse(date, null)).toThrow(SaltoolsError);
      expect(() => parser.parse(date, null)).toThrow('format é obrigatório');
    });

    test('test_parse_WHEN_invalidFormatTooManyD_THEN_throwsSaltoolsError', () => {
      const date = new Date(2024, 2, 15);
      expect(() => parser.parse(date, 'ddd/mm/yyyy')).toThrow(SaltoolsError);
      expect(() => parser.parse(date, 'ddd/mm/yyyy')).toThrow('format deve conter 1 ou 2 "d", 1 ou 2 "m" e 2 ou 4 "y"');
    });

    test('test_parse_WHEN_invalidFormatTooManyM_THEN_throwsSaltoolsError', () => {
      const date = new Date(2024, 2, 15);
      expect(() => parser.parse(date, 'dd/mmm/yyyy')).toThrow(SaltoolsError);
      expect(() => parser.parse(date, 'dd/mmm/yyyy')).toThrow('format deve conter 1 ou 2 "d", 1 ou 2 "m" e 2 ou 4 "y"');
    });

    test('test_parse_WHEN_invalidFormatWrongYearCount_THEN_throwsSaltoolsError', () => {
      const date = new Date(2024, 2, 15);
      expect(() => parser.parse(date, 'dd/mm/yyyyy')).toThrow(SaltoolsError);
      expect(() => parser.parse(date, 'dd/mm/yyyyy')).toThrow('format deve conter 1 ou 2 "d", 1 ou 2 "m" e 2 ou 4 "y"');
    });

    test('test_parse_WHEN_inconsistentFormatSeparators_THEN_throwsSaltoolsError', () => {
      const date = new Date(2024, 2, 15);
      expect(() => parser.parse(date, 'dd/mm-yyyy')).toThrow(SaltoolsError);
      expect(() => parser.parse(date, 'dd/mm-yyyy')).toThrow('Formato contém separadores inconsistentes');
    });

    test('test_parse_WHEN_formatWithoutD_THEN_throwsSaltoolsError', () => {
      const date = new Date(2024, 2, 15);
      expect(() => parser.parse(date, 'mm/yyyy')).toThrow(SaltoolsError);
    });

    test('test_parse_WHEN_formatWithoutM_THEN_throwsSaltoolsError', () => {
      const date = new Date(2024, 2, 15);
      expect(() => parser.parse(date, 'dd/yyyy')).toThrow(SaltoolsError);
    });

    test('test_parse_WHEN_formatWithoutY_THEN_throwsSaltoolsError', () => {
      const date = new Date(2024, 2, 15);
      expect(() => parser.parse(date, 'dd/mm')).toThrow(SaltoolsError);
    });
  });

  describe('parse - edge cases', () => {
    test('test_parse_WHEN_leapYearDate_THEN_returnsCorrectString', () => {
      const date = new Date(2024, 1, 29);
      const result = parser.parse(date, 'dd/mm/yyyy');
      expect(result).toBe('29/02/2024');
    });

    test('test_parse_WHEN_firstDayOfYear_THEN_returnsCorrectString', () => {
      const date = new Date(2024, 0, 1);
      const result = parser.parse(date, 'dd/mm/yyyy');
      expect(result).toBe('01/01/2024');
    });

    test('test_parse_WHEN_lastDayOfYear_THEN_returnsCorrectString', () => {
      const date = new Date(2024, 11, 31);
      const result = parser.parse(date, 'dd/mm/yyyy');
      expect(result).toBe('31/12/2024');
    });

    test('test_parse_WHEN_firstMonth_THEN_returnsCorrectString', () => {
      const date = new Date(2024, 0, 15);
      const result = parser.parse(date, 'dd/mm/yyyy');
      expect(result).toBe('15/01/2024');
    });

    test('test_parse_WHEN_lastMonth_THEN_returnsCorrectString', () => {
      const date = new Date(2024, 11, 15);
      const result = parser.parse(date, 'dd/mm/yyyy');
      expect(result).toBe('15/12/2024');
    });
  });

  describe('parse - cache optimization', () => {
    test('test_parse_WHEN_sameFormatUsedMultipleTimes_THEN_usesCache', () => {
      const parser1 = new DateToStringParser();
      const parser2 = new DateToStringParser();

      const date1 = new Date(2024, 2, 15);
      const date2 = new Date(2024, 3, 20);
      const date3 = new Date(2024, 4, 25);

      const result1 = parser1.parse(date1, 'dd/mm/yyyy');
      const result2 = parser2.parse(date2, 'dd/mm/yyyy');
      const result3 = parser1.parse(date3, 'dd/mm/yyyy');

      expect(result1).toBe('15/03/2024');
      expect(result2).toBe('20/04/2024');
      expect(result3).toBe('25/05/2024');
    });

    test('test_parse_WHEN_differentFormatUsed_THEN_updatesCache', () => {
      const date = new Date(2024, 2, 15);
      parser.parse(date, 'dd/mm/yyyy');
      const result = parser.parse(date, 'ddmmyyyy');

      expect(result).toBe('15032024');
    });
  });

  describe('parse - trim', () => {
    test('test_parse_WHEN_formatWithLeadingSpaces_THEN_trimsAndReturnsCorrectString', () => {
      const date = new Date(2024, 2, 15);
      const result = parser.parse(date, '  dd/mm/yyyy');
      expect(result).toBe('15/03/2024');
    });

    test('test_parse_WHEN_formatWithTrailingSpaces_THEN_trimsAndReturnsCorrectString', () => {
      const date = new Date(2024, 2, 15);
      const result = parser.parse(date, 'dd/mm/yyyy  ');
      expect(result).toBe('15/03/2024');
    });

    test('test_parse_WHEN_formatWithLeadingAndTrailingSpaces_THEN_trimsAndReturnsCorrectString', () => {
      const date = new Date(2024, 2, 15);
      const result = parser.parse(date, '  dd/mm/yyyy  ');
      expect(result).toBe('15/03/2024');
    });

    test('test_parse_WHEN_isoFormatWithSpaces_THEN_trimsAndReturnsCorrectString', () => {
      const date = new Date('2024-03-15T10:30:00Z');
      const result = parser.parse(date, '  iso  ');
      expect(typeof result).toBe('string');
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    });

    test('test_parse_WHEN_formatWithoutSeparatorWithSpaces_THEN_trimsAndReturnsCorrectString', () => {
      const date = new Date(2024, 2, 15);
      const result = parser.parse(date, '  ddmmyyyy  ');
      expect(result).toBe('15032024');
    });
  });

  describe('parse - year formatting', () => {
    test('test_parse_WHEN_fourDigitYear_THEN_returnsFullYear', () => {
      const date = new Date(2024, 2, 15);
      const result = parser.parse(date, 'dd/mm/yyyy');
      expect(result).toBe('15/03/2024');
    });

    test('test_parse_WHEN_twoDigitYear_THEN_returnsLastTwoDigits', () => {
      const date = new Date(2024, 2, 15);
      const result = parser.parse(date, 'dd/mm/yy');
      expect(result).toBe('15/03/24');
    });

    test('test_parse_WHEN_yearWithLeadingZeros_THEN_returnsCorrectString', () => {
      const date = new Date(2000, 2, 15);
      const result = parser.parse(date, 'dd/mm/yy');
      expect(result).toBe('15/03/00');
    });

    test('test_parse_WHEN_yearWithSingleDigit_THEN_returnsPaddedString', () => {
      const date = new Date(2024, 2, 15);
      const result = parser.parse(date, 'dd/mm/yy');
      expect(result).toBe('15/03/24');
    });
  });
});

