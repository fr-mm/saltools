import fs from 'fs';
import { parsePhoneNumberWithError, isValidPhoneNumber } from 'libphonenumber-js';
import dns from 'dns';
import net from 'net';
import validator from 'validator';
import path from 'path';

class SaltoolsError extends Error {
  constructor(message, options = {}) {
    super(`[Saltools] ${message}`, options);
    this.name = 'SaltoolsError';
    this.options = options;
  }
}

function validateParam({value, type, name, required = false}) {
    if (value === null || value === undefined) {
        if (required) {
            throw new SaltoolsError(`${name} é obrigatório`);
        }
        return value;
    }
    if (typeof value !== type) {
        throw new SaltoolsError(`${name} deve ser ${type}, recebeu ${typeof value} ${value}`);
    }
    return value;
}

function bool({value, name, required = false}) {
    return validateParam({value, type: 'boolean', name, required});
}

function string$1({value, name, required = false, options = null }) {
    const validated = validateParam({value, type: 'string', name, required});
    if (options !== null && validated !== null && validated !== undefined) {
        if (!Array.isArray(options)) {
            throw new SaltoolsError(`${name} deve ser um array, recebeu ${typeof options} ${options}`);
        }
        if (!options.includes(validated)) {
            throw new SaltoolsError(`${name} não é uma option valida ${options.join(', ')}`)
        }
    }
    return validated;
}

function number$1({value, name, required = false}) {
    return validateParam({value, type: 'number', name, required});
}

function integer$1({value, name, required = false}) {
    const number = validateParam({value, type: 'number', name, required});
    if (number === null || number === undefined) {
        return number;
    }
    if (!Number.isInteger(number)) {
        throw new SaltoolsError(`${name} deve ser um inteiro, recebeu ${typeof value} ${number}`);
    }
    return number;
}

function object({value, name, required = false}) {
    return validateParam({value, type: 'object', name, required});
}

function error$1({value, name, required = false}) {
    const validated = object({value, name, required});
    if (!required && (validated === null || validated === undefined)) return validated;
    if (validated instanceof Error) return validated;
    throw new SaltoolsError(`${name} deve ser um erro, recebeu ${typeof validated} ${validated}`);
}

const param = {
    bool,
    string: string$1,
    number: number$1,
    integer: integer$1,
    object,
    error: error$1
};

class CachedOptions {
  #cache = new Set();

  cache(options) {
    const hash = this.#hash(options);
    this.#cache.add(hash);
  }

  isCached(options) {
    const hash = this.#hash(options);
    return this.#cache.has(hash);
  }

  #hash(options) {
    let hash = '';
    for (const key in options) {
      const value = options[key];
      hash += `${key}:${typeof value}:${value}|`;
    }
    return hash;
  }
}

class StringParser {
  static #DO_NOT_CAPITALIZE = ['de', 'do', 'da', 'dos', 'das', 'e'];
  static DEFAULT_OPTIONS = {
    allowEmpty: false,
    cast: false,
    trim: true,
    capitalize: false,
    varName: undefined,
    throwError: true,
  };

  static #cachedOptions = new CachedOptions();

  static parse(value, options) {
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

function string(value, options = {}) {
  const mergedOptions = { ...StringParser.DEFAULT_OPTIONS, ...options };
  return StringParser.parse(value, mergedOptions);
}

class NumberParser {
  static DEFAULT_OPTIONS = {
    allowEmptyString: false,
    allowNull: false,
    allowNegative: false,
    allowZero: false,
    integer: false,
    varName: undefined,
    throwError: true,
  };
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

function number(value, options = {}) {
  const mergedOptions = { ...NumberParser.DEFAULT_OPTIONS, ...options, integer: false };
  return NumberParser.parse(value, mergedOptions);
}

function integer(value, options = {}) {
  const mergedOptions = { ...NumberParser.DEFAULT_OPTIONS, ...options, integer: true };
  return NumberParser.parse(value, mergedOptions);
}

class CSVFileReader {
  constructor(path) {
    this.path = path;
  }

  read() {
    this.#validatePath();
    this.#validateExtension();
    return fs.readFileSync(this.path, 'utf8');
  }

  #validatePath() {
    if (!fs.existsSync(this.path)) {
      throw new SaltoolsError(`Arquivo ${this.path} não encontrado`);
    }
  }
  
  #validateExtension() {  
    if (!this.path.toLowerCase().endsWith('.csv')) {
      throw new SaltoolsError(`Arquivo ${this.path} não é um arquivo CSV`);
    }
  }
}

class CSVLineSplitter {
  #quoteChar;
  #escapeChar;

  constructor({quoteChar, escapeChar} = {}) {
    this.#quoteChar = quoteChar;
    this.#escapeChar = escapeChar;
  }

