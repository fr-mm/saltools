import SaltoolsError from 'src/errors/saltools-error.js';
import { param } from 'src/helper/index.js';

class NumberParser {
  static parse(value, options) {
    const allowEmptyString = param.bool({value: options.allowEmptyString, name: 'allowEmptyString'});
    const allowNull = param.bool({value: options.allowNull, name: 'allowNull'});
    const allowNegative = param.bool({value: options.allowNegative, name: 'allowNegative'});
    const allowZero = param.bool({value: options.allowZero, name: 'allowZero'});
    const integer = param.bool({value: options.integer, name: 'integer'});
    const varName = param.string({value: options.varName, name: 'varName'});
    const shouldThrowError = param.bool({value: options.throwError, name: 'throwError'});

    const originalValue = value;

    try {
      value = this.#validateType(value, allowNull, originalValue, varName);
      this.#validateEmptyString(value, allowEmptyString, varName);
      value = this.#parseType(value, originalValue, varName);
      this.#validateInteger(value, integer, varName);
      this.#validateNegative(value, allowNegative, varName);
      this.#validateZero(value, allowZero, varName);
      return value;
    }
    catch (error) {
      if (!shouldThrowError && error instanceof SaltoolsError) {
        return null;
      }
      throw error;
    }
  }

  static #validateType(value, allowNull, originalValue, varName) {
    if (value === null) {
      if (!allowNull) {
        this.#throwError('null não é permitido quando {allowNull: false}', varName);
      }
      return value;
    }

    if (typeof value !== 'string' && typeof value !== 'number') {
      this.#throwError(`Não é possível converter ${typeof originalValue} ${originalValue} para número.`, varName);
    }
    return value;
  }

  static #validateEmptyString(value, allowEmptyString, varName) {
    if (!allowEmptyString && value === '') {
      this.#throwError('String não pode ser vazia quando {allowEmptyString: false}', varName);
    }
  }

  static #parseType(value, originalValue, varName) {
    const numValue = Number(value);
    if (isNaN(numValue)) {
      this.#throwError(`Não é possível converter ${typeof originalValue} ${originalValue} para número.`, varName);
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

export function number(value, { 
  allowEmptyString = false, 
  allowNull = false,
  allowNegative = false,
  allowZero = false,
  varName = undefined,
  throwError = true
} = {}) {
  return NumberParser.parse(value, { 
    allowEmptyString, 
    allowNull, 
    allowNegative, 
    allowZero, 
    varName, 
    throwError,
    integer: false
  });
}

export function integer(value, { 
  allowEmptyString = false, 
  allowNull = false,
  allowNegative = false,
  allowZero = false,
  varName = undefined,
  throwError = true
} = {}) {
  return NumberParser.parse(value, { 
    allowEmptyString, 
    allowNull, 
    allowNegative, 
    allowZero, 
    varName, 
    throwError,
    integer: true
  });
}