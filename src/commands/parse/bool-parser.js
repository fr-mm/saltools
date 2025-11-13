import SaltoolsError from 'src/errors/saltools-error.js';
import { param } from 'src/helper/index.js';
import OptionsService from 'src/helper/options-service.js';

export default class BoolParser {
  static #DEFAULT_OPTIONS = {
    throwError: true,
  };

  static parse(value, options = {}) {
    options = OptionsService.update({ options, default: this.#DEFAULT_OPTIONS });
    this.#validateOptions(options);
    return this.#parse(value, options);
  }

  static #parse(value, options) {
    switch (typeof value) {
      case 'string':
        return this.#parseString(value, options.throwError);
      case 'number':
        return this.#parseNumber(value, options.throwError);
      case 'boolean':
        return value;
      default:
        this.#throwError(value, options.throwError);
    }
  }

  static #parseString(value, throwError) {
    if (value === 'true' || value === 'TRUE' || value === '1') return true;
    if (value === 'false' || value === 'FALSE' || value === '0') return false;
    if (value.length > 7) {
      this.#throwError(value, throwError);
      return;
    }
    const needsTrim = value.length > 0 && (value[0] <= ' ' || value[value.length - 1] <= ' ');
    const lowerValue = value.toLowerCase();
    const normalizedValue = needsTrim ? lowerValue.trim() : lowerValue;
    if (normalizedValue === 'true' || normalizedValue === '1') return true;
    if (normalizedValue === 'false' || normalizedValue === '0') return false;
    this.#throwError(value, throwError);
  }

  static #parseNumber(value, throwError) {
    if (value === 1) return true;
    if (value === 0) return false;
    this.#throwError(value, throwError);
  }

  static #validateOptions(options) {
    param.bool({ value: options.throwError, name: 'throwError' });
  }

  static #throwError(value, throwError) {
    if (throwError) {
      throw new SaltoolsError(`Invalid boolean value. ${typeof value} ${value}`);
    }
  }
}