  split(content) {
    const lines = [];
    let currentLine = '';
    let inQuotes = false;
    let i = 0;

    while (i < content.length) {
      const char = content[i];
      const nextChar = this.#getNextChar(content, i);

      if (this.#isEscapedQuote(char, nextChar)) {
        currentLine = this.#addEscapedQuote(currentLine);
        i += 2;
        continue;
      }

      if (char === this.#quoteChar) {
        inQuotes = !inQuotes;
        currentLine += char;
        i++;
        continue;
      }

      if (this.#isCarriageReturnNewline(char, inQuotes, nextChar)) {
        this.#finishLine(lines, currentLine);
        currentLine = '';
        i += 2;
        continue;
      }

      if (this.#isNewline(char, inQuotes)) {
        this.#finishLine(lines, currentLine);
        currentLine = '';
        i += 1;
        continue;
      }

      currentLine += char;
      i++;
    }

    this.#addRemainingLine(lines, currentLine);
    return lines;
  }

  #getNextChar(content, index) {
    return index + 1 < content.length ? content[index + 1] : '';
  }

  #addRemainingLine(lines, currentLine) {
    if (currentLine.length > 0) {
      lines.push(currentLine);
    }
  }

  #finishLine(lines, currentLine) {
    lines.push(currentLine);
  }

  #addEscapedQuote(currentLine) {
    return currentLine + this.#quoteChar;
  }

  #isEscapedQuote(char, nextChar) {
    return char === this.#escapeChar && nextChar === this.#quoteChar;
  }

  #isCarriageReturnNewline(char, inQuotes, nextChar) {
    return char === '\r' && !inQuotes && nextChar === '\n';
  }

  #isNewline(char, inQuotes) {
    return char === '\n' && !inQuotes;
  }
}

class CSVRowParser {
  #delimiter;
  #quoteChar;
  #escapeChar;

  constructor({delimiter, quoteChar, escapeChar} = {}) {
    this.#delimiter = delimiter;
    this.#quoteChar = quoteChar;
    this.#escapeChar = escapeChar;
  }

  parse(row) {
    const fields = [];
    let currentField = '';
    let inQuotes = false;
    let i = 0;

    while (i < row.length) {
      const char = row[i];
      const nextChar = this.#getNextChar(row, i);

      if (this.#isEscapedQuote(char, nextChar)) {
        currentField += this.#quoteChar;
        i += 2;
        continue;
      }

      if (char === this.#quoteChar) {
        const result = this.#handleQuote(inQuotes, nextChar);
        if (result.addQuote) {
          currentField += this.#quoteChar;
          i += 2;
          continue;
        }
        inQuotes = result.inQuotes;
        i++;
        continue;
      }

      if (this.#isDelimiter(char, inQuotes)) {
        this.#finishField(fields, currentField);
        currentField = '';
        i++;
        continue;
      }

      currentField += char;
      i++;
    }

    this.#finishField(fields, currentField);
    return fields;
  }

  #getNextChar(row, index) {
    return index + 1 < row.length ? row[index + 1] : '';
  }

  #isEscapedQuote(char, nextChar) {
    return char === this.#escapeChar && nextChar === this.#quoteChar;
  }

  #finishField(fields, currentField) {
    fields.push(currentField.trim());
  }

  #handleQuote(inQuotes, nextChar) {
    if (inQuotes && nextChar === this.#quoteChar) {
      return { addQuote: true, inQuotes };
    }
    return { addQuote: false, inQuotes: !inQuotes };
  }

  #isDelimiter(char, inQuotes) {
    return char === this.#delimiter && !inQuotes;
  }
}

class CSVValueConverter {
  convert(value) {
    if (this.#isEmpty(value)) {
      return '';
    }

    if (this.#isBoolean(value)) {
      return this.#toBoolean(value);
    }

    if (this.#isNumeric(value)) {
      return this.#toNumber(value);
    }

    return value;
  }

  #isEmpty(value) {
    return value === '' || value.trim() === '';
  }

  #isBoolean(value) {
    const lowerValue = value.toLowerCase().trim();
    return lowerValue === 'true' || lowerValue === 'false';
  }

  #toBoolean(value) {
    const lowerValue = value.toLowerCase().trim();
    return lowerValue === 'true';
  }

  #isNumeric(value) {
    if (value.trim() === '') {
      return false;
    }
    return !isNaN(value);
  }

  #toNumber(value) {
    const numValue = Number(value);
    if (!isNaN(numValue) && isFinite(numValue)) {
      return numValue;
    }
    return value;
  }
}

class CSVParser {
  static DEFAULT_OPTIONS = {
    delimiter: ',',
    quoteChar: '"',
    escapeChar: '\\',
    throwError: true,
  };
  #fileReader;
  #lineSplitter;
  #rowParser;
  #valueConverter;
  #shouldThrowError;

