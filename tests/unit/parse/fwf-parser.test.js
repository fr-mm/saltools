import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import fs from 'fs';
import path from 'path';
import FwfParser from 'src/commands/parse/fwf-parser.js';
import SaltoolsError from 'src/errors/saltools-error.js';

describe('FwfParser', () => {
  const testDir = path.join(process.cwd(), 'tests', 'temp');

  beforeEach(() => {
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true });
    }
  });

  afterEach(() => {
    try {
      if (fs.existsSync(testDir)) {
        fs.rmSync(testDir, { recursive: true, force: true });
      }
    } catch (_) {
      /* ignore cleanup errors */
    }
  });

  describe('parse', () => {
    test('test_parse_WHEN_validFileWithFields_THEN_returnsParsedData', () => {
      const filePath = path.join(testDir, 'test.txt');
      const content = 'John Doe  30New York\nJane Smith25London  ';
      fs.writeFileSync(filePath, content);

      const fields = [
        { key: 'name', start: 0, end: 9 },
        { key: 'age', start: 10, end: 11 },
        { key: 'city', start: 12, end: 19 },
      ];

      const result = FwfParser.parse(filePath, fields);

      expect(result).toEqual([
        { name: 'John Doe', age: '30', city: 'New York' },
        { name: 'Jane Smith', age: '25', city: 'London' },
      ]);
    });

    test('test_parse_WHEN_emptyFile_THEN_returnsEmptyArray', () => {
      const filePath = path.join(testDir, 'empty.txt');
      fs.writeFileSync(filePath, '');

      const fields = [{ key: 'name', start: 0, end: 10 }];

      const result = FwfParser.parse(filePath, fields);

      expect(result).toEqual([]);
    });

    test('test_parse_WHEN_fileWithOnlyNewline_THEN_returnsEmptyArray', () => {
      const filePath = path.join(testDir, 'newline.txt');
      fs.writeFileSync(filePath, '\n');

      const fields = [{ key: 'name', start: 0, end: 10 }];

      const result = FwfParser.parse(filePath, fields);

      expect(result).toEqual([]);
    });

    test('test_parse_WHEN_fileWithWindowsLineEndings_THEN_parsesCorrectly', () => {
      const filePath = path.join(testDir, 'windows.txt');
      fs.writeFileSync(filePath, 'John Doe  30\r\nJane Smith25');

      const fields = [
        { key: 'name', start: 0, end: 9 },
        { key: 'age', start: 10, end: 11 },
      ];

      const result = FwfParser.parse(filePath, fields);

      expect(result).toEqual([
        { name: 'John Doe', age: '30' },
        { name: 'Jane Smith', age: '25' },
      ]);
    });

    test('test_parse_WHEN_fileWithUnixLineEndings_THEN_parsesCorrectly', () => {
      const filePath = path.join(testDir, 'unix.txt');
      fs.writeFileSync(filePath, 'John Doe  30\nJane Smith25');

      const fields = [
        { key: 'name', start: 0, end: 9 },
        { key: 'age', start: 10, end: 11 },
      ];

      const result = FwfParser.parse(filePath, fields);

      expect(result).toEqual([
        { name: 'John Doe', age: '30' },
        { name: 'Jane Smith', age: '25' },
      ]);
    });

    test('test_parse_WHEN_fileWithOverlappingFields_THEN_parsesCorrectly', () => {
      const filePath = path.join(testDir, 'overlap.txt');
      fs.writeFileSync(filePath, 'John Doe  30   ');

      const fields = [
        { key: 'name', start: 0, end: 9 },
        { key: 'full', start: 0, end: 14 },
      ];

      const result = FwfParser.parse(filePath, fields);

      expect(result).toEqual([{ name: 'John Doe', full: 'John Doe  30' }]);
    });

    test('test_parse_WHEN_fileWithShortLines_THEN_usesLineLength', () => {
      const filePath = path.join(testDir, 'short.txt');
      fs.writeFileSync(filePath, 'John\nJane');

      const fields = [
        { key: 'name', start: 0, end: 10 },
        { key: 'age', start: 10, end: 12 },
      ];

      const result = FwfParser.parse(filePath, fields);

      expect(result).toEqual([
        { name: 'John', age: '' },
        { name: 'Jane', age: '' },
      ]);
    });

    test('test_parse_WHEN_fileWithMultipleEmptyLines_THEN_returnsEmptyArray', () => {
      const filePath = path.join(testDir, 'empty-lines.txt');
      fs.writeFileSync(filePath, '\n\n\n');

      const fields = [{ key: 'name', start: 0, end: 10 }];

      const result = FwfParser.parse(filePath, fields);

      expect(result).toEqual([]);
    });
  });

  describe('field validation', () => {
    test('test_parse_WHEN_fieldsIsNotArray_THEN_throwsError', () => {
      const filePath = path.join(testDir, 'test.txt');
      fs.writeFileSync(filePath, 'content');

      expect(() => {
        FwfParser.parse(filePath, null);
      }).toThrow(SaltoolsError);

      expect(() => {
        FwfParser.parse(filePath, null);
      }).toThrow('Fields must be an array');
    });

    test('test_parse_WHEN_fieldIsNull_THEN_throwsError', () => {
      const filePath = path.join(testDir, 'test.txt');
      fs.writeFileSync(filePath, 'content');

      expect(() => {
        FwfParser.parse(filePath, [null]);
      }).toThrow(SaltoolsError);
    });

    test('test_parse_WHEN_fieldIsNotObject_THEN_throwsError', () => {
      const filePath = path.join(testDir, 'test.txt');
      fs.writeFileSync(filePath, 'content');

      expect(() => {
        FwfParser.parse(filePath, ['string']);
      }).toThrow(SaltoolsError);
    });

    test('test_parse_WHEN_fieldMissingKey_THEN_throwsError', () => {
      const filePath = path.join(testDir, 'test.txt');
      fs.writeFileSync(filePath, 'content');

      expect(() => {
        FwfParser.parse(filePath, [{ start: 0, end: 10 }]);
      }).toThrow(SaltoolsError);
    });

    test('test_parse_WHEN_fieldMissingStart_THEN_throwsError', () => {
      const filePath = path.join(testDir, 'test.txt');
      fs.writeFileSync(filePath, 'content');

      expect(() => {
        FwfParser.parse(filePath, [{ key: 'name', end: 10 }]);
      }).toThrow(SaltoolsError);
    });

    test('test_parse_WHEN_fieldMissingEnd_THEN_throwsError', () => {
      const filePath = path.join(testDir, 'test.txt');
      fs.writeFileSync(filePath, 'content');

      expect(() => {
        FwfParser.parse(filePath, [{ key: 'name', start: 0 }]);
      }).toThrow(SaltoolsError);
    });

    test('test_parse_WHEN_fieldHasInheritedProperties_THEN_throwsError', () => {
      const filePath = path.join(testDir, 'test.txt');
      fs.writeFileSync(filePath, 'content');

      const field = Object.create({ key: 'inherited', start: 0, end: 10 });

      expect(() => {
        FwfParser.parse(filePath, [field]);
      }).toThrow(SaltoolsError);
    });

    test('test_parse_WHEN_allFieldsValid_THEN_doesNotThrow', () => {
      const filePath = path.join(testDir, 'test.txt');
      fs.writeFileSync(filePath, 'John Doe  30');

      const fields = [
        { key: 'name', start: 0, end: 9 },
        { key: 'age', start: 10, end: 11 },
      ];

      expect(() => {
        FwfParser.parse(filePath, fields);
      }).not.toThrow();
    });
  });

  describe('file reading errors', () => {
    test('test_parse_WHEN_fileNotFound_THEN_throwsError', () => {
      const filePath = path.join(testDir, 'nonexistent.txt');
      const fields = [{ key: 'name', start: 0, end: 10 }];

      expect(() => {
        FwfParser.parse(filePath, fields);
      }).toThrow(SaltoolsError);

      expect(() => {
        FwfParser.parse(filePath, fields);
      }).toThrow('Error reading file');
    });

    test('test_parse_WHEN_filePathIsInvalid_THEN_throwsError', () => {
      const filePath = '/invalid/path/to/file.txt';
      const fields = [{ key: 'name', start: 0, end: 10 }];

      expect(() => {
        FwfParser.parse(filePath, fields);
      }).toThrow(SaltoolsError);
    });
  });

  describe('edge cases', () => {
    test('test_parse_WHEN_fieldsWithZeroLength_THEN_throwsError', () => {
      const filePath = path.join(testDir, 'test.txt');
      fs.writeFileSync(filePath, 'John Doe');

      const fields = [
        { key: 'name', start: 0, end: 0 },
        { key: 'empty', start: 5, end: 5 },
      ];

      expect(() => {
        FwfParser.parse(filePath, fields);
      }).toThrow(SaltoolsError);

      expect(() => {
        FwfParser.parse(filePath, fields);
      }).toThrow("Field 'name' must have end > start");
    });

    test('test_parse_WHEN_fieldsWithStartGreaterThanEnd_THEN_throwsError', () => {
      const filePath = path.join(testDir, 'test.txt');
      fs.writeFileSync(filePath, 'John Doe');

      const fields = [{ key: 'name', start: 10, end: 5 }];

      expect(() => {
        FwfParser.parse(filePath, fields);
      }).toThrow(SaltoolsError);

      expect(() => {
        FwfParser.parse(filePath, fields);
      }).toThrow("Field 'name' must have end > start");
    });

    test('test_parse_WHEN_lineShorterThanFieldEnd_THEN_usesLineLength', () => {
      const filePath = path.join(testDir, 'test.txt');
      fs.writeFileSync(filePath, 'John');

      const fields = [{ key: 'name', start: 0, end: 20 }];

      const result = FwfParser.parse(filePath, fields);

      expect(result).toEqual([{ name: 'John' }]);
    });

    test('test_parse_WHEN_emptyFieldsArray_THEN_throwsError', () => {
      const filePath = path.join(testDir, 'test.txt');
      fs.writeFileSync(filePath, 'John Doe\nJane Smith');

      expect(() => {
        FwfParser.parse(filePath, []);
      }).toThrow(SaltoolsError);

      expect(() => {
        FwfParser.parse(filePath, []);
      }).toThrow('Fields array cannot be empty');
    });

    test('test_parse_WHEN_fileWithTrailingNewline_THEN_parsesCorrectly', () => {
      const filePath = path.join(testDir, 'test.txt');
      fs.writeFileSync(filePath, 'John Doe  30\n');

      const fields = [
        { key: 'name', start: 0, end: 9 },
        { key: 'age', start: 10, end: 11 },
      ];

      const result = FwfParser.parse(filePath, fields);

      expect(result).toEqual([{ name: 'John Doe', age: '30' }]);
    });

    test('test_parse_WHEN_numberType_THEN_castsToNumber', () => {
      const filePath = path.join(testDir, 'numbers.txt');
      fs.writeFileSync(filePath, 'John Doe  30\n');

      const fields = [
        { key: 'name', start: 0, end: 9 },
        { key: 'age', start: 10, end: 11, type: 'number' },
      ];

      const result = FwfParser.parse(filePath, fields);

      expect(result).toEqual([{ name: 'John Doe', age: 30 }]);
    });

    test('test_parse_WHEN_boolType_THEN_castsToBoolean', () => {
      const filePath = path.join(testDir, 'bools.txt');
      fs.writeFileSync(filePath, 'John Doe  1 \nJane Smith0 ');

      const fields = [
        { key: 'name', start: 0, end: 9 },
        { key: 'active', start: 10, end: 12, type: 'bool' },
      ];

      const result = FwfParser.parse(filePath, fields);

      expect(result).toEqual([
        { name: 'John Doe', active: true },
        { name: 'Jane Smith', active: false },
      ]);
    });

    test('test_parse_WHEN_boolTypeInvalid_THEN_throwsSaltoolsError', () => {
      const filePath = path.join(testDir, 'invalid-bool.txt');
      fs.writeFileSync(filePath, 'John Doe  xx');

      const fields = [
        { key: 'name', start: 0, end: 9 },
        { key: 'active', start: 12, end: 13, type: 'bool' },
      ];

      expect(() => {
        FwfParser.parse(filePath, fields);
      }).toThrow(SaltoolsError);
    });

    test('test_parse_WHEN_endIndexIsInclusive_THEN_includesCharacterAtEndIndex', () => {
      const filePath = path.join(testDir, 'inclusive-end.txt');
      fs.writeFileSync(filePath, 'abcd');

      const fields = [{ key: 'value', start: 2, end: 3 }];

      const result = FwfParser.parse(filePath, fields);

      expect(result).toEqual([{ value: 'cd' }]);
    });
  });
});
