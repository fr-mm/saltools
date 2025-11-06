import SaltoolsError from 'src/errors/saltools-error.js';
import CSVFileReader from './csv-file-reader.js';
import CSVLineSplitter from './csv-line-splitter.js';
import CSVRowParser from './csv-row-parser.js';
import CSVValueConverter from './csv-value-converter.js';
import { param } from 'src/helper/index.js';

export default class CSVParser {
  static DEFAULT_OPTIONS = {
    delimiter: ',',
    quoteChar: '"',
    escapeChar: '\\',
    throwError: true,
  };

  static parse(path, options = {}) {
    options = { ...CSVParser.DEFAULT_OPTIONS, ...options };
    CSVParser.#validateOptions(path, options);

    const fileReader = new CSVFileReader(path);
    const lineSplitter = new CSVLineSplitter({
      quoteChar: options.quoteChar,
      escapeChar: options.escapeChar,
    });
    const rowParser = new CSVRowParser({
      delimiter: options.delimiter,
      quoteChar: options.quoteChar,
      escapeChar: options.escapeChar,
    });
    const valueConverter = new CSVValueConverter();
    const shouldThrowError = options.throwError !== undefined ? options.throwError : true;

    try {
      const content = fileReader.read();
      return CSVParser.#parseFileContent(content, lineSplitter, rowParser, valueConverter);
    } catch (error) {
      if (!shouldThrowError && error instanceof SaltoolsError) {
        return null;
      }
      throw error;
    }
  }

  static #validateOptions(path, options) {
    param.string({ value: path, name: 'path', required: true });
    param.string({ value: options.delimiter, name: 'delimiter', required: true });
    param.string({ value: options.quoteChar, name: 'quoteChar', required: true });
    param.string({ value: options.escapeChar, name: 'escapeChar', required: true });
    param.bool({ value: options.throwError, name: 'throwError' });
  }

  static #parseFileContent(content, lineSplitter, rowParser, valueConverter) {
    if (!content.trim()) {
      return [];
    }

    const lines = lineSplitter.split(content);
    if (lines.length === 0) {
      return [];
    }

    const headers = rowParser.parse(lines[0]);
    const result = [];

    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) {
        continue;
      }
      const values = rowParser.parse(lines[i]);
      const row = {};
      for (let j = 0; j < headers.length; j++) {
        row[headers[j]] = valueConverter.convert(values[j] || '');
      }
      result.push(row);
    }

    return result;
  }
}
