import DateConfig from './date-config.js';
import ConfigSetter from 'src/helper/config-setter.js';

export default class Config {
  static #config = {};

  static date = DateConfig;

  static throwError(value) {
    ConfigSetter.setBool('throwError', value, this.#config);
  }

  static get() {
    return this.#config;
  }

  static reset() {
    this.#config = {};
    this.date.reset();
  }
}