  constructor(path, options = {}) {
    options = { ...CSVParser.DEFAULT_OPTIONS, ...options };
    this.#validateOptions(path, options);
    this.#fileReader = new CSVFileReader(path);
    this.#lineSplitter = new CSVLineSplitter({
      quoteChar: options.quoteChar,
      escapeChar: options.escapeChar,
    });
    this.#rowParser = new CSVRowParser({
      delimiter: options.delimiter,
      quoteChar: options.quoteChar,
      escapeChar: options.escapeChar,
    });
    this.#valueConverter = new CSVValueConverter();
    this.#shouldThrowError = options.throwError !== undefined ? options.throwError : true;
  }

  parse() {
    try {
      const content = this.#fileReader.read();
      return this.#parseFileContent(content);
    } catch (error) {
      if (!this.#shouldThrowError && error instanceof SaltoolsError) {
        return null;
      }
      throw error;
    }
  }

  #validateOptions(path, options) {
    param.string({ value: path, name: 'path', required: true });
    param.string({ value: options.delimiter, name: 'delimiter', required: true });
    param.string({ value: options.quoteChar, name: 'quoteChar', required: true });
    param.string({ value: options.escapeChar, name: 'escapeChar', required: true });
    param.bool({ value: options.throwError, name: 'throwError' });
  }

  #parseFileContent(content) {
    if (!content.trim()) {
      return [];
    }

    const lines = this.#lineSplitter.split(content);
    if (lines.length === 0) {
      return [];
    }

    const headers = this.#rowParser.parse(lines[0]);
    const result = [];

    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) {
        continue;
      }
      const values = this.#rowParser.parse(lines[i]);
      const row = {};
      for (let j = 0; j < headers.length; j++) {
        row[headers[j]] = this.#valueConverter.convert(values[j] || '');
      }
      result.push(row);
    }

    return result;
  }
}

function csv(path, options = {}) {
  return new CSVParser(path, options).parse();
}

class PhoneParser {
  static DEFAULT_OPTIONS = {
    addCountryCode: true,
    addPlusPrefix: false,
    addAreaCode: true,
    numbersOnly: true,
    throwError: true,
  };
  static #cachedOptions = new CachedOptions();

  static parse(phone, options) {
    try {
      this.#validateOptions(options);
      return this.#parse(phone, options);
    } catch (error) {
      if (!options.throwError) {
        return null;
      }
      if (!(error instanceof SaltoolsError)) {
        throw new SaltoolsError(`Número de telefone inválido ${phone} ${error.message}`);
      }
      throw error;
    }
  }

  static #parse(phone, options) {
    const country = this.#getCountryCode(phone);
    const phoneNumber = this.#parsePhoneNumber(phone, country);
    this.#validatePhoneNumber(phone, country);
    const formattedPhone = this.#formatPhoneNumber(phoneNumber, options);
    return this.#addPlusPrefix(formattedPhone, options);
  }

  static #addPlusPrefix(result, options) {
    if (options.addPlusPrefix && options.addCountryCode && !result.startsWith('+')) {
      return `+${result}`;
    }
    return result;
  }

  static #validateOptions(options) {
    if (this.#cachedOptions.isCached(options)) return;

    param.bool({ value: options.addCountryCode, name: 'addCountryCode' });
    param.bool({ value: options.addPlusPrefix, name: 'addPlusPrefix' });
    param.bool({ value: options.addAreaCode, name: 'addAreaCode' });
    param.bool({ value: options.numbersOnly, name: 'numbersOnly' });
    param.bool({ value: options.throwError, name: 'throwError' });

    this.#cachedOptions.cache(options);
  }

  static #parsePhoneNumber(phone, country) {
    return parsePhoneNumberWithError(phone, country);
  }

  static #validatePhoneNumber(phone, country) {
    if (!isValidPhoneNumber(phone, country)) {
      throw new SaltoolsError(`Número de telefone inválido: ${phone}`);
    }
  }

  static #getCountryCode(phone) {
    if (phone.startsWith('+')) {
      return undefined;
    }

    const cleanPhone = phone.replace(/\D/g, '');

    if (cleanPhone.startsWith('55')) {
      try {
        const phoneNumber = parsePhoneNumberWithError(phone);
        return phoneNumber.country;
      } catch {
        return 'BR';
      }
    }

    return 'BR';
  }

  static #formatPhoneNumber(phoneNumber, options) {
    if (options.numbersOnly) {
      if (options.addCountryCode) {
        return phoneNumber.number.replace('+', '');
      }
      return phoneNumber.nationalNumber;
    }

    if (options.addCountryCode) {
      if (options.addPlusPrefix) {
        return phoneNumber.format('INTERNATIONAL');
      }
      const countryCode = phoneNumber.countryCallingCode;
      const nationalFormat = phoneNumber.format('NATIONAL');
      return `${countryCode} ${nationalFormat}`;
    }
    return phoneNumber.format('NATIONAL');
  }
}

function parsePhone(phone, options = {}) {
  const mergedOptions = { ...PhoneParser.DEFAULT_OPTIONS, ...options };
  return PhoneParser.parse(phone, mergedOptions);
}

class StringToDateParser {
  static #lastFormat = null;
  static #formatCache = null;

  static parse(date, format) {
    StringToDateParser.#validateParams(date, format);
    date = date.trim();
    format = format.trim();
    return format.toLowerCase() === 'iso' ? StringToDateParser.#parseIso(date) : StringToDateParser.#parseCustomFormat(date, format);
  }

