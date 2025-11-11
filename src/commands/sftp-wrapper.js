import { param } from 'src/helper/index.js';
import OptionsService from 'src/helper/options-service.js';
import SaltoolsError from 'src/errors/saltools-error.js';

export default class SFTPWrapper {
  static #DEFAULT_OPTIONS = {
    port: 22,
    username: undefined,
    password: undefined,
    readyTimeout: 10000,
  };

  static #options = {};
  static #client = undefined;
  static #connected = false;

  static get client() {
    return this.#client;
  }

  static configure({ client, host, port, username, password, readyTimeout }) {
    const options = OptionsService.update({
      options: { host, port, username, password, readyTimeout },
      default: this.#DEFAULT_OPTIONS,
    });
    this.#validateConfiguration({ client, options });
    this.#options = options;
    this.#client = client;
  }

  static async connect() {
    if (this.#connected) return;

    try {
      await this.#client.connect({
        host: this.#options.host,
        username: this.#options.username,
        password: this.#options.password,
        port: this.#options.port,
        readyTimeout: this.#options.readyTimeout,
      });
      this.#connected = true;
    } catch (error) {
      throw new SaltoolsError(`Erro ao estabelecer conexão com SFTP: ${error.message}`);
    }
  }

  static async disconnect() {
    if (!this.#connected) return;

    try {
      await this.#client.end();
      this.#connected = false;
    } catch (error) {
      if (error.code === 'ECONNRESET') {
        this.#connected = false;
        return;
      }
      throw new SaltoolsError(`Erro ao desconectar do SFTP: ${error.message}`);
    }
  }

  static async testConnection() {
    await this.connect();
    await this.disconnect();
    console.log('[OK] Conexão estabelecida com SFTP');
    return true;
  }

  static #validateConfiguration({ client, options }) {
    param.object({ value: client, name: 'client', required: true });
    param.string({ value: options.host, name: 'host', required: true });
    param.string({ value: options.username, name: 'username', required: true });
    param.string({ value: options.password, name: 'password', required: true });
    param.number({ value: options.port, name: 'port' });
    param.number({ value: options.readyTimeout, name: 'readyTimeout' });
  }
}
