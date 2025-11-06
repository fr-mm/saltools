import SaltoolsError from 'src/errors/saltools-error.js';
import { param } from 'src/helper/index.js';
import CachedOptions from 'src/helper/cachedOptions.js';
import OptionsService from 'src/helper/options-service.js';

export default class DocParser {
  static #DEFAULT_OPTIONS = {
    numbersOnly: true,
    type: undefined,
    throwError: true,
  };
  static #CPF_LENGTH = 11;
  static #CNPJ_LENGTH = 14;
  static #CNPJ_INDICATOR = '000';

  static #cachedOptions = new CachedOptions();

  static parse(doc, options = {}) {
    options = OptionsService.update(options, this.#DEFAULT_OPTIONS);

    try {
      this.#validateOptions(options);
      return this.#parse(doc, options);
    } catch (error) {
      if (!options.throwError && error instanceof SaltoolsError) {
        return null;
      }
      throw error;
    }
  }

  static #parse(doc, options) {
    let parsedDoc = this.#parseType(doc, options.type);
    parsedDoc = parsedDoc.trim();
    parsedDoc = this.#removeSpecialChars(parsedDoc);
    this.#validateLength(parsedDoc);
    return this.#putSpecialCharsBack(parsedDoc, options.numbersOnly);
  }

  static #validateOptions(options) {
    if (this.#cachedOptions.isCached(options)) return;
    param.bool({ value: options.numbersOnly, name: 'numbersOnly' });
    param.string({ value: options.type, name: 'type', options: ['cpf', 'cnpj'] });
    param.bool({ value: options.throwError, name: 'throwError' });

    this.#cachedOptions.cache(options);
  }

  static #parseType(doc, type) {
    if (typeof doc === 'number') return this.#parseNumber(doc, type);
    if (typeof doc === 'string') return doc;
    throw new SaltoolsError(`${typeof doc} ${doc} deve ser string ou number`);
  }

  static #parseNumber(doc, type) {
    if (!Number.isInteger(doc)) {
      throw new SaltoolsError(`Não é possível converter float ${doc} em doc`);
    }
    if (type) {
      return this.#padToType(doc, type);
    }
    return this.#parseNumberInferingType(doc);
  }

  static #parseNumberInferingType(doc) {
    doc = String(doc);
    if (doc.length === DocParser.#CPF_LENGTH) {
      if (this.#looksLikeCnpj(doc)) {
        return doc.slice(0, 8) + '0' + doc.slice(8) + '00';
      }
      if (doc.endsWith('00')) {
        return doc;
      }
      throw new SaltoolsError(`Não foi possível inferir o tipo de documento, ${doc}`);
    }
    try {
      this.#validateLength(doc);
      return doc;
    } catch (error) {
      if (error instanceof SaltoolsError) {
        return this.#padInferingType(doc);
      }
      throw error;
    }
  }

  static #padInferingType(doc) {
    if (doc.length < DocParser.#CPF_LENGTH) {
      return doc.padEnd(DocParser.#CPF_LENGTH, '0');
    }
    if (doc.length > DocParser.#CPF_LENGTH) {
      return doc.padEnd(DocParser.#CNPJ_LENGTH, '0');
    }
    throw new SaltoolsError(`Não foi possível inferir o tipo de documento, ${doc}`);
  }

  static #padToType(doc, type) {
    const docStr = doc.toString();
    const targetLength = type === 'cpf' ? DocParser.#CPF_LENGTH : DocParser.#CNPJ_LENGTH;
    if (type === 'cnpj' && docStr.length === 12) {
      return '000' + docStr.slice(0, 9) + docStr.slice(-2);
    }
    return docStr.padStart(targetLength, '0');
  }

  static #looksLikeCnpj(doc) {
    return doc.slice(-6).startsWith(DocParser.#CNPJ_INDICATOR);
  }

  static #removeSpecialChars(doc) {
    return doc.replace(/[^0-9]/g, '');
  }

  static #validateLength(doc) {
    if (![DocParser.#CPF_LENGTH, DocParser.#CNPJ_LENGTH].includes(doc.length)) {
      throw new SaltoolsError(
        `Documento deve ter ${DocParser.#CPF_LENGTH} ou ${DocParser.#CNPJ_LENGTH} caracteres, ${doc} tem ${doc.length}`
      );
    }
  }

  static #putSpecialCharsBack(doc, numbersOnly) {
    if (numbersOnly) return doc;
    return doc.length === DocParser.#CPF_LENGTH ? this.#formatToCpf(doc) : this.#formatToCnpj(doc);
  }

  static #formatToCpf(doc) {
    return doc.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }

  static #formatToCnpj(doc) {
    return doc.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  }
}