  static #validateParams(date, format) {
    param.string({ value: date, name: 'date', required: true });
    param.string({ value: format, name: 'format', required: true });
  }

  static #parseIso(date) {
    const parsed = new Date(date);
    if (isNaN(parsed.getTime())) {
      throw new SaltoolsError(`Data inválida: ${date}`);
    }
    return parsed;
  }

  static #parseCustomFormat(date, format) {
    let separator, formatParts, indices;

    if (StringToDateParser.#lastFormat === format) {
      ({ separator, formatParts, indices } = StringToDateParser.#formatCache);
    } else {
      StringToDateParser.#validateFormat(format);
      const extracted = StringToDateParser.#extractSeparatorFromFormat(format);
      separator = extracted.separator;
      formatParts = extracted.formatParts;
      indices = StringToDateParser.#findFormatIndices(formatParts);
      
      StringToDateParser.#lastFormat = format;
      StringToDateParser.#formatCache = { separator, formatParts, indices };
    }

    StringToDateParser.#validateSeparatorMatch(separator, date);
    const parts = StringToDateParser.#extractParts(date, separator, formatParts);
    const { day, month, year } = StringToDateParser.#parseDateValues(parts, indices, formatParts, date);
    return StringToDateParser.#createAndValidateDate(day, month, year, date);
  }

  static #extractSeparatorFromFormat(format) {
    const formatSeparators = format.match(/[^dmy]/gi) || [];
    const uniqueFormatSeparators = [...new Set(formatSeparators)];
    
    if (uniqueFormatSeparators.length > 1) {
      throw new SaltoolsError(`Formato contém separadores inconsistentes: ${format}`);
    }

    const separator = uniqueFormatSeparators[0] || '';
    let formatParts;
    
    if (separator) {
      formatParts = format.split(separator);
    } else {
      formatParts = StringToDateParser.#parseFormatWithoutSeparator(format);
    }
    
    if (formatParts.length !== 3) {
      throw new SaltoolsError(`Formato inválido: ${format}`);
    }

    return { separator, formatParts };
  }

  static #parseFormatWithoutSeparator(format) {
    const parts = [];
    let currentPart = '';
    let currentType = '';
    
    for (const char of format) {
      const lowerChar = char.toLowerCase();
      
      if (lowerChar === 'd' || lowerChar === 'm' || lowerChar === 'y') {
        if (currentType && currentType !== lowerChar) {
          parts.push(currentPart);
          currentPart = char;
          currentType = lowerChar;
        } else {
          currentPart += char;
          currentType = lowerChar;
        }
      }
    }
    
    if (currentPart) {
      parts.push(currentPart);
    }
    
    return parts;
  }

  static #validateSeparatorMatch(formatSeparator, date) {
    const dateSeparators = date.match(/[^0-9]/g) || [];
    const uniqueDateSeparators = [...new Set(dateSeparators)];
    
    if (uniqueDateSeparators.length > 1) {
      throw new SaltoolsError(`Data contém separadores inconsistentes: ${date}`);
    }

    const dateSeparator = uniqueDateSeparators[0] || '';
    
    if (formatSeparator !== dateSeparator) {
      throw new SaltoolsError(`Separador da data não corresponde ao formato: esperado "${formatSeparator || 'nenhum'}", encontrado "${dateSeparator || 'nenhum'}"`);
    }
  }

  static #extractParts(date, separator, formatParts) {
    if (separator) {
      const parts = date.split(separator);
      
      if (parts.length !== 3) {
        throw new SaltoolsError(`Formato de data inválido: ${date}`);
      }

      return parts;
    }

    return StringToDateParser.#extractPartsWithoutSeparator(date, formatParts);
  }

  static #extractPartsWithoutSeparator(date, formatParts) {
    const parts = [];
    let index = 0;
    
    for (const formatPart of formatParts) {
      const length = formatPart.length;
      
      if (index + length > date.length) {
        throw new SaltoolsError(`Formato de data inválido: ${date}`);
      }
      
      const part = date.substring(index, index + length);
      parts.push(part);
      index += length;
    }
    
    if (index !== date.length) {
      throw new SaltoolsError(`Formato de data inválido: ${date}`);
    }
    
    return parts;
  }

  static #findFormatIndices(formatParts) {
    const dayIndex = formatParts.findIndex(p => p.toLowerCase().includes('d'));
    const monthIndex = formatParts.findIndex(p => p.toLowerCase().includes('m'));
    const yearIndex = formatParts.findIndex(p => p.toLowerCase().includes('y'));

    if (dayIndex === -1 || monthIndex === -1 || yearIndex === -1) {
      throw new SaltoolsError(`Formato inválido: formato deve conter d, m e y`);
    }

    return { dayIndex, monthIndex, yearIndex };
  }

  static #parseDateValues(parts, indices, formatParts, originalDate) {
    let day = parseInt(parts[indices.dayIndex], 10);
    let month = parseInt(parts[indices.monthIndex], 10);
    let year = parseInt(parts[indices.yearIndex], 10);

    if (isNaN(day) || isNaN(month) || isNaN(year)) {
      throw new SaltoolsError(`Data inválida: ${originalDate}`);
    }

    const yearFormat = formatParts[indices.yearIndex].toLowerCase();
    if (yearFormat.length === 2) {
      year = StringToDateParser.#convertTwoDigitYear(year);
    }

    month = month - 1;

    return { day, month, year };
  }

  static #createAndValidateDate(day, month, year, originalDate) {
    const parsed = new Date(year, month, day);
    
    if (parsed.getDate() !== day || parsed.getMonth() !== month || parsed.getFullYear() !== year) {
      throw new SaltoolsError(`Data inválida: ${originalDate}`);
    }

    return parsed;
  }

  static #validateFormat(format) {
    const lowerFormat = format.toLowerCase();
    const dCount = (lowerFormat.match(/d/g) || []).length;
    const mCount = (lowerFormat.match(/m/g) || []).length;
    const yCount = (lowerFormat.match(/y/g) || []).length;

    const validDayCount = dCount === 1 || dCount === 2;
    const validMonthCount = mCount === 1 || mCount === 2;
    const validYearCount = yCount === 2 || yCount === 4;

    if (!validDayCount || !validMonthCount || !validYearCount) {
      throw new SaltoolsError('format deve conter 1 ou 2 "d", 1 ou 2 "m" e 2 ou 4 "y"');
    }
  }

  static #convertTwoDigitYear(year) {
    const currentYear = new Date().getFullYear();
    const century = Math.floor(currentYear / 100) * 100;
    return year < 50 ? century + year : century - 100 + year;
  }
}

