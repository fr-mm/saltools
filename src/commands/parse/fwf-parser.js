import fs from 'fs';
import SaltoolsError from 'src/errors/saltools-error.js';
import OptionsService from 'src/helper/options-service.js';

export default class FwfParser {
  static #DEFAULT_OPTIONS = {
    lineValidation: undefined,
  };

  static parse(path, fields, options = {}) {
    options = OptionsService.update(options, this.#DEFAULT_OPTIONS);
    this.#validateOptions(options);
    this.#validateFields(fields);
    const content = this.#readFile(path);
    return this.#parseContent(content, fields, options);
  }

  static #validateOptions(options) {
    if (options.lineValidation && typeof options.lineValidation !== 'function') {
      throw new SaltoolsError('lineValidation tem que ser uma function');
    }
  }

  static #parseContent(content, fields, options) {
    if (!content.trim()) return [];

    const lines = content.split(/\r?\n/);
    const parsedItems = [];

    for (const line of lines) {
      if (line === '' || !this.#lineIsValid(line, options.lineValidation)) continue;
      const item = this.#parseLine(line, fields);
      parsedItems.push(item);
    }
    return parsedItems;
  }

  static #lineIsValid(line, validation) {
    if (!validation) return true;
    return validation(line);
  }

  static #parseLine(line, fields) {
    const result = {};
    for (const field of fields) {
      const endIndex = Math.min(field.end + 1, line.length);
      const value = line.slice(field.start, endIndex).trim();
      result[field.key] = this.#cast(value, field.type);
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
      this.#validateField(field);
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
    if (field.end < field.start) {
      throw new SaltoolsError(
        `Field '${field.key}' must have end >= start. Got start: ${field.start}, end: ${field.end}`
      );
    }
  }
}
