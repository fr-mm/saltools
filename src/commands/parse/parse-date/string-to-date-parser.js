import SaltoolsError from 'src/errors/saltools-error.js';
import { param } from 'src/helper/index.js';

export default class StringToDateParser {
  static #lastFormat = null;
  static #formatCache = null;

  parse(date, format) {
    this.#validateParams(date, format);
    date = date.trim();
    format = format.trim();
    return format.toLowerCase() === 'iso' ? this.#parseIso(date) : this.#parseCustomFormat(date, format);
  }

  #validateParams(date, format) {
    param.string({ value: date, name: 'date', required: true });
    param.string({ value: format, name: 'format', required: true });
  }

  #parseIso(date) {
    const parsed = new Date(date);
    if (isNaN(parsed.getTime())) {
      throw new SaltoolsError(`Data inválida: ${date}`);
    }
    return parsed;
  }

  #parseCustomFormat(date, format) {
    let separator, formatParts, indices;

    if (StringToDateParser.#lastFormat === format) {
      ({ separator, formatParts, indices } = StringToDateParser.#formatCache);
    } else {
      this.#validateFormat(format);
      const extracted = this.#extractSeparatorFromFormat(format);
      separator = extracted.separator;
      formatParts = extracted.formatParts;
      indices = this.#findFormatIndices(formatParts);
      
      StringToDateParser.#lastFormat = format;
      StringToDateParser.#formatCache = { separator, formatParts, indices };
    }

    this.#validateSeparatorMatch(separator, date);
    const parts = this.#extractParts(date, separator, formatParts);
    const { day, month, year } = this.#parseDateValues(parts, indices, formatParts, date);
    return this.#createAndValidateDate(day, month, year, date);
  }

  #extractSeparatorFromFormat(format) {
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
      formatParts = this.#parseFormatWithoutSeparator(format);
    }
    
    if (formatParts.length !== 3) {
      throw new SaltoolsError(`Formato inválido: ${format}`);
    }

    return { separator, formatParts };
  }

  #parseFormatWithoutSeparator(format) {
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

  #validateSeparatorMatch(formatSeparator, date) {
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

  #extractParts(date, separator, formatParts) {
    if (separator) {
      const parts = date.split(separator);
      
      if (parts.length !== 3) {
        throw new SaltoolsError(`Formato de data inválido: ${date}`);
      }

      return parts;
    }

    return this.#extractPartsWithoutSeparator(date, formatParts);
  }

  #extractPartsWithoutSeparator(date, formatParts) {
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

  #findFormatIndices(formatParts) {
    const dayIndex = formatParts.findIndex(p => p.toLowerCase().includes('d'));
    const monthIndex = formatParts.findIndex(p => p.toLowerCase().includes('m'));
    const yearIndex = formatParts.findIndex(p => p.toLowerCase().includes('y'));

    if (dayIndex === -1 || monthIndex === -1 || yearIndex === -1) {
      throw new SaltoolsError(`Formato inválido: formato deve conter d, m e y`);
    }

    return { dayIndex, monthIndex, yearIndex };
  }

  #parseDateValues(parts, indices, formatParts, originalDate) {
    let day = parseInt(parts[indices.dayIndex], 10);
    let month = parseInt(parts[indices.monthIndex], 10);
    let year = parseInt(parts[indices.yearIndex], 10);

    if (isNaN(day) || isNaN(month) || isNaN(year)) {
      throw new SaltoolsError(`Data inválida: ${originalDate}`);
    }

    const yearFormat = formatParts[indices.yearIndex].toLowerCase();
    if (yearFormat.length === 2) {
      year = this.#convertTwoDigitYear(year);
    }

    month = month - 1;

    return { day, month, year };
  }

  #createAndValidateDate(day, month, year, originalDate) {
    const parsed = new Date(year, month, day);
    
    if (parsed.getDate() !== day || parsed.getMonth() !== month || parsed.getFullYear() !== year) {
      throw new SaltoolsError(`Data inválida: ${originalDate}`);
    }

    return parsed;
  }

  #validateFormat(format) {
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

  #convertTwoDigitYear(year) {
    const currentYear = new Date().getFullYear();
    const century = Math.floor(currentYear / 100) * 100;
    return year < 50 ? century + year : century - 100 + year;
  }
}