class DateToStringParser {
  static #lastFormat = null;
  static #formatCache = null;

  static parse(date, format) {
    DateToStringParser.#validateParams(date, format);
    format = format.trim();
    return format.toLowerCase() === 'iso'
      ? DateToStringParser.#formatIso(date)
      : DateToStringParser.#formatCustomFormat(date, format);
  }

  static #validateParams(date, format) {
    if (!(date instanceof Date)) {
      throw new SaltoolsError('date deve ser uma instância de Date');
    }
    if (isNaN(date.getTime())) {
      throw new SaltoolsError('date deve ser uma data válida');
    }
    param.string({ value: format, name: 'format', required: true });
  }

  static #formatIso(date) {
    return date.toISOString();
  }

  static #formatCustomFormat(date, format) {
    let separator, formatParts, indices;

    if (DateToStringParser.#lastFormat === format) {
      ({ separator, formatParts, indices } = DateToStringParser.#formatCache);
    } else {
      DateToStringParser.#validateFormat(format);
      const extracted = DateToStringParser.#extractSeparatorFromFormat(format);
      separator = extracted.separator;
      formatParts = extracted.formatParts;
      indices = DateToStringParser.#findFormatIndices(formatParts);

      DateToStringParser.#lastFormat = format;
      DateToStringParser.#formatCache = { separator, formatParts, indices };
    }

    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const dayStr = DateToStringParser.#formatValue(day, formatParts[indices.dayIndex]);
    const monthStr = DateToStringParser.#formatValue(month, formatParts[indices.monthIndex]);
    const yearStr = DateToStringParser.#formatValue(year, formatParts[indices.yearIndex], true);

    const parts = [];
    parts[indices.dayIndex] = dayStr;
    parts[indices.monthIndex] = monthStr;
    parts[indices.yearIndex] = yearStr;

    return parts.join(separator);
  }

  static #extractSeparatorFromFormat(format) {
    const formatSeparators = format.match(/[^dmy]/gi) || [];
    const uniqueFormatSeparators = [...new Set(formatSeparators)];

    if (uniqueFormatSeparators.length > 1) {
      throw new SaltoolsError(`Formato contém separadores inconsistentes: ${format}`);
    }

    const separator = uniqueFormatSeparators[0] || '';
    let formatParts;

    if (separator) {
      formatParts = format.split(separator);
    } else {
      formatParts = DateToStringParser.#parseFormatWithoutSeparator(format);
    }

    if (formatParts.length !== 3) {
      throw new SaltoolsError(`Formato inválido: ${format}`);
    }

    return { separator, formatParts };
  }

  static #parseFormatWithoutSeparator(format) {
    const parts = [];
    let currentPart = '';
    let currentType = '';

    for (const char of format) {
      const lowerChar = char.toLowerCase();

      if (lowerChar === 'd' || lowerChar === 'm' || lowerChar === 'y') {
        if (currentType && currentType !== lowerChar) {
          parts.push(currentPart);
          currentPart = char;
          currentType = lowerChar;
        } else {
          currentPart += char;
          currentType = lowerChar;
        }
      }
    }

    if (currentPart) {
      parts.push(currentPart);
    }

    return parts;
  }

  static #findFormatIndices(formatParts) {
    const dayIndex = formatParts.findIndex((p) => p.toLowerCase().includes('d'));
    const monthIndex = formatParts.findIndex((p) => p.toLowerCase().includes('m'));
    const yearIndex = formatParts.findIndex((p) => p.toLowerCase().includes('y'));

    if (dayIndex === -1 || monthIndex === -1 || yearIndex === -1) {
      throw new SaltoolsError(`Formato inválido: formato deve conter d, m e y`);
    }

    return { dayIndex, monthIndex, yearIndex };
  }

  static #formatValue(value, formatPart, isYear = false) {
    const formatLength = formatPart.length;
    let valueStr = value.toString();

    if (isYear && formatLength === 2) {
      valueStr = (value % 100).toString().padStart(2, '0');
    } else if (formatLength === 2) {
      valueStr = valueStr.padStart(2, '0');
    }

    if (valueStr.length > formatLength && !isYear) {
      throw new SaltoolsError(`Valor ${value} não cabe no formato ${formatPart}`);
    }

    return valueStr;
  }

  static #validateFormat(format) {
    const lowerFormat = format.toLowerCase();
    const dCount = (lowerFormat.match(/d/g) || []).length;
    const mCount = (lowerFormat.match(/m/g) || []).length;
    const yCount = (lowerFormat.match(/y/g) || []).length;

    const validDayCount = dCount === 1 || dCount === 2;
    const validMonthCount = mCount === 1 || mCount === 2;
    const validYearCount = yCount === 2 || yCount === 4;

    if (!validDayCount || !validMonthCount || !validYearCount) {
      throw new SaltoolsError('format deve conter 1 ou 2 "d", 1 ou 2 "m" e 2 ou 4 "y"');
    }
  }
}

