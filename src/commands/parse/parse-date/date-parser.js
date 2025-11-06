import StringToDateParser from './string-to-date-parser.js';
import DateToStringParser from './date-to-string-parser.js';
import SaltoolsError from 'src/errors/saltools-error.js';
import OptionsService from 'src/helper/options-service.js';

export default class DateParser {
  static #DEFAULT_OPTIONS = {
    inputFormat: 'iso',
    outputFormat: 'iso',
    throwError: true,
  };

  static parse(date, options = {}) {
    options = OptionsService.update(options, this.#DEFAULT_OPTIONS);

    try {
      const parsedDate = StringToDateParser.parse(date, options.inputFormat);
      return DateToStringParser.parse(parsedDate, options.outputFormat);
    } catch (error) {
      if (!options.throwError && error instanceof SaltoolsError) {
        return null;
      }
      throw error;
    }
  }
}
