import { describe, test, expect, beforeEach, jest } from '@jest/globals';
import { DateParser } from 'src/commands/parse/parse-date/date-parser.js';
import SaltoolsError from 'src/errors/saltools-error.js';

describe('DateParser', () => {
  let parser;
  let mockStringToDateParser;
  let mockDateToStringParser;

  beforeEach(() => {
    mockStringToDateParser = {
      parse: jest.fn(),
    };
    mockDateToStringParser = {
      parse: jest.fn(),
    };
    parser = new DateParser(mockStringToDateParser, mockDateToStringParser);
  });

  describe('parse - successful conversion', () => {
    test('test_parse_WHEN_validConversion_THEN_callsParsersInSequence', () => {
      const inputDate = '2024-03-15T10:30:00Z';
      const inputFormat = 'iso';
      const outputFormat = 'iso';
      const mockDateObject = new Date('2024-03-15T10:30:00Z');
      const mockOutputString = '2024-03-15T10:30:00.000Z';

      mockStringToDateParser.parse.mockReturnValue(mockDateObject);
      mockDateToStringParser.parse.mockReturnValue(mockOutputString);

      const result = parser.parse(inputDate, {
        inputFormat,
        outputFormat,
      });

      expect(mockStringToDateParser.parse).toHaveBeenCalledWith(inputDate, inputFormat);
      expect(mockDateToStringParser.parse).toHaveBeenCalledWith(mockDateObject, outputFormat);
      expect(result).toBe(mockOutputString);
    });

    test('test_parse_WHEN_defaultFormats_THEN_usesIsoForBoth', () => {
      const inputDate = '2024-03-15T10:30:00Z';
      const mockDateObject = new Date('2024-03-15T10:30:00Z');
      const mockOutputString = '2024-03-15T10:30:00.000Z';

      mockStringToDateParser.parse.mockReturnValue(mockDateObject);
      mockDateToStringParser.parse.mockReturnValue(mockOutputString);

      const result = parser.parse(inputDate);

      expect(mockStringToDateParser.parse).toHaveBeenCalledWith(inputDate, 'iso');
      expect(mockDateToStringParser.parse).toHaveBeenCalledWith(mockDateObject, 'iso');
      expect(result).toBe(mockOutputString);
    });

    test('test_parse_WHEN_customFormats_THEN_passesFormatsCorrectly', () => {
      const inputDate = '15/03/2024';
      const inputFormat = 'dd/mm/yyyy';
      const outputFormat = 'mm/dd/yyyy';
      const mockDateObject = new Date(2024, 2, 15);
      const mockOutputString = '03/15/2024';

      mockStringToDateParser.parse.mockReturnValue(mockDateObject);
      mockDateToStringParser.parse.mockReturnValue(mockOutputString);

      const result = parser.parse(inputDate, {
        inputFormat,
        outputFormat,
      });

      expect(mockStringToDateParser.parse).toHaveBeenCalledWith(inputDate, inputFormat);
      expect(mockDateToStringParser.parse).toHaveBeenCalledWith(mockDateObject, outputFormat);
      expect(result).toBe(mockOutputString);
    });

    test('test_parse_WHEN_customInputFormatOnly_THEN_usesDefaultOutputFormat', () => {
      const inputDate = '15/03/2024';
      const inputFormat = 'dd/mm/yyyy';
      const mockDateObject = new Date(2024, 2, 15);
      const mockOutputString = '2024-03-15T00:00:00.000Z';

      mockStringToDateParser.parse.mockReturnValue(mockDateObject);
      mockDateToStringParser.parse.mockReturnValue(mockOutputString);

      const result = parser.parse(inputDate, {
        inputFormat,
      });

      expect(mockStringToDateParser.parse).toHaveBeenCalledWith(inputDate, inputFormat);
      expect(mockDateToStringParser.parse).toHaveBeenCalledWith(mockDateObject, 'iso');
      expect(result).toBe(mockOutputString);
    });

    test('test_parse_WHEN_customOutputFormatOnly_THEN_usesDefaultInputFormat', () => {
      const inputDate = '2024-03-15T10:30:00Z';
      const outputFormat = 'dd/mm/yyyy';
      const mockDateObject = new Date('2024-03-15T10:30:00Z');
      const mockOutputString = '15/03/2024';

      mockStringToDateParser.parse.mockReturnValue(mockDateObject);
      mockDateToStringParser.parse.mockReturnValue(mockOutputString);

      const result = parser.parse(inputDate, {
        outputFormat,
      });

      expect(mockStringToDateParser.parse).toHaveBeenCalledWith(inputDate, 'iso');
      expect(mockDateToStringParser.parse).toHaveBeenCalledWith(mockDateObject, outputFormat);
      expect(result).toBe(mockOutputString);
    });
  });

  describe('parse - error handling with throwError true', () => {
    test('test_parse_WHEN_stringParserThrowsSaltoolsErrorWithThrowErrorTrue_THEN_throwsError', () => {
      const error = new SaltoolsError('Invalid date');
      mockStringToDateParser.parse.mockImplementation(() => {
        throw error;
      });

      expect(() => parser.parse('invalid-date', {
        inputFormat: 'iso',
        outputFormat: 'iso',
        throwError: true,
      })).toThrow(SaltoolsError);
      expect(mockDateToStringParser.parse).not.toHaveBeenCalled();
    });

    test('test_parse_WHEN_stringParserThrowsSaltoolsErrorWithThrowErrorDefault_THEN_throwsError', () => {
      const error = new SaltoolsError('Invalid date');
      mockStringToDateParser.parse.mockImplementation(() => {
        throw error;
      });

      expect(() => parser.parse('invalid-date', {
        inputFormat: 'iso',
        outputFormat: 'iso',
      })).toThrow(SaltoolsError);
      expect(mockDateToStringParser.parse).not.toHaveBeenCalled();
    });

    test('test_parse_WHEN_dateToStringParserThrowsSaltoolsErrorWithThrowErrorTrue_THEN_throwsError', () => {
      const mockDateObject = new Date('2024-03-15T10:30:00Z');
      const error = new SaltoolsError('Invalid format');
      mockStringToDateParser.parse.mockReturnValue(mockDateObject);
      mockDateToStringParser.parse.mockImplementation(() => {
        throw error;
      });

      expect(() => parser.parse('2024-03-15T10:30:00Z', {
        inputFormat: 'iso',
        outputFormat: 'invalid-format',
        throwError: true,
      })).toThrow(SaltoolsError);
      expect(mockStringToDateParser.parse).toHaveBeenCalled();
    });

    test('test_parse_WHEN_nonSaltoolsErrorWithThrowErrorTrue_THEN_throwsError', () => {
      const error = new Error('Unexpected error');
      mockStringToDateParser.parse.mockImplementation(() => {
        throw error;
      });

      expect(() => parser.parse('test', {
        inputFormat: 'iso',
        outputFormat: 'iso',
        throwError: true,
      })).toThrow('Unexpected error');
      expect(mockDateToStringParser.parse).not.toHaveBeenCalled();
    });
  });

  describe('parse - error handling with throwError false', () => {
    test('test_parse_WHEN_stringParserThrowsSaltoolsErrorWithThrowErrorFalse_THEN_returnsNull', () => {
      const error = new SaltoolsError('Invalid date');
      mockStringToDateParser.parse.mockImplementation(() => {
        throw error;
      });

      const result = parser.parse('invalid-date', {
        inputFormat: 'iso',
        outputFormat: 'iso',
        throwError: false,
      });

      expect(result).toBeNull();
      expect(mockDateToStringParser.parse).not.toHaveBeenCalled();
    });

    test('test_parse_WHEN_dateToStringParserThrowsSaltoolsErrorWithThrowErrorFalse_THEN_returnsNull', () => {
      const mockDateObject = new Date('2024-03-15T10:30:00Z');
      const error = new SaltoolsError('Invalid format');
      mockStringToDateParser.parse.mockReturnValue(mockDateObject);
      mockDateToStringParser.parse.mockImplementation(() => {
        throw error;
      });

      const result = parser.parse('2024-03-15T10:30:00Z', {
        inputFormat: 'iso',
        outputFormat: 'invalid-format',
        throwError: false,
      });

      expect(result).toBeNull();
      expect(mockStringToDateParser.parse).toHaveBeenCalled();
    });

    test('test_parse_WHEN_nonSaltoolsErrorWithThrowErrorFalse_THEN_throwsError', () => {
      const error = new Error('Unexpected error');
      mockStringToDateParser.parse.mockImplementation(() => {
        throw error;
      });

      expect(() => parser.parse('test', {
        inputFormat: 'iso',
        outputFormat: 'iso',
        throwError: false,
      })).toThrow('Unexpected error');
      expect(mockDateToStringParser.parse).not.toHaveBeenCalled();
    });
  });

  describe('parse - constructor injection', () => {
    test('test_parse_WHEN_customParsersProvided_THEN_usesCustomParsers', () => {
      const customMockStringParser = {
        parse: jest.fn().mockReturnValue(new Date('2024-03-15T10:30:00Z')),
      };
      const customMockDateParser = {
        parse: jest.fn().mockReturnValue('15/03/2024'),
      };
      const customParser = new DateParser(customMockStringParser, customMockDateParser);

      const result = customParser.parse('15/03/2024', {
        inputFormat: 'dd/mm/yyyy',
        outputFormat: 'dd/mm/yyyy',
      });

      expect(customMockStringParser.parse).toHaveBeenCalledWith('15/03/2024', 'dd/mm/yyyy');
      expect(customMockDateParser.parse).toHaveBeenCalled();
      expect(result).toBe('15/03/2024');
    });

    test('test_parse_WHEN_defaultConstructor_THEN_createsDefaultParsers', () => {
      const defaultParser = new DateParser();
      expect(defaultParser).toBeInstanceOf(DateParser);
    });
  });
});