class DateParser {
  static #DEFAULT_OPTIONS = {
    inputFormat: 'iso',
    outputFormat: 'iso',
    throwError: true,
  };

  static parse(date, options = {}) {
    options = { ...DateParser.#DEFAULT_OPTIONS, ...options };
    try {
      const parsedDate = StringToDateParser.parse(date, options.inputFormat);
      return DateToStringParser.parse(parsedDate, options.outputFormat);
    } catch (error) {
      if (!options.throwError && error instanceof SaltoolsError) {
        return null;
      }
      throw error;
    }
  }
}

class FwfParser {
  static parse(path, fields) {
    FwfParser.#validateFields(fields);
    const content = FwfParser.#readFile(path);
    return FwfParser.#parseContent(content, fields);
  }

  static #parseContent(content, fields) {
    if (!content.trim()) return [];

    const lines = content.split(/\r?\n/);
    const parsedItems = [];

    for (const line of lines) {
      if (line === '') continue;
      const item = FwfParser.#parseLine(line, fields);
      parsedItems.push(item);
    }
    return parsedItems;
  }

  static #parseLine(line, fields) {
    const result = {};
    for (const field of fields) {
      const end = Math.min(field.end, line.length);
      const value = line.slice(field.start, end).trim();
      result[field.key] = FwfParser.#cast(value, field.type);
    }
    return result;
  }

  static #cast(value, type) {
    if (!type) return value;
    if (type === 'number') {
      return Number(value);
    }
    if (type === 'bool') {
      return this.#toBoolean(value);
    }
  }

  static #toBoolean(value) {
    if (['true', '1'].includes(value.toLowerCase())) return true;
    if (['false', '0'].includes(value.toLowerCase())) return false;
    throw new SaltoolsError(`Invalid boolean value: ${value}`);
  }

  static #readFile(path) {
    try {
      return fs.readFileSync(path, 'utf8');
    } catch (error) {
      throw new SaltoolsError(`Error reading file ${path}: ${error.message}`);
    }
  }

  static #validateFields(fields) {
    if (!Array.isArray(fields)) {
      throw new SaltoolsError('Fields must be an array');
    }
    if (fields.length === 0) {
      throw new SaltoolsError('Fields array cannot be empty');
    }
    for (const field of fields) {
      FwfParser.#validateField(field);
    }
  }

  static #validateField(field) {
    if (
      typeof field !== 'object' ||
      field === null ||
      !['key', 'start', 'end'].every((prop) => Object.prototype.hasOwnProperty.call(field, prop))
    ) {
      throw new SaltoolsError(
        "Each field must be an object with 'key', 'start', and 'end' properties."
      );
    }
    if (field.end <= field.start) {
      throw new SaltoolsError(
        `Field '${field.key}' must have end > start. Got start: ${field.start}, end: ${field.end}`
      );
    }
  }
}

class DocParser {
  static DEFAULT_OPTIONS = {
    numbersOnly: true,
    type: undefined,
    throwError: true,
  };
  static #CPF_LENGTH = 11;
  static #CNPJ_LENGTH = 14;
  static #CNPJ_INDICATOR = '000';

  static #cachedOptions = new CachedOptions();

