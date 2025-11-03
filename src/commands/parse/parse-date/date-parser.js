import StringToDateParser from './string-to-date-parser.js';
import DateToStringParser from './date-to-string-parser.js';
import SaltoolsError from 'src/errors/saltools-error.js';


export class DateParser {
  #stringToDateParser;
  #dateToStringParser;

  constructor(
    stringToDateParser = new StringToDateParser(),
    dateToStringParser = new DateToStringParser(),
  ) {
    this.#stringToDateParser = stringToDateParser;
    this.#dateToStringParser = dateToStringParser;
  }

  parse(date, {
    inputFormat = 'iso',
    outputFormat = 'iso',
    throwError = true,
  } = {}) {
    try {
      const parsedDate = this.#stringToDateParser.parse(date, inputFormat);
      return this.#dateToStringParser.parse(parsedDate, outputFormat);
    } catch (error) {
      if (!throwError && error instanceof SaltoolsError) {
        return null;
      }
      throw error;
    }
  }
}