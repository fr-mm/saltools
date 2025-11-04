import SaltoolsError from 'src/errors/saltools-error.js';
import { param } from 'src/helper/index.js';

export default class DocParser {
  static #CPF_LENGTH = 11;
  static #CNPJ_LENGTH = 14;
  static #CNPJ_INDICATOR = '000';

  parse(doc, {
    numbersOnly,
    type,
    throwError
  } = {}) {
    try {
      this.#validateParameters({ numbersOnly, type, throwError });
      return this.#parse(doc, { numbersOnly, type });
    } catch (error) {
      if (!throwError && error instanceof SaltoolsError) {
        return null;
      }
      throw error;
    }
  }

  #parse(doc, { numbersOnly, type }) {
    let parsedDoc = this.#parseType(doc, type);
    parsedDoc = parsedDoc.trim();
    parsedDoc = this.#removeSpecialChars(parsedDoc);
    this.#validateLength(parsedDoc);
    return this.#putSpecialCharsBack(parsedDoc, numbersOnly);
  }

  #validateParameters({ numbersOnly, type, throwError }) {
    param.bool({ value: numbersOnly, name: 'numbersOnly' });
    param.string({ value: type, name: 'type', options: ['cpf', 'cnpj'] });
    param.bool({ value: throwError, name: 'throwError' });
  }

  #parseType(doc, type) {
    if (typeof doc === 'number') return this.#parseNumber(doc, type);
    if (typeof doc === 'string') return doc;
    throw new SaltoolsError(`${typeof doc} ${doc} deve ser string ou number`);
  }

  #parseNumber(doc, type) {
    if (!Number.isInteger(doc)) {
      throw new SaltoolsError(`Não é possível converter float ${doc} em doc`);
    }
    if (type) {
      return this.#padToType(doc, type);
    }
    return this.#parseNumberInferingType(doc);
  }

  #parseNumberInferingType(doc) {
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

  #padInferingType(doc) {
    if (doc.length < DocParser.#CPF_LENGTH) {
      return doc.padEnd(DocParser.#CPF_LENGTH, '0');
    }
    if (doc.length > DocParser.#CPF_LENGTH) {
      return doc.padEnd(DocParser.#CNPJ_LENGTH, '0');
    }
    throw new SaltoolsError(`Não foi possível inferir o tipo de documento, ${doc}`);
  }

  #padToType(doc, type) {
    const docStr = doc.toString();
    const targetLength = type === 'cpf' ? DocParser.#CPF_LENGTH : DocParser.#CNPJ_LENGTH;
    if (type === 'cnpj' && docStr.length === 12) {
      return '000' + docStr.slice(0, 9) + docStr.slice(-2);
    }
    return docStr.padStart(targetLength, '0');
  }

  #looksLikeCnpj(doc) {
    return doc.slice(-6).startsWith(DocParser.#CNPJ_INDICATOR);
  }

  #removeSpecialChars(doc) {
    return doc.replace(/[^0-9]/g, '');
  }

  #validateLength(doc) {
    if (![DocParser.#CPF_LENGTH, DocParser.#CNPJ_LENGTH].includes(doc.length)) {
      throw new SaltoolsError(`Documento deve ter ${DocParser.#CPF_LENGTH} ou ${DocParser.#CNPJ_LENGTH} caracteres, ${doc} tem ${doc.length}`);
    }
  }

  #putSpecialCharsBack(doc, numbersOnly) {
    if (numbersOnly) return doc;
    return doc.length === DocParser.#CPF_LENGTH ? this.#formatToCpf(doc) : this.#formatToCnpj(doc);
  }

  #formatToCpf(doc) {
    return doc.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }

  #formatToCnpj(doc) {
    return doc.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  }
}

