import { describe, test, expect } from '@jest/globals';
import BoolParser from 'src/commands/parse/bool-parser.js';
import SaltoolsError from 'src/errors/saltools-error.js';

describe('BoolParser', () => {
  describe('parse - string values', () => {
    test('test_parse_WHEN_exactTrue_THEN_returnsTrue', () => {
      const result = BoolParser.parse('true');
      expect(result).toBe(true);
    });

    test('test_parse_WHEN_exactTRUE_THEN_returnsTrue', () => {
      const result = BoolParser.parse('TRUE');
      expect(result).toBe(true);
    });

    test('test_parse_WHEN_exactOne_THEN_returnsTrue', () => {
      const result = BoolParser.parse('1');
      expect(result).toBe(true);
    });

    test('test_parse_WHEN_exactFalse_THEN_returnsFalse', () => {
      const result = BoolParser.parse('false');
      expect(result).toBe(false);
    });

    test('test_parse_WHEN_exactFALSE_THEN_returnsFalse', () => {
      const result = BoolParser.parse('FALSE');
      expect(result).toBe(false);
    });

    test('test_parse_WHEN_exactZero_THEN_returnsFalse', () => {
      const result = BoolParser.parse('0');
      expect(result).toBe(false);
    });

    test('test_parse_WHEN_mixedCaseTrue_THEN_returnsTrue', () => {
      const result = BoolParser.parse('True');
      expect(result).toBe(true);
    });

    test('test_parse_WHEN_mixedCaseFalse_THEN_returnsFalse', () => {
      const result = BoolParser.parse('False');
      expect(result).toBe(false);
    });

    test('test_parse_WHEN_trimmedTrue_THEN_returnsTrue', () => {
      const result = BoolParser.parse(' true ');
      expect(result).toBe(true);
    });

    test('test_parse_WHEN_trimmedFalse_THEN_returnsFalse', () => {
      const result = BoolParser.parse(' false ');
      expect(result).toBe(false);
    });

    test('test_parse_WHEN_trimmedOne_THEN_returnsTrue', () => {
      const result = BoolParser.parse(' 1 ');
      expect(result).toBe(true);
    });

    test('test_parse_WHEN_trimmedZero_THEN_returnsFalse', () => {
      const result = BoolParser.parse(' 0 ');
      expect(result).toBe(false);
    });

    test('test_parse_WHEN_tabTrimmedTrue_THEN_returnsTrue', () => {
      const result = BoolParser.parse('\ttrue\t');
      expect(result).toBe(true);
    });

    test('test_parse_WHEN_newlineTrimmedTrue_THEN_returnsTrue', () => {
      const result = BoolParser.parse('\ntrue\n');
      expect(result).toBe(true);
    });
  });

  describe('parse - number values', () => {
    test('test_parse_WHEN_numberOne_THEN_returnsTrue', () => {
      const result = BoolParser.parse(1);
      expect(result).toBe(true);
    });

    test('test_parse_WHEN_numberZero_THEN_returnsFalse', () => {
      const result = BoolParser.parse(0);
      expect(result).toBe(false);
    });
  });

  describe('parse - boolean values', () => {
    test('test_parse_WHEN_booleanTrue_THEN_returnsTrue', () => {
      const result = BoolParser.parse(true);
      expect(result).toBe(true);
    });

    test('test_parse_WHEN_booleanFalse_THEN_returnsFalse', () => {
      const result = BoolParser.parse(false);
      expect(result).toBe(false);
    });
  });

  describe('parse - invalid values', () => {
    test('test_parse_WHEN_invalidString_THEN_throwsError', () => {
      expect(() => {
        BoolParser.parse('invalid');
      }).toThrow(SaltoolsError);
    });

    test('test_parse_WHEN_longString_THEN_throwsError', () => {
      expect(() => {
        BoolParser.parse('this is a very long string');
      }).toThrow(SaltoolsError);
    });

    test('test_parse_WHEN_stringLengthEight_THEN_throwsError', () => {
      expect(() => {
        BoolParser.parse('12345678');
      }).toThrow(SaltoolsError);
    });

    test('test_parse_WHEN_invalidNumber_THEN_throwsError', () => {
      expect(() => {
        BoolParser.parse(42);
      }).toThrow(SaltoolsError);
    });

    test('test_parse_WHEN_null_THEN_throwsError', () => {
      expect(() => {
        BoolParser.parse(null);
      }).toThrow(SaltoolsError);
    });

    test('test_parse_WHEN_object_THEN_throwsError', () => {
      expect(() => {
        BoolParser.parse({});
      }).toThrow(SaltoolsError);
    });

    test('test_parse_WHEN_array_THEN_throwsError', () => {
      expect(() => {
        BoolParser.parse([]);
      }).toThrow(SaltoolsError);
    });
  });

  describe('parse - throwError option', () => {
    test('test_parse_WHEN_invalidStringWithThrowErrorFalse_THEN_returnsUndefined', () => {
      const result = BoolParser.parse('invalid', { throwError: false });
      expect(result).toBeUndefined();
    });

    test('test_parse_WHEN_invalidNumberWithThrowErrorFalse_THEN_returnsUndefined', () => {
      const result = BoolParser.parse(42, { throwError: false });
      expect(result).toBeUndefined();
    });

    test('test_parse_WHEN_longStringWithThrowErrorFalse_THEN_returnsUndefined', () => {
      const result = BoolParser.parse('very long string', { throwError: false });
      expect(result).toBeUndefined();
    });

    test('test_parse_WHEN_validValueWithThrowErrorFalse_THEN_returnsValue', () => {
      const result = BoolParser.parse('true', { throwError: false });
      expect(result).toBe(true);
    });
  });

  describe('parse - edge cases', () => {
    test('test_parse_WHEN_emptyString_THEN_throwsError', () => {
      expect(() => {
        BoolParser.parse('');
      }).toThrow(SaltoolsError);
    });

    test('test_parse_WHEN_whitespaceOnly_THEN_throwsError', () => {
      expect(() => {
        BoolParser.parse('   ');
      }).toThrow(SaltoolsError);
    });

    test('test_parse_WHEN_stringLengthSeven_THEN_processesNormally', () => {
      const result = BoolParser.parse(' false ');
      expect(result).toBe(false);
    });

    test('test_parse_WHEN_stringLengthSevenInvalid_THEN_throwsError', () => {
      expect(() => {
        BoolParser.parse('invalid');
      }).toThrow(SaltoolsError);
    });
  });
});

