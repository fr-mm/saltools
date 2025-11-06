import SaltoolsError from 'src/errors/saltools-error.js';

export default class Config {
  static #config = {};

  static throwError(value) {
    this.#setBool('throwError', value);
  }

  static get() {
    return this.#config;
  }

  static #setBool(key, value) {
    if (typeof value !== 'boolean') {
      throw new SaltoolsError(
        `Invalid value for ${key}. Type ${typeof value} is not boolean. Value: ${value}`
      );
    }
    this.#config[key] = value;
  }

  static reset() {
    this.#config = {};
  }
}
