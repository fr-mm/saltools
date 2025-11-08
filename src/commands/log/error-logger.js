import fs from 'fs';
import path from 'path';
import timestamp from 'src/commands/timestamp.js';
import SaltoolsError from 'src/errors/saltools-error.js';
import { param } from 'src/helper/index.js';
import OptionsService from 'src/helper/options-service.js';
import ErrorLogConfig from 'src/commands/config/error-log-config.js';

export default class ErrorLogger {
  static #DEFAULT_OPTIONS = {
    directory: undefined,
    filename: undefined,
    addTimestamp: true,
    print: true,
    throwError: false,
  };

  static run(error, options = {}) {
    options = OptionsService.update({
      options,
      default: this.#DEFAULT_OPTIONS,
      specificConfig: ErrorLogConfig,
    });
    ErrorLogger.#validateParameters(error, options);
    const parsedError = ErrorLogger.#parseError(error);
    ErrorLogger.#saveLog({
      parsedError,
      directory: options.directory,
      filename: options.filename,
      addTimestamp: options.addTimestamp,
    });
    if (options.print) console.error(parsedError);
    if (options.throwError) throw error;
  }

  static #validateParameters(error, options) {
    param.error({ value: error, name: 'error', required: true });
    param.string({ value: options.directory, name: 'directory' });
    param.string({ value: options.filename, name: 'filename' });
    param.bool({ value: options.print, name: 'print' });
    param.bool({ value: options.addTimestamp, name: 'addTimestamp' });
    param.bool({ value: options.throwError, name: 'throwError' });

    if ((!options.directory && options.filename) || (options.directory && !options.filename)) {
      throw new SaltoolsError(
        'directory e filename devem ser ambos fornecidos ou ambos não fornecidos'
      );
    }

    if (options.addTimestamp && (!options.directory || !options.filename)) {
      throw new SaltoolsError('directory e filename são obrigatórios quando addTimestamp é true');
    }
  }

  static #saveLog({ parsedError, directory, filename, addTimestamp }) {
    if (!directory || !filename) return;
    if (directory && !fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }
    const stamp = addTimestamp ? `-${timestamp()}` : '';
    const filePath = path.join(directory, `${filename}${stamp}.log`);
    fs.writeFileSync(filePath, parsedError);
  }

  static #parseError(error) {
    const code = error.code || '';
    const stack = error.stack ? `stack: ${error.stack}` : '';
    return `${code} ${error.message}\n${stack}`;
  }
}
