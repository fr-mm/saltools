import SaltoolsError from 'src/errors/saltools-error.js';
import { param } from 'src/helper/index.js';

class NumberParser {
  #value;
  #allowEmptyString;
  #allowNull;
  #allowNegative;
  #allowZero;
  #integer;
  #varName;
  #shouldThrowError;
  #originalValue;

  constructor(value, options) {
    this.#value = value;
    this.#allowEmptyString = param.bool({value: options.allowEmptyString, name: 'allowEmptyString'});
    this.#allowNull = param.bool({value: options.allowNull, name: 'allowNull'});
    this.#allowNegative = param.bool({value: options.allowNegative, name: 'allowNegative'});
    this.#allowZero = param.bool({value: options.allowZero, name: 'allowZero'});
    this.#integer = param.bool({value: options.integer, name: 'integer'});
    this.#varName = param.string({value: options.varName, name: 'varName'});
    this.#shouldThrowError = param.bool({value: options.throwError, name: 'throwError'});
    this.#originalValue = value;
  }

  parse() {
    try {
      this.#validateType();
      this.#validateEmptyString();
      this.#parseType();
      this.#validateInteger();
      return this.#value;
    }
    catch (error) {
      if (!this.#shouldThrowError && error instanceof SaltoolsError) {
        return null;
      }
      throw error;
    }
  }

  #validateType() {
    if (this.#value === null) {
      if (!this.#allowNull) {
        this.#throwError('null não é permitido quando {allowNull: false}');
      }
      return;
    }

    if (typeof this.#value !== 'string' && typeof this.#value !== 'number') {
        this.#throwError(`Não é possível converter ${typeof this.#originalValue} ${this.#originalValue} para número.`);
    }
  }

  #validateEmptyString() {
    if (!this.#allowEmptyString && this.#value === '') {
        this.#throwError('String não pode ser vazia quando {allowEmptyString: false}');
    }
  }

  #parseType() {
    this.#value = Number(this.#value);
    if (isNaN(this.#value)) {
        this.#throwError(`Não é possível converter ${typeof this.#originalValue} ${this.#originalValue} para número.`);
    }
  }

  #validateInteger() {
    if (this.#integer && !Number.isInteger(this.#value)) {
        this.#throwError(`${this.#value} não é um inteiro.`)
    }
  }

  #throwError(message) {
    message = this.#varName ? `${message} varName: ${this.#varName}` : message;
    throw new SaltoolsError(message);
  }
}

export function number(value, { 
  allowEmptyString = false, 
  allowNull = false,
  allowNegative = false,
  allowZero = false,
  varName = null,
  throwError = true
} = {}) {
  return new NumberParser(value, { 
    allowEmptyString, 
    allowNull, 
    allowNegative, 
    allowZero, 
    varName, 
    throwError,
    integer: false
}).parse();
}

export function integer(value, { 
  allowEmptyString = false, 
  allowNull = false,
  allowNegative = false,
  allowZero = false,
  varName = null,
  throwError = true
} = {}) {
  return new NumberParser(value, { 
    allowEmptyString, 
    allowNull, 
    allowNegative, 
    allowZero, 
    varName, 
    throwError,
    integer: true
}).parse();
}