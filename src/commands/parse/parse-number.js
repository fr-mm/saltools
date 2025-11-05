import SaltoolsError from 'src/errors/saltools-error.js';
import { param } from 'src/helper/index.js';
import CachedOptions from 'src/helper/cachedOptions.js';

class NumberParser {
  static #cachedOptions = new CachedOptions();

  static parse(value, options) {
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
        this.#throwError('null não é permitido quando {allowNull: false}', varName);
      }
      return;
    }

    if (typeof value !== 'string' && typeof value !== 'number') {
      this.#throwError(
        `Não é possível converter ${typeof originalValue} ${originalValue} para número.`,
        varName
      );
    }
  }

  static #validateEmptyString(value, allowEmptyString, varName) {
    if (!allowEmptyString && value === '') {
      this.#throwError('String não pode ser vazia quando {allowEmptyString: false}', varName);
    }
  }

  static #parseType(value, originalValue, varName) {
    const numValue = Number(value);
    if (isNaN(numValue)) {
      this.#throwError(
        `Não é possível converter ${typeof originalValue} ${originalValue} para número.`,
        varName
      );
    }
    return numValue;
  }

  static #validateInteger(value, integer, varName) {
    if (integer && !Number.isInteger(value)) {
      this.#throwError(`${value} não é um inteiro.`, varName);
    }
  }

  static #validateNegative(value, allowNegative, varName) {
    if (!allowNegative && value < 0) {
      this.#throwError('Número não pode ser negativo quando {allowNegative: false}', varName);
    }
  }

  static #validateZero(value, allowZero, varName) {
    if (!allowZero && value === 0) {
      this.#throwError('Número não pode ser zero quando {allowZero: false}', varName);
    }
  }

  static #throwError(message, varName) {
    message = varName ? `${message} varName: ${varName}` : message;
    throw new SaltoolsError(message);
  }
}

export function number(
  value,
  {
    allowEmptyString = false,
    allowNull = false,
    allowNegative = false,
    allowZero = false,
    varName = undefined,
    throwError = true,
  } = {}
) {
  return NumberParser.parse(value, {
    allowEmptyString,
    allowNull,
    allowNegative,
    allowZero,
    varName,
    throwError,
    integer: false,
  });
}

export function integer(
  value,
  {
    allowEmptyString = false,
    allowNull = false,
    allowNegative = false,
    allowZero = false,
    varName = undefined,
    throwError = true,
  } = {}
) {
  return NumberParser.parse(value, {
    allowEmptyString,
    allowNull,
    allowNegative,
    allowZero,
    varName,
    throwError,
    integer: true,
  });
}
