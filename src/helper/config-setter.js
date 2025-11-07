import SaltoolsError from 'src/errors/saltools-error.js';

export default class ConfigSetter {
  static setBool(key, value, config) {
    this.#set(key, value, 'boolean', config);
  }

  static setString(key, value, config) {
    this.#set(key, value, 'string', config);
  }

  static setNumber(key, value, config) {
    this.#set(key, value, 'number', config);
  }

  static setFunction(key, value, config) {
    this.#set(key, value, 'function', config);
  }

  static setObject(key, value, config) {
    this.#set(key, value, 'object', config);
  }

  static setArray(key, value, config) {
    if (!Array.isArray(value)) {
      throw new SaltoolsError(
        `Valor inválido para ${key}. Tipo ${typeof value} não é array. Valor: ${value}`
      );
    }
    config[key] = value;
  }

  static #set(key, value, type, config) {
    if (typeof value !== type) {
      throw new SaltoolsError(
        `Valor inválido para ${key}. Tipo ${typeof value} não é ${type}. Valor: ${value}`
      );
    }
    config[key] = value;
  }
}
