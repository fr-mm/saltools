import { describe, test, expect, beforeEach, afterEach, jest } from '@jest/globals';
import DateParser from 'src/commands/parse/parse-date/date-parser.js';
import StringToDateParser from 'src/commands/parse/parse-date/string-to-date-parser.js';
import DateToStringParser from 'src/commands/parse/parse-date/date-to-string-parser.js';
import SaltoolsError from 'src/errors/saltools-error.js';
import Config from 'src/commands/config/config.js';

describe('DateParser', () => {
  let stringToDateParserSpy;
  let dateToStringParserSpy;

  beforeEach(() => {
    stringToDateParserSpy = jest.spyOn(StringToDateParser, 'parse');
    dateToStringParserSpy = jest.spyOn(DateToStringParser, 'parse');
    Config.reset();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('parse - successful conversion', () => {
    test('test_parse_WHEN_validConversion_THEN_callsParsersInSequence', () => {
      const inputDate = '2024-03-15T10:30:00Z';
      const inputFormat = 'iso';
      const outputFormat = 'iso';
      const mockDateObject = new Date('2024-03-15T10:30:00Z');
      const mockOutputString = '2024-03-15T10:30:00.000Z';

      stringToDateParserSpy.mockReturnValue(mockDateObject);
      dateToStringParserSpy.mockReturnValue(mockOutputString);

      const result = DateParser.parse(inputDate, {
        inputFormat,
        outputFormat,
      });

      expect(stringToDateParserSpy).toHaveBeenCalledWith(inputDate, inputFormat);
      expect(dateToStringParserSpy).toHaveBeenCalledWith(mockDateObject, outputFormat);
      expect(result).toBe(mockOutputString);
    });

    test('test_parse_WHEN_dateObjectInput_THEN_skipsStringParser', () => {
      const inputDate = new Date('2024-03-15T10:30:00Z');
      const outputFormat = 'dd/mm/yyyy';
      const mockOutputString = '15/03/2024';

      dateToStringParserSpy.mockReturnValue(mockOutputString);

      const result = DateParser.parse(inputDate, {
        outputFormat,
      });

      expect(stringToDateParserSpy).not.toHaveBeenCalled();
      expect(dateToStringParserSpy).toHaveBeenCalledWith(inputDate, outputFormat);
      expect(result).toBe(mockOutputString);
    });

    test('test_parse_WHEN_dateObjectInputWithDefaultFormat_THEN_usesIsoOutput', () => {
      const inputDate = new Date('2024-03-15T10:30:00Z');
      const mockOutputString = '2024-03-15T10:30:00.000Z';

      dateToStringParserSpy.mockReturnValue(mockOutputString);

      const result = DateParser.parse(inputDate);

      expect(stringToDateParserSpy).not.toHaveBeenCalled();
      expect(dateToStringParserSpy).toHaveBeenCalledWith(inputDate, 'iso');
      expect(result).toBe(mockOutputString);
    });

    test('test_parse_WHEN_defaultFormats_THEN_usesIsoForBoth', () => {
      const inputDate = '2024-03-15T10:30:00Z';
      const mockDateObject = new Date('2024-03-15T10:30:00Z');
      const mockOutputString = '2024-03-15T10:30:00.000Z';

      stringToDateParserSpy.mockReturnValue(mockDateObject);
      dateToStringParserSpy.mockReturnValue(mockOutputString);

      const result = DateParser.parse(inputDate);

      expect(stringToDateParserSpy).toHaveBeenCalledWith(inputDate, 'iso');
      expect(dateToStringParserSpy).toHaveBeenCalledWith(mockDateObject, 'iso');
      expect(result).toBe(mockOutputString);
    });

    test('test_parse_WHEN_customFormats_THEN_passesFormatsCorrectly', () => {
      const inputDate = '15/03/2024';
      const inputFormat = 'dd/mm/yyyy';
      const outputFormat = 'mm/dd/yyyy';
      const mockDateObject = new Date(2024, 2, 15);
      const mockOutputString = '03/15/2024';

      stringToDateParserSpy.mockReturnValue(mockDateObject);
      dateToStringParserSpy.mockReturnValue(mockOutputString);

      const result = DateParser.parse(inputDate, {
        inputFormat,
        outputFormat,
      });

      expect(stringToDateParserSpy).toHaveBeenCalledWith(inputDate, inputFormat);
      expect(dateToStringParserSpy).toHaveBeenCalledWith(mockDateObject, outputFormat);
      expect(result).toBe(mockOutputString);
    });

    test('test_parse_WHEN_customInputFormatOnly_THEN_usesDefaultOutputFormat', () => {
      const inputDate = '15/03/2024';
      const inputFormat = 'dd/mm/yyyy';
      const mockDateObject = new Date(2024, 2, 15);
      const mockOutputString = '2024-03-15T00:00:00.000Z';

      stringToDateParserSpy.mockReturnValue(mockDateObject);
      dateToStringParserSpy.mockReturnValue(mockOutputString);

      const result = DateParser.parse(inputDate, {
        inputFormat,
      });

      expect(stringToDateParserSpy).toHaveBeenCalledWith(inputDate, inputFormat);
      expect(dateToStringParserSpy).toHaveBeenCalledWith(mockDateObject, 'iso');
      expect(result).toBe(mockOutputString);
    });

    test('test_parse_WHEN_customOutputFormatOnly_THEN_usesDefaultInputFormat', () => {
      const inputDate = '2024-03-15T10:30:00Z';
      const outputFormat = 'dd/mm/yyyy';
      const mockDateObject = new Date('2024-03-15T10:30:00Z');
      const mockOutputString = '15/03/2024';

      stringToDateParserSpy.mockReturnValue(mockDateObject);
      dateToStringParserSpy.mockReturnValue(mockOutputString);

      const result = DateParser.parse(inputDate, {
        outputFormat,
      });

      expect(stringToDateParserSpy).toHaveBeenCalledWith(inputDate, 'iso');
      expect(dateToStringParserSpy).toHaveBeenCalledWith(mockDateObject, outputFormat);
      expect(result).toBe(mockOutputString);
    });
  });

  describe('parse - error handling with throwError true', () => {
    test('test_parse_WHEN_invalidDateObject_THEN_throwsError', () => {
      const invalidDate = new Date('invalid-date');
      expect(() =>
        DateParser.parse(invalidDate, {
          outputFormat: 'iso',
          throwError: true,
        })
      ).toThrow(SaltoolsError);
      expect(stringToDateParserSpy).not.toHaveBeenCalled();
      expect(dateToStringParserSpy).not.toHaveBeenCalled();
    });

    test('test_parse_WHEN_stringParserThrowsSaltoolsErrorWithThrowErrorTrue_THEN_throwsError', () => {
      const error = new SaltoolsError('Invalid date');
      stringToDateParserSpy.mockImplementation(() => {
        throw error;
      });

      expect(() =>
        DateParser.parse('invalid-date', {
          inputFormat: 'iso',
          outputFormat: 'iso',
          throwError: true,
        })
      ).toThrow(SaltoolsError);
      expect(dateToStringParserSpy).not.toHaveBeenCalled();
    });

    test('test_parse_WHEN_stringParserThrowsSaltoolsErrorWithThrowErrorDefault_THEN_throwsError', () => {
      const error = new SaltoolsError('Invalid date');
      stringToDateParserSpy.mockImplementation(() => {
        throw error;
      });

      expect(() =>
        DateParser.parse('invalid-date', {
          inputFormat: 'iso',
          outputFormat: 'iso',
        })
      ).toThrow(SaltoolsError);
      expect(dateToStringParserSpy).not.toHaveBeenCalled();
    });

    test('test_parse_WHEN_dateToStringParserThrowsSaltoolsErrorWithThrowErrorTrue_THEN_throwsError', () => {
      const mockDateObject = new Date('2024-03-15T10:30:00Z');
      const error = new SaltoolsError('Invalid format');
      stringToDateParserSpy.mockReturnValue(mockDateObject);
      dateToStringParserSpy.mockImplementation(() => {
        throw error;
      });

      expect(() =>
        DateParser.parse('2024-03-15T10:30:00Z', {
          inputFormat: 'iso',
          outputFormat: 'invalid-format',
          throwError: true,
        })
      ).toThrow(SaltoolsError);
      expect(stringToDateParserSpy).toHaveBeenCalled();
    });

    test('test_parse_WHEN_nonSaltoolsErrorWithThrowErrorTrue_THEN_throwsError', () => {
      const error = new Error('Unexpected error');
      stringToDateParserSpy.mockImplementation(() => {
        throw error;
      });

      expect(() =>
        DateParser.parse('test', {
          inputFormat: 'iso',
          outputFormat: 'iso',
          throwError: true,
        })
      ).toThrow('Unexpected error');
      expect(dateToStringParserSpy).not.toHaveBeenCalled();
    });
  });

  describe('parse - error handling with throwError false', () => {
    test('test_parse_WHEN_invalidDateObjectWithThrowErrorFalse_THEN_returnsNull', () => {
      const invalidDate = new Date('invalid-date');
      const result = DateParser.parse(invalidDate, {
        outputFormat: 'iso',
        throwError: false,
      });

      expect(result).toBeNull();
      expect(stringToDateParserSpy).not.toHaveBeenCalled();
      expect(dateToStringParserSpy).not.toHaveBeenCalled();
    });

    test('test_parse_WHEN_stringParserThrowsSaltoolsErrorWithThrowErrorFalse_THEN_returnsNull', () => {
      const error = new SaltoolsError('Invalid date');
      stringToDateParserSpy.mockImplementation(() => {
        throw error;
      });

      const result = DateParser.parse('invalid-date', {
        inputFormat: 'iso',
        outputFormat: 'iso',
        throwError: false,
      });

      expect(result).toBeNull();
      expect(dateToStringParserSpy).not.toHaveBeenCalled();
    });

    test('test_parse_WHEN_dateToStringParserThrowsSaltoolsErrorWithThrowErrorFalse_THEN_returnsNull', () => {
      const mockDateObject = new Date('2024-03-15T10:30:00Z');
      const error = new SaltoolsError('Invalid format');
      stringToDateParserSpy.mockReturnValue(mockDateObject);
      dateToStringParserSpy.mockImplementation(() => {
        throw error;
      });

      const result = DateParser.parse('2024-03-15T10:30:00Z', {
        inputFormat: 'iso',
        outputFormat: 'invalid-format',
        throwError: false,
      });

      expect(result).toBeNull();
      expect(stringToDateParserSpy).toHaveBeenCalled();
    });

    test('test_parse_WHEN_nonSaltoolsErrorWithThrowErrorFalse_THEN_throwsError', () => {
      const error = new Error('Unexpected error');
      stringToDateParserSpy.mockImplementation(() => {
        throw error;
      });

      expect(() =>
        DateParser.parse('test', {
          inputFormat: 'iso',
          outputFormat: 'iso',
          throwError: false,
        })
      ).toThrow('Unexpected error');
      expect(dateToStringParserSpy).not.toHaveBeenCalled();
    });
  });

  describe('parse - config integration', () => {
    test('test_parse_WHEN_inputFormatSetInConfig_THEN_usesConfigValue', () => {
      Config.date.inputFormat('dd/mm/yyyy');
      const inputDate = '15/03/2024';
      const mockDateObject = new Date(2024, 2, 15);
      const mockOutputString = '2024-03-15T00:00:00.000Z';

      stringToDateParserSpy.mockReturnValue(mockDateObject);
      dateToStringParserSpy.mockReturnValue(mockOutputString);

      const result = DateParser.parse(inputDate);

      expect(stringToDateParserSpy).toHaveBeenCalledWith(inputDate, 'dd/mm/yyyy');
      expect(dateToStringParserSpy).toHaveBeenCalledWith(mockDateObject, 'iso');
      expect(result).toBe(mockOutputString);
    });

    test('test_parse_WHEN_outputFormatSetInConfig_THEN_usesConfigValue', () => {
      Config.date.outputFormat('dd/mm/yyyy');
      const inputDate = '2024-03-15T10:30:00Z';
      const mockDateObject = new Date('2024-03-15T10:30:00Z');
      const mockOutputString = '15/03/2024';

      stringToDateParserSpy.mockReturnValue(mockDateObject);
      dateToStringParserSpy.mockReturnValue(mockOutputString);

      const result = DateParser.parse(inputDate);

      expect(stringToDateParserSpy).toHaveBeenCalledWith(inputDate, 'iso');
      expect(dateToStringParserSpy).toHaveBeenCalledWith(mockDateObject, 'dd/mm/yyyy');
      expect(result).toBe(mockOutputString);
    });

    test('test_parse_WHEN_bothFormatsSetInConfig_THEN_usesConfigValues', () => {
      Config.date.inputFormat('dd/mm/yyyy');
      Config.date.outputFormat('mm/dd/yyyy');
      const inputDate = '15/03/2024';
      const mockDateObject = new Date(2024, 2, 15);
      const mockOutputString = '03/15/2024';

      stringToDateParserSpy.mockReturnValue(mockDateObject);
      dateToStringParserSpy.mockReturnValue(mockOutputString);

      const result = DateParser.parse(inputDate);

      expect(stringToDateParserSpy).toHaveBeenCalledWith(inputDate, 'dd/mm/yyyy');
      expect(dateToStringParserSpy).toHaveBeenCalledWith(mockDateObject, 'mm/dd/yyyy');
      expect(result).toBe(mockOutputString);
    });

    test('test_parse_WHEN_configSetAndOptionProvided_THEN_optionOverridesConfig', () => {
      Config.date.inputFormat('dd/mm/yyyy');
      Config.date.outputFormat('mm/dd/yyyy');
      const inputDate = '2024-03-15T10:30:00Z';
      const mockDateObject = new Date('2024-03-15T10:30:00Z');
      const mockOutputString = '15/03/2024';

      stringToDateParserSpy.mockReturnValue(mockDateObject);
      dateToStringParserSpy.mockReturnValue(mockOutputString);

      const result = DateParser.parse(inputDate, {
        inputFormat: 'iso',
        outputFormat: 'dd/mm/yyyy',
      });

      expect(stringToDateParserSpy).toHaveBeenCalledWith(inputDate, 'iso');
      expect(dateToStringParserSpy).toHaveBeenCalledWith(mockDateObject, 'dd/mm/yyyy');
      expect(result).toBe(mockOutputString);
    });

    test('test_parse_WHEN_configSetAndPartialOptionProvided_THEN_mergesConfigAndOption', () => {
      Config.date.inputFormat('dd/mm/yyyy');
      Config.date.outputFormat('mm/dd/yyyy');
      const inputDate = '15/03/2024';
      const mockDateObject = new Date(2024, 2, 15);
      const mockOutputString = '15/03/2024';

      stringToDateParserSpy.mockReturnValue(mockDateObject);
      dateToStringParserSpy.mockReturnValue(mockOutputString);

      const result = DateParser.parse(inputDate, {
        outputFormat: 'dd/mm/yyyy',
      });

      expect(stringToDateParserSpy).toHaveBeenCalledWith(inputDate, 'dd/mm/yyyy');
      expect(dateToStringParserSpy).toHaveBeenCalledWith(mockDateObject, 'dd/mm/yyyy');
      expect(result).toBe(mockOutputString);
    });

    test('test_parse_WHEN_throwErrorSetInConfig_THEN_usesConfigValue', () => {
      Config.throwError(false);
      Config.date.inputFormat('dd/mm/yyyy');
      const error = new SaltoolsError('Invalid date');
      stringToDateParserSpy.mockImplementation(() => {
        throw error;
      });

      const result = DateParser.parse('invalid-date');

      expect(result).toBeNull();
      expect(dateToStringParserSpy).not.toHaveBeenCalled();
    });

    test('test_parse_WHEN_configReset_THEN_usesDefaultValues', () => {
      Config.date.inputFormat('dd/mm/yyyy');
      Config.date.outputFormat('mm/dd/yyyy');
      Config.date.reset();
      const inputDate = '2024-03-15T10:30:00Z';
      const mockDateObject = new Date('2024-03-15T10:30:00Z');
      const mockOutputString = '2024-03-15T10:30:00.000Z';

      stringToDateParserSpy.mockReturnValue(mockDateObject);
      dateToStringParserSpy.mockReturnValue(mockOutputString);

      const result = DateParser.parse(inputDate);

      expect(stringToDateParserSpy).toHaveBeenCalledWith(inputDate, 'iso');
      expect(dateToStringParserSpy).toHaveBeenCalledWith(mockDateObject, 'iso');
      expect(result).toBe(mockOutputString);
    });
  });
});
