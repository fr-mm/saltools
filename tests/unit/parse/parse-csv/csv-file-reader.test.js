import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import fs from 'fs';
import path from 'path';
import CSVFileReader from 'src/commands/parse/parse-csv/csv-file-reader.js';
import SaltoolsError from 'src/errors/saltools-error.js';

describe('CSVFileReader', () => {
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

  test('test_read_WHEN_validCSVFile_THEN_returnsFileContent', () => {
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true });
    }
    const filePath = path.join(testDir, 'test.csv');
    const content = 'name,age\nJohn,30\nJane,25';
    fs.writeFileSync(filePath, content);

    const reader = new CSVFileReader(filePath);
    const result = reader.read();

    expect(result).toBe(content);
  });

  test('test_read_WHEN_fileNotFound_THEN_throwsError', () => {
    const filePath = path.join(testDir, 'nonexistent.csv');
    const reader = new CSVFileReader(filePath);

    expect(() => {
      reader.read();
    }).toThrow(SaltoolsError);

    expect(() => {
      reader.read();
    }).toThrow('não encontrado');
  });

  test('test_read_WHEN_notCSVFile_THEN_throwsError', () => {
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true });
    }
    const filePath = path.join(testDir, 'test.txt');
    fs.writeFileSync(filePath, 'some content');
    const reader = new CSVFileReader(filePath);

    expect(() => {
      reader.read();
    }).toThrow(SaltoolsError);

    expect(() => {
      reader.read();
    }).toThrow('não é um arquivo CSV');
  });

  test('test_read_WHEN_emptyCSVFile_THEN_returnsEmptyString', () => {
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true });
    }
    const filePath = path.join(testDir, 'empty.csv');
    fs.writeFileSync(filePath, '');
    const reader = new CSVFileReader(filePath);

    const result = reader.read();

    expect(result).toBe('');
  });
});

