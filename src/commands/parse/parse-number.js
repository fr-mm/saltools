import SaltoolsError from 'src/errors/saltools-error.js';
import { param } from 'src/helper/index.js';
import CachedOptions from 'src/helper/cached-options.js';
import OptionsService from 'src/helper/options-service.js';

export default class NumberParser {
  static #DEFAULT_OPTIONS = {
    allowEmptyString: false,
    allowNull: false,
    allowNegative: true,
    allowZero: true,
    integer: false,
    varName: undefined,
    throwError: true,
  };
  static #cachedOptions = new CachedOptions();

  static parseNumber(value, options = {}) {
    options.integer = false;
    return this.parse(value, options);
  }

  static parseInteger(value, options = {}) {
    options.integer = true;
    return this.parse(value, options);
  }

  static parse(value, options) {
    options = OptionsService.update({ options, default: this.#DEFAULT_OPTIONS });
    this.#validateOptions(options);

    try {
      this.#validateType(value, options.allowNull, value, options.varName);
      this.#validateEmptyString(value, options.allowEmptyString, options.varName);
      value = this.#parseType(value, value, options.varName);
      this.#validateInteger(value, options.integer, options.varName);
      this.#validateNegative(value, options.allowNegative, options.varName);
      this.#validateZero(value, options.allowZero, options.varName);
      return value;
    } catch (error) {
      if (!options.throwError && error instanceof SaltoolsError) {
        return null;
      }
      throw error;
    }
  }

  static #validateOptions(options) {
    if (this.#cachedOptions.isCached(options)) return;

    param.bool({ value: options.allowEmptyString, name: 'allowEmptyString' });
    param.bool({ value: options.allowNull, name: 'allowNull' });
    param.bool({ value: options.allowNegative, name: 'allowNegative' });
    param.bool({ value: options.allowZero, name: 'allowZero' });
    param.bool({ value: options.integer, name: 'integer' });
    param.string({ value: options.varName, name: 'varName' });
    param.bool({ value: options.throwError, name: 'throwError' });

    this.#cachedOptions.cache(options);
  }

  static #validateType(value, allowNull, originalValue, varName) {
    if (value === null) {
      if (!allowNull) {
        this.#throwError('null não é permitido quando {allowNull: false}', varName, value);
      }
      return;
    }

    if (typeof value !== 'string' && typeof value !== 'number') {
      this.#throwError(
        `Não é possível converter ${typeof originalValue} ${originalValue} para número.`,
        varName,
        originalValue
      );
    }
  }

  static #validateEmptyString(value, allowEmptyString, varName) {
    if (!allowEmptyString && value === '') {
      this.#throwError(
        'String não pode ser vazia quando {allowEmptyString: false}',
        varName,
        value
      );
    }
  }

  static #parseType(value, originalValue, varName) {
    const numValue = Number(value);
    if (isNaN(numValue)) {
      this.#throwError(
        `Não é possível converter ${typeof originalValue} ${originalValue} para número.`,
        varName,
        originalValue
      );
    }
    return numValue;
  }

  static #validateInteger(value, integer, varName) {
    if (integer && !Number.isInteger(value)) {
      this.#throwError(`${value} não é um inteiro.`, varName, value);
    }
  }

  static #validateNegative(value, allowNegative, varName) {
    if (!allowNegative && value < 0) {
      this.#throwError(
        'Número não pode ser negativo quando {allowNegative: false}',
        varName,
        value
      );
    }
  }

  static #validateZero(value, allowZero, varName) {
    if (!allowZero && value === 0) {
      this.#throwError('Número não pode ser zero quando {allowZero: false}', varName, value);
    }
  }

  static #throwError(message, varName, value) {
    message = `${message} chave ${varName}, valor ${value}, tipo ${typeof value}`;
    throw new SaltoolsError(message);
  }
}
