import SaltoolsError from 'src/errors/saltools-error.js';
import { param } from 'src/helper/index.js';
import CachedOptions from 'src/helper/cached-options.js';
import OptionsService from 'src/helper/options-service.js';

export default class StringParser {
  static #DO_NOT_CAPITALIZE = ['de', 'do', 'da', 'dos', 'das', 'e'];
  static #DEFAULT_OPTIONS = {
    allowEmpty: false,
    cast: false,
    trim: true,
    capitalize: false,
    varName: undefined,
    throwError: true,
  };

  static #cachedOptions = new CachedOptions();

  static parse(value, options = {}) {
    options = OptionsService.update(options, this.#DEFAULT_OPTIONS);
    this.#validateOptions(options);

    try {
      value = this.#parseType(value, options.cast, options.varName);
      value = this.#parseTrim(value, options.trim);
      this.#parseEmpty(value, options.allowEmpty, options.varName);
      value = this.#parseCapitalize(value, options.capitalize);
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

    param.bool({ value: options.allowEmpty, name: 'allowEmpty' });
    param.bool({ value: options.cast, name: 'cast' });
    param.bool({ value: options.trim, name: 'trim' });
    param.bool({ value: options.capitalize, name: 'capitalize' });
    param.string({ value: options.varName, name: 'varName' });
    param.bool({ value: options.throwError, name: 'throwError' });

    this.#cachedOptions.cache(options);
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
