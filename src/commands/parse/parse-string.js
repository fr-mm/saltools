import SaltoolsError from 'src/errors/saltools-error.js';
import { param } from 'src/helper/index.js';

class StringParser {
  #value;
  #allowEmpty;
  #cast;
  #trim;
  #capitalize;
  #varName;
  #shouldThrowError;
  #doNotCapitalize;

  constructor(value, options) {
    this.#value = value;
    this.#allowEmpty = param.bool({value: options.allowEmpty, name: 'allowEmpty'});
    this.#cast = param.bool({value: options.cast, name: 'cast'});
    this.#trim = param.bool({value: options.trim, name: 'trim'});
    this.#capitalize = param.bool({value: options.capitalize, name: 'capitalize'});
    this.#varName = param.string({value: options.varName, name: 'varName'});
    this.#shouldThrowError = param.bool({value: options.throwError, name: 'throwError'});
    this.#doNotCapitalize = ['de', 'do', 'da', 'dos', 'das', 'e'];
  }

  parse() {
    try {
      this.#parseType();
      this.#parseTrim();
      this.#parseEmpty();
      this.#parseCapitalize();
      return this.#value;
    }
    catch (error) {
      if (!this.#shouldThrowError && error instanceof SaltoolsError) {
        return null;
      }
      throw error;
    }
  }

  #parseType() {
    if (typeof this.#value !== 'string') {
      if (this.#cast) {
        this.#value = String(this.#value);
      } else {
        this.#throwError(
          `${typeof this.#value} ${this.#value} não é uma string. 
          Se quiser converter para string, use o parâmetro {cast: true}.`)
      }
    }
  }

  #parseTrim() {
    if (this.#trim) {
      this.#value = this.#value.trim();
    }
  }

  #parseEmpty() {
    if (!this.#allowEmpty && this.#value === '') {
      this.#throwError('String não pode ser vazia quando {allowEmpty: false}');
    }
  }

  #parseCapitalize() {
    if (!this.#capitalize) {
        return;
    }
    let lowerCase = this.#value.toLocaleLowerCase().trim();
    lowerCase = lowerCase.replace(/\s+/g, ' ');
    const capitalizedWords = [];
    for (const word of lowerCase.split(' ')) {
      if (word === '') continue;
      const formattedWord = this.#doNotCapitalize.includes(word) ? word : this.#capitalizeWord(word);
      capitalizedWords.push(formattedWord);
    }
    this.#value = capitalizedWords.join(' ');
  }

  #capitalizeWord(word) {
    return word.charAt(0).toLocaleUpperCase('pt-BR') + word.slice(1);
  }

  #throwError(message) {
    message = this.#varName ? `${message} varName: ${this.#varName}` : message;
    throw new SaltoolsError(message);
  }
}

export default function string(value, { 
        allowEmpty = false, 
        cast = false, 
        trim = true, 
        capitalize = false ,
        varName = null,
        throwError = true
    } = {}) {
  return new StringParser(value, { allowEmpty, cast, trim, capitalize, varName, throwError }).parse();
}
