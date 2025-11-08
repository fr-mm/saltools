import DateConfig from './date-config.js';
import ErrorLogConfig from './error-log-config.js';
import SaveLogConfig from './save-log-config.js';
import ConfigSetter from 'src/helper/config-setter.js';

export default class Config {
  static #config = {};

  static date = DateConfig;
  static log = {
    error: ErrorLogConfig,
    save: SaveLogConfig,
  };

  static throwError(value) {
    ConfigSetter.setBool('throwError', value, this.#config);
  }

  static get() {
    return this.#config;
  }

  static reset() {
    this.#config = {};
    this.date.reset();
    this.log.error.reset();
    this.log.save.reset();
  }
}
