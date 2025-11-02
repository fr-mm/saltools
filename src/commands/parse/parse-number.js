import SaltoolsError from 'src/errors/saltools-error.js';

class NumberParser {
  constructor(value, options) {
    this.value = value;
    this.allowEmptyString = options.allowEmpty;
    this.allowNull = options.allowNull;
    this.allowNegative = options.allowNegative;
    this.allowZero = options.allowZero;
    this.integer = options.integer;
    this.varName = options.varName;
    this.originalValue = value;
  }

  parse() {
    this.validateType();
    this.validateEmptyString();
    this.parseType();
    this.validateInteger();
    return this.value;
  }

  validateType() {
    const allowedTypes = ['string', 'number'];
    if (this.allowNull) {
        allowedTypes.push('null');
    }
    if (!allowedTypes.includes(typeof this.value)) {
        let message = `Não é possível converter ${typeof this.originalValue} ${this.originalValue} para número.`;

        if (!this.allowNull && this.value === null) {
            message += ' Para converter null pra 0, use o parâmetro {allowNull: true}.';
        }
        this.throwError(message);
    }
  }

  validateEmptyString() {
    if (!this.allowEmptyString && this.value === '') {
        this.throwError('String não pode ser vazia quando {allowEmptyString: false}');
    }
  }

  parseType() {
    this.value = Number(this.value);
    if (isNaN(this.value)) {
        this.throwError(`Não é possível converter ${typeof this.originalValue} ${this.originalValue} para número.`);
    }
  }

  validateInteger() {
    if (this.integer && !Number.isInteger(this.value)) {
        this.throwError(`${this.value} não é um inteiro.`)
    }
  }

  throwError(message) {
    message = this.varName ? `${message} varName: ${this.varName}` : message;
    throw new SaltoolsError(message);
  }
}

export function number(value, { 
  allowEmpty = false, 
  allowNull = false,
  allowNegative = false,
  allowZero = false,
  varName = null
} = {}) {
  return new NumberParser(value, { 
    allowEmpty, 
    allowNull, 
    allowNegative, 
    allowZero, 
    varName, 
    integer: false 
}).parse();
}

export function integer(value, { 
  allowEmpty = false, 
  allowNull = false,
  allowNegative = false,
  allowZero = false,
  varName = null
} = {}) {
  return new NumberParser(value, { 
    allowEmpty, 
    allowNull, 
    allowNegative, 
    allowZero, 
    varName, 
    integer: true 
}).parse();
}