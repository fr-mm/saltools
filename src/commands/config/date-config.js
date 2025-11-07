import ConfigSetter from 'src/helper/config-setter.js';

export default class DateConfig {
  static #config = {};

  static inputFormat(value) {
    ConfigSetter.setString('inputFormat', value, this.#config);
  }

  static outputFormat(value) {
    ConfigSetter.setString('outputFormat', value, this.#config);
  }

  static get() {
    return this.#config;
  }

  static reset() {
    this.#config = {};
  }
}
