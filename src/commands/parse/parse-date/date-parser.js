import StringToDateParser from './string-to-date-parser.js';
import DateToStringParser from './date-to-string-parser.js';
import SaltoolsError from 'src/errors/saltools-error.js';
import OptionsService from 'src/helper/options-service.js';
import DateConfig from 'src/commands/config/date-config.js';

export default class DateParser {
  static #DEFAULT_OPTIONS = {
    inputFormat: 'iso',
    outputFormat: 'iso',
    throwError: true,
  };

  static parse(date, options = {}) {
    options = OptionsService.update({
      options,
      default: this.#DEFAULT_OPTIONS,
      specificConfig: DateConfig,
    });

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
