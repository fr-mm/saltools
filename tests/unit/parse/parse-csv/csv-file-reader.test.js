import { describe, test, expect } from '@jest/globals';
import path from 'path';
import { fileURLToPath } from 'url';
import CSVFileReader from 'src/commands/parse/parse-csv/csv-file-reader.js';
import SaltoolsError from 'src/errors/saltools-error.js';

const testDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../files');

describe('CSVFileReader', () => {
  test('test_read_WHEN_validCSVFile_THEN_returnsFileContent', () => {
    const filePath = path.join(testDir, 'test-reader.csv');
    const reader = new CSVFileReader(filePath);
    const result = reader.read();

    expect(result).toBe('name,age\nJohn,30\nJane,25\n');
  });

  test('test_read_WHEN_fileNotFound_THEN_throwsError', () => {
    const filePath = path.join(testDir, 'nonexistent-file-that-does-not-exist.csv');
    const reader = new CSVFileReader(filePath);

    expect(() => {
      reader.read();
    }).toThrow(SaltoolsError);

    expect(() => {
      reader.read();
    }).toThrow('não encontrado');
  });

  test('test_read_WHEN_notCSVFile_THEN_throwsError', () => {
    const filePath = path.join(testDir, 'test.txt');
    const reader = new CSVFileReader(filePath);

    expect(() => {
      reader.read();
    }).toThrow(SaltoolsError);

    expect(() => {
      reader.read();
    }).toThrow('não é um arquivo CSV');
  });

  test('test_read_WHEN_emptyCSVFile_THEN_returnsEmptyString', () => {
    const filePath = path.join(testDir, 'empty.csv');
    const reader = new CSVFileReader(filePath);

    const result = reader.read();

    expect(result).toBe('');
  });
});
