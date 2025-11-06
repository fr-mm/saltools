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
        `Valor inválido para ${key}. Tipo ${typeof value} não é boolean. Valor: ${value}`
      );
    }
    this.#config[key] = value;
  }

  static reset() {
    this.#config = {};
  }
}
