import { describe, test, expect } from '@jest/globals';
import path from 'path';
import { fileURLToPath } from 'url';
import CSVParser from 'src/commands/parse/parse-csv/csv-parser.js';

const testDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../files');

describe('CSVParser', () => {
  test('test_parse_WHEN_validCSVFile_THEN_returnsArrayOfObjects', () => {
    const filePath = path.join(testDir, 'test.csv');

    const parser = new CSVParser(filePath, { delimiter: ',', quoteChar: '"', escapeChar: '\\' });
    const result = parser.parse();

    expect(result).toEqual([
      { name: 'John', age: 30, city: 'New York' },
      { name: 'Jane', age: 25, city: 'London' },
    ]);
  });

  test('test_parse_WHEN_emptyCSVFile_THEN_returnsEmptyArray', () => {
    const filePath = path.join(testDir, 'empty.csv');

    const parser = new CSVParser(filePath, { delimiter: ',', quoteChar: '"', escapeChar: '\\' });
    const result = parser.parse();

    expect(result).toEqual([]);
  });

  test('test_parse_WHEN_onlyHeaders_THEN_returnsEmptyArray', () => {
    const filePath = path.join(testDir, 'headers-only.csv');

    const parser = new CSVParser(filePath, { delimiter: ',', quoteChar: '"', escapeChar: '\\' });
    const result = parser.parse();

    expect(result).toEqual([]);
  });

  test('test_parse_WHEN_booleanAndNumericValues_THEN_convertsToTypes', () => {
    const filePath = path.join(testDir, 'types.csv');

    const parser = new CSVParser(filePath, { delimiter: ',', quoteChar: '"', escapeChar: '\\' });
    const result = parser.parse();

    expect(result).toEqual([
      { name: 'John', age: 30, active: true },
      { name: 'Jane', age: 25, active: false },
    ]);
    expect(typeof result[0].age).toBe('number');
    expect(typeof result[0].active).toBe('boolean');
  });

  test('test_parse_WHEN_customDelimiter_THEN_parsesCorrectly', () => {
    const filePath = path.join(testDir, 'custom-delimiter.csv');

    const parser = new CSVParser(filePath, { delimiter: '|', quoteChar: '"', escapeChar: '\\' });
    const result = parser.parse();

    expect(result).toEqual([
      { name: 'John', age: 30, city: 'New York' },
      { name: 'Jane', age: 25, city: 'London' },
    ]);
  });

  test('test_parse_WHEN_quotedFieldsWithNewlines_THEN_preservesNewlines', () => {
    const filePath = path.join(testDir, 'quoted-newline.csv');

    const parser = new CSVParser(filePath, { delimiter: ',', quoteChar: '"', escapeChar: '\\' });
    const result = parser.parse();

    expect(result).toEqual([
      { name: 'John', note: 'First line\nSecond line' },
      { name: 'Jane', note: 'Single note' },
    ]);
  });

  test('test_parse_WHEN_blankLines_THEN_skipsBlankLines', () => {
    const filePath = path.join(testDir, 'blank-lines.csv');

    const parser = new CSVParser(filePath, { delimiter: ',', quoteChar: '"', escapeChar: '\\' });
    const result = parser.parse();

    expect(result).toEqual([
      { name: 'John', age: 30 },
      { name: 'Jane', age: 25 },
      { name: 'Bob', age: 40 },
    ]);
  });

  test('test_parse_WHEN_rowHasMoreColumnsThanHeaders_THEN_ignoresExtraColumns', () => {
    const filePath = path.join(testDir, 'extra-columns.csv');

    const parser = new CSVParser(filePath, { delimiter: ',', quoteChar: '"', escapeChar: '\\' });
    const result = parser.parse();

    expect(result).toEqual([
      { name: 'John', age: 30 },
      { name: 'Jane', age: 25 },
    ]);
  });

  test('test_parse_WHEN_rowHasFewerColumnsThanHeaders_THEN_fillsWithEmptyStrings', () => {
    const filePath = path.join(testDir, 'fewer-columns.csv');

    const parser = new CSVParser(filePath, { delimiter: ',', quoteChar: '"', escapeChar: '\\' });
    const result = parser.parse();

    expect(result).toEqual([
      { name: 'John', age: 30, city: '', country: '' },
      { name: 'Jane', age: 25, city: 'London', country: '' },
    ]);
  });

  test('test_parse_WHEN_duplicateHeaders_THEN_lastHeaderWins', () => {
    const filePath = path.join(testDir, 'duplicate-headers.csv');

    const parser = new CSVParser(filePath, { delimiter: ',', quoteChar: '"', escapeChar: '\\' });
    const result = parser.parse();

    expect(result).toEqual([
      { name: 'Doe', age: 30 },
      { name: 'Smith', age: 25 },
    ]);
  });
});
