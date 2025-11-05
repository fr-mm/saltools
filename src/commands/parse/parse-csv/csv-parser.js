import SaltoolsError from 'src/errors/saltools-error.js';
import CSVFileReader from './csv-file-reader.js';
import CSVLineSplitter from './csv-line-splitter.js';
import CSVRowParser from './csv-row-parser.js';
import CSVValueConverter from './csv-value-converter.js';

export default class CSVParser {
  #fileReader;
  #lineSplitter;
  #rowParser;
  #valueConverter;
  #shouldThrowError;

  constructor(path, options = {}) {
    this.#fileReader = new CSVFileReader(path);
    this.#lineSplitter = new CSVLineSplitter({
      quoteChar: options.quoteChar,
      escapeChar: options.escapeChar,
    });
    this.#rowParser = new CSVRowParser({
      delimiter: options.delimiter,
      quoteChar: options.quoteChar,
      escapeChar: options.escapeChar,
    });
    this.#valueConverter = new CSVValueConverter();
    this.#shouldThrowError = options.throwError !== undefined ? options.throwError : true;
  }

  parse() {
    try {
      const content = this.#fileReader.read();
      return this.#parseFileContent(content);
    } catch (error) {
      if (!this.#shouldThrowError && error instanceof SaltoolsError) {
        return null;
      }
      throw error;
    }
  }

  #parseFileContent(content) {
    if (!content.trim()) {
      return [];
    }

    const lines = this.#lineSplitter.split(content);
    if (lines.length === 0) {
      return [];
    }

    const headers = this.#rowParser.parse(lines[0]);
    const result = [];

    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) {
        continue;
      }
      const values = this.#rowParser.parse(lines[i]);
      const row = {};
      for (let j = 0; j < headers.length; j++) {
        row[headers[j]] = this.#valueConverter.convert(values[j] || '');
      }
      result.push(row);
    }

    return result;
  }
}
