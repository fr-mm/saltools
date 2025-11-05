import fs from 'fs';
import SaltoolsError from 'src/errors/saltools-error.js';

export default class FwfParser {
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
      result[field.key] = line.slice(field.start, end).trim();
    }
    return result;
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
