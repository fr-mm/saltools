import SaltoolsError from 'src/errors/saltools-error.js';
import { param } from 'src/helper/index.js';

class StringParser {
  static #DO_NOT_CAPITALIZE = ['de', 'do', 'da', 'dos', 'das', 'e'];

  static parse(value, options) {
    const allowEmpty = param.bool({ value: options.allowEmpty, name: 'allowEmpty' });
    const cast = param.bool({ value: options.cast, name: 'cast' });
    const trim = param.bool({ value: options.trim, name: 'trim' });
    const capitalize = param.bool({ value: options.capitalize, name: 'capitalize' });
    const varName = param.string({ value: options.varName, name: 'varName' });
    const shouldThrowError = param.bool({ value: options.throwError, name: 'throwError' });

    try {
      value = this.#parseType(value, cast, varName);
      value = this.#parseTrim(value, trim);
      this.#parseEmpty(value, allowEmpty, varName);
      value = this.#parseCapitalize(value, capitalize);
      return value;
    } catch (error) {
      if (!shouldThrowError && error instanceof SaltoolsError) {
        return null;
      }
      throw error;
    }
  }

  static #parseType(value, cast, varName) {
    if (typeof value !== 'string') {
      if (cast) {
        return String(value);
      } else {
        this.#throwError(
          `${typeof value} ${value} não é uma string. 
          Se quiser converter para string, use o parâmetro {cast: true}.`,
          varName
        );
      }
    }
    return value;
  }

  static #parseTrim(value, trim) {
    if (trim) {
      return value.trim();
    }
    return value;
  }

  static #parseEmpty(value, allowEmpty, varName) {
    if (!allowEmpty && value === '') {
      this.#throwError('String não pode ser vazia quando {allowEmpty: false}', varName);
    }
  }

  static #parseCapitalize(value, capitalize) {
    if (!capitalize) {
      return value;
    }
    let lowerCase = value.toLocaleLowerCase().trim();
    lowerCase = lowerCase.replace(/\s+/g, ' ');
    const capitalizedWords = [];
    for (const word of lowerCase.split(' ')) {
      if (word === '') continue;
      const formattedWord = this.#DO_NOT_CAPITALIZE.includes(word)
        ? word
        : this.#capitalizeWord(word);
      capitalizedWords.push(formattedWord);
    }
    return capitalizedWords.join(' ');
  }

  static #capitalizeWord(word) {
    return word.charAt(0).toLocaleUpperCase('pt-BR') + word.slice(1);
  }

  static #throwError(message, varName) {
    message = varName ? `${message} varName: ${varName}` : message;
    throw new SaltoolsError(message);
  }
}

export default function string(
  value,
  {
    allowEmpty = false,
    cast = false,
    trim = true,
    capitalize = false,
    varName = undefined,
    throwError = true,
  } = {}
) {
  return StringParser.parse(value, { allowEmpty, cast, trim, capitalize, varName, throwError });
}