  static parse(doc, options = {}) {
    const mergedOptions = { ...DocParser.DEFAULT_OPTIONS, ...options };
    try {
      this.#validateOptions(mergedOptions);
      return this.#parse(doc, mergedOptions);
    } catch (error) {
      if (!mergedOptions.throwError && error instanceof SaltoolsError) {
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

class DNSValidator {
  static async verify(email, options = {}) {
    await Promise.all([
      DNSValidator.#validateSPF(email, options.validateSPF),
      DNSValidator.#validateDMARC(email, options.validateDMARC),
      DNSValidator.#validateDKIM(email, options.validateDKIM),
      DNSValidator.#validateMX(email, options.validateMX),
      DNSValidator.#validateSMTP(email, options.validateSMTP),
    ]);
  }

  static async #validateSPF(email, validateSPF) {
    if (validateSPF) {
      await DNSValidator.#dnsResolveText({ email, type: 'SPF', text: email.domain });
    }
  }

  static async #validateDMARC(email, validateDMARC) {
    if (validateDMARC) {
      await DNSValidator.#dnsResolveText({ email, type: 'DMARC', text: `_dmarc.${email.domain}` });
    }
  }

  static async #validateDKIM(email, validateDKIM) {
    if (validateDKIM) {
      await DNSValidator.#dnsResolveText({
        email,
        type: 'DKIM',
        text: `default._domainkey.${email.domain}`,
      });
    }
  }

  static async #validateMX(email, validateMX) {
    if (!validateMX) return;
    try {
      const mxRecords = await dns.promises.resolveMx(email.domain);
      if (mxRecords.length === 0) {
        throw new SaltoolsError(`MX não encontrado para o email ${email.value}`);
      }
    } catch {
      throw new SaltoolsError(`Erro ao validar MX para o email ${email.value}`);
    }
  }

  static async #validateSMTP(email, validateSMTP) {
    if (!validateSMTP) return;
    try {
      const domain = email.domain;
      const mx = await dns.promises.resolveMx(domain);
      const mxHost = mx.sort((a, b) => a.priority - b.priority)[0]?.exchange;
      if (!mxHost) {
        throw new SaltoolsError(`MX não encontrado para o email ${email.value}`);
      }

      const isValid = await new Promise((resolve) => {
        const socket = net.createConnection(25, mxHost);
        let stage = 0;
        socket.setEncoding('ascii');
        socket.setTimeout(5000);

        socket.on('data', (data) => {
          if (stage === 0) {
            socket.write(`HELO test.com\r\n`);
            stage++;
          } else if (stage === 1) {
            socket.write(`MAIL FROM:<verify@test.com>\r\n`);
            stage++;
          } else if (stage === 2) {
            socket.write(`RCPT TO:<${email.value}>\r\n`);
            stage++;
          } else if (stage === 3) {
            socket.write(`QUIT\r\n`);
            socket.end();
            resolve(data.includes('250'));
          }
        });

        socket.on('error', () => resolve(false));
        socket.on('timeout', () => {
          socket.destroy();
          resolve(false);
        });
      });

      if (!isValid) {
        throw new SaltoolsError(`SMTP inválido para o email ${email.value}`);
      }
    } catch (error) {
      if (error instanceof SaltoolsError) {
        throw error;
      }
      throw new SaltoolsError(`Erro ao validar SMTP para o email ${email.value} ${error.message}`);
    }
  }

  static async #dnsResolveText({ email, type, text }) {
    try {
      const txt = await dns.promises.resolveTxt(text);
      if (txt.flat().length === 0) {
        throw new SaltoolsError(`${type} não encontrado para o email ${email.value}`);
      }
    } catch {
      throw new SaltoolsError(`Erro ao validar ${type} para o email ${email.value}`);
    }
  }
}

class EmailParser {
  static #DEFAULT_OPTIONS = {
    allowAlias: false,
    allowDisposable: false,
    validateSPF: true,
    validateDMARC: true,
    validateDKIM: true,
    validateMX: true,
    validateSMTP: true,
  };
  static #DISPOSABLE_DOMAINS = ['mailinator.com', 'tempmail.com', 'dispostable.com'];
  static #ALIAS_DOMAINS = ['gmail.com'];
  static #cachedOptions = new CachedOptions();

  static async parse(email, options = {}) {
    param.string({ value: email, name: 'email', required: true });
    options = { ...EmailParser.#DEFAULT_OPTIONS, ...options };
    EmailParser.#validateOptions(options);

    email = EmailParser.#parseEmail(email);

    EmailParser.#validateSyntax(email);
    EmailParser.#validateAlias(email, options.allowAlias);
    EmailParser.#validateDisposable(email, options.allowDisposable);
    await DNSValidator.verify(email, options);

    return email.value;
  }

  static #validateOptions(options) {
    if (EmailParser.#cachedOptions.isCached(options)) return;

    param.bool({ value: options.allowAlias, name: 'allowAlias' });
    param.bool({ value: options.allowDisposable, name: 'allowDisposable' });
    param.bool({ value: options.validateSPF, name: 'validateSPF' });
    param.bool({ value: options.validateDMARC, name: 'validateDMARC' });
    param.bool({ value: options.validateDKIM, name: 'validateDKIM' });
    param.bool({ value: options.validateMX, name: 'validateMX' });
    param.bool({ value: options.validateSMTP, name: 'validateSMTP' });

    EmailParser.#cachedOptions.cache(options);
  }

  static #parseEmail(email) {
    const value = email.toLowerCase().trim();
    const split = value.split('@');
    const domain = split[1];
    const local = split[0];

    if (!domain || !local) {
      throw new SaltoolsError(`Email ${email} inválido`);
    }

    return { value, domain, local };
  }

  static #validateDisposable(email, allowDisposable) {
    if (!allowDisposable && EmailParser.#DISPOSABLE_DOMAINS.includes(email.domain)) {
      throw new SaltoolsError(
        `Email ${email.value} é um email temporário e o parâmetro allowDisposable é false`
      );
    }
  }

  static #validateAlias(email, allowAlias) {
    if (!allowAlias && EmailParser.#isAlias(email)) {
      throw new SaltoolsError(`Email ${email.value} é um alias e o parâmetro allowAlias é false`);
    }
  }

  static #isAlias(email) {
    if (!EmailParser.#ALIAS_DOMAINS.includes(email.domain)) {
      return false;
    }
    return ['+', '.'].some((char) => email.local.includes(char));
  }

  static #validateSyntax(email) {
    if (!validator.isEmail(email.value)) {
      throw new SaltoolsError('Email inválido');
    }
  }
}

