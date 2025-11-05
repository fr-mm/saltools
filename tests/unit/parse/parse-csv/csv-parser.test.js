import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import fs from 'fs';
import path from 'path';
import CSVParser from 'src/commands/parse/parse-csv/csv-parser.js';

describe('CSVParser', () => {
  const testDir = path.join(process.cwd(), 'tests', 'temp');

  beforeEach(() => {
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true });
    }
  });

  afterEach(() => {
    try {
      if (fs.existsSync(testDir)) {
        const files = fs.readdirSync(testDir);
        for (const file of files) {
          fs.unlinkSync(path.join(testDir, file));
        }
      }
    } catch (_) {
      /* ignore cleanup errors */
    }
  });

  test('test_parse_WHEN_validCSVFile_THEN_returnsArrayOfObjects', () => {
    const filePath = path.join(testDir, 'test.csv');
    const csvContent = 'name,age,city\nJohn,30,New York\nJane,25,London';
    fs.writeFileSync(filePath, csvContent);

    const parser = new CSVParser(filePath, { delimiter: ',', quoteChar: '"', escapeChar: '\\' });
    const result = parser.parse();

    expect(result).toEqual([
      { name: 'John', age: 30, city: 'New York' },
      { name: 'Jane', age: 25, city: 'London' },
    ]);
  });

  test('test_parse_WHEN_emptyCSVFile_THEN_returnsEmptyArray', () => {
    const filePath = path.join(testDir, 'empty.csv');
    fs.writeFileSync(filePath, '');

    const parser = new CSVParser(filePath, { delimiter: ',', quoteChar: '"', escapeChar: '\\' });
    const result = parser.parse();

    expect(result).toEqual([]);
  });

  test('test_parse_WHEN_onlyHeaders_THEN_returnsEmptyArray', () => {
    const filePath = path.join(testDir, 'headers-only.csv');
    fs.writeFileSync(filePath, 'name,age,city');

    const parser = new CSVParser(filePath, { delimiter: ',', quoteChar: '"', escapeChar: '\\' });
    const result = parser.parse();

    expect(result).toEqual([]);
  });

  test('test_parse_WHEN_booleanAndNumericValues_THEN_convertsToTypes', () => {
    const filePath = path.join(testDir, 'types.csv');
    const csvContent = 'name,age,active\nJohn,30,true\nJane,25,false';
    fs.writeFileSync(filePath, csvContent);

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
    const csvContent = 'name|age|city\nJohn|30|New York\nJane|25|London';
    fs.writeFileSync(filePath, csvContent);

    const parser = new CSVParser(filePath, { delimiter: '|', quoteChar: '"', escapeChar: '\\' });
    const result = parser.parse();

    expect(result).toEqual([
      { name: 'John', age: 30, city: 'New York' },
      { name: 'Jane', age: 25, city: 'London' },
    ]);
  });

  test('test_parse_WHEN_quotedFieldsWithNewlines_THEN_preservesNewlines', () => {
    const filePath = path.join(testDir, 'quoted-newline.csv');
    const csvContent = 'name,note\nJohn,"First line\nSecond line"\nJane,"Single note"';
    fs.writeFileSync(filePath, csvContent);

    const parser = new CSVParser(filePath, { delimiter: ',', quoteChar: '"', escapeChar: '\\' });
    const result = parser.parse();

    expect(result).toEqual([
      { name: 'John', note: 'First line\nSecond line' },
      { name: 'Jane', note: 'Single note' },
    ]);
  });

  test('test_parse_WHEN_blankLines_THEN_skipsBlankLines', () => {
    const filePath = path.join(testDir, 'blank-lines.csv');
    const csvContent = 'name,age\nJohn,30\n\nJane,25\n  \nBob,40';
    fs.writeFileSync(filePath, csvContent);

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
    const csvContent = 'name,age\nJohn,30,extra1,extra2\nJane,25';
    fs.writeFileSync(filePath, csvContent);

    const parser = new CSVParser(filePath, { delimiter: ',', quoteChar: '"', escapeChar: '\\' });
    const result = parser.parse();

    expect(result).toEqual([
      { name: 'John', age: 30 },
      { name: 'Jane', age: 25 },
    ]);
  });

  test('test_parse_WHEN_rowHasFewerColumnsThanHeaders_THEN_fillsWithEmptyStrings', () => {
    const filePath = path.join(testDir, 'fewer-columns.csv');
    const csvContent = 'name,age,city,country\nJohn,30\nJane,25,London';
    fs.writeFileSync(filePath, csvContent);

    const parser = new CSVParser(filePath, { delimiter: ',', quoteChar: '"', escapeChar: '\\' });
    const result = parser.parse();

    expect(result).toEqual([
      { name: 'John', age: 30, city: '', country: '' },
      { name: 'Jane', age: 25, city: 'London', country: '' },
    ]);
  });

  test('test_parse_WHEN_duplicateHeaders_THEN_lastHeaderWins', () => {
    const filePath = path.join(testDir, 'duplicate-headers.csv');
    const csvContent = 'name,name,age\nJohn,Doe,30\nJane,Smith,25';
    fs.writeFileSync(filePath, csvContent);

    const parser = new CSVParser(filePath, { delimiter: ',', quoteChar: '"', escapeChar: '\\' });
    const result = parser.parse();

    expect(result).toEqual([
      { name: 'Doe', age: 30 },
      { name: 'Smith', age: 25 },
    ]);
  });
});
