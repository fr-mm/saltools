import SaltoolsError from 'src/errors/saltools-error.js';
import { param } from 'src/helper/index.js';

export default class DateToStringParser {
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
