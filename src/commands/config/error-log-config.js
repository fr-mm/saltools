import ConfigSetter from 'src/helper/config-setter.js';

export default class ErrorLogConfig {
  static #config = {};

  static directory(value) {
    ConfigSetter.setString('directory', value, this.#config);
  }

  static filename(value) {
    ConfigSetter.setString('filename', value, this.#config);
  }

  static addTimestamp(value) {
    ConfigSetter.setBool('addTimestamp', value, this.#config);
  }

  static print(value) {
    ConfigSetter.setBool('print', value, this.#config);
  }

  static throwError(value) {
    ConfigSetter.setBool('throwError', value, this.#config);
  }

  static get() {
    return this.#config;
  }

  static reset() {
    this.#config = {};
  }
}