const fwf = FwfParser.parse.bind(FwfParser);
const doc = DocParser.parse.bind(DocParser);
const date = DateParser.parse.bind(DateParser);
const email = EmailParser.parse.bind(EmailParser);

var index$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  csv: csv,
  date: date,
  doc: doc,
  email: email,
  fwf: fwf,
  integer: integer,
  number: number,
  phone: parsePhone,
  string: string
});

function timestamp() {
  const now = new Date();
  const pad = (value) => String(value).padStart(2, '0');

  const day = pad(now.getDate());
  const month = pad(now.getMonth() + 1);
  const year = now.getFullYear();
  const hours = pad(now.getHours());
  const minutes = pad(now.getMinutes());
  const seconds = pad(now.getSeconds());
  const milliseconds = pad(now.getMilliseconds());

  return `${day}-${month}-${year}-${hours}h-${minutes}m-${seconds}s-${milliseconds}ms`;
}

class ErrorLogger {
  run(error, {
    directory = undefined,
    filename = undefined,
    addTimestamp = true,
    print = true,
    throwError = false,
  } = {}) {
    this.#validateParameters({ error, directory, filename, print, addTimestamp, throwError });
    const parsedError = this.#parseError(error);
    this.#saveLog({ parsedError, directory, filename, addTimestamp });
    if (print) console.error(parsedError);
    if (throwError) throw error;
  }

  #validateParameters({ error, directory, filename, print, addTimestamp, throwError }) {
    param.error({ value: error, name: 'error', required: true });
    param.string({ value: directory, name: 'directory' });
    param.string({ value: filename, name: 'filename' });
    param.bool({ value: print, name: 'print' });
    param.bool({ value: addTimestamp, name: 'addTimestamp' });
    param.bool({ value: throwError, name: 'throwError' });

    if ((!directory && filename) || (directory && !filename)) {
      throw new SaltoolsError('directory e filename devem ser ambos fornecidos ou ambos não fornecidos');
    }

    if (addTimestamp && (!directory || !filename)) {
      throw new SaltoolsError('directory e filename são obrigatórios quando addTimestamp é true');
    }
  }

  #saveLog({ parsedError, directory, filename, addTimestamp }) {
    if (!directory || !filename) return;
    const stamp = addTimestamp ? `-${timestamp()}` : '';
    const filePath = path.join(directory, `${filename}${stamp}.log`);
    fs.writeFileSync(filePath, parsedError);
  }

  #parseError(error) {
    const code = error.code || '';
    const stack = error.stack ? `stack: ${error.stack}` : '';
    return `${code} ${error.message}\n${stack}`;
  }
}

class LogSaver {
  run(content, {
    directory = undefined,
    filename = undefined,
    addTimestamp = true,
  } = {}) {
    this.#validateParameters({ content, directory, filename, addTimestamp });
    const stamp = addTimestamp ? `-${timestamp()}` : '';
    const filePath = path.join(directory, `${filename}${stamp}.log`);
    fs.writeFileSync(filePath, content);
  }

  #validateParameters({ content, directory, filename, addTimestamp }) {
    param.string({ value: content, name: 'content', required: true });
    param.string({ value: directory, name: 'directory', required: true });
    param.string({ value: filename, name: 'filename', required: true });
    param.bool({ value: addTimestamp, name: 'addTimestamp' });
  }
}

const errorLogger = new ErrorLogger();
const logSaver = new LogSaver();

const error = errorLogger.run.bind(errorLogger);
const saveLog = logSaver.run.bind(logSaver);

var index = /*#__PURE__*/Object.freeze({
  __proto__: null,
  error: error,
  saveLog: saveLog
});

function helloWorld() {
  console.log("Hello, World!");
}

const errors = { SaltoolsError };

export { errors, helloWorld, index as log, index$1 as parse, timestamp };
//# sourceMappingURL=index.js.map
