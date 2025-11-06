import fs from 'fs';
import path from 'path';
import timestamp from 'src/commands/timestamp.js';
import SaltoolsError from 'src/errors/saltools-error.js';
import { param } from 'src/helper/index.js';

export default class ErrorLogger {
  static run(
    error,
    {
      directory = undefined,
      filename = undefined,
      addTimestamp = true,
      print = true,
      throwError = false,
    } = {}
  ) {
    ErrorLogger.#validateParameters({
      error,
      directory,
      filename,
      print,
      addTimestamp,
      throwError,
    });
    const parsedError = ErrorLogger.#parseError(error);
    ErrorLogger.#saveLog({ parsedError, directory, filename, addTimestamp });
    if (print) console.error(parsedError);
    if (throwError) throw error;
  }

  static #validateParameters({ error, directory, filename, print, addTimestamp, throwError }) {
    param.error({ value: error, name: 'error', required: true });
    param.string({ value: directory, name: 'directory' });
    param.string({ value: filename, name: 'filename' });
    param.bool({ value: print, name: 'print' });
    param.bool({ value: addTimestamp, name: 'addTimestamp' });
    param.bool({ value: throwError, name: 'throwError' });

    if ((!directory && filename) || (directory && !filename)) {
      throw new SaltoolsError(
        'directory e filename devem ser ambos fornecidos ou ambos não fornecidos'
      );
    }

    if (addTimestamp && (!directory || !filename)) {
      throw new SaltoolsError('directory e filename são obrigatórios quando addTimestamp é true');
    }
  }

  static #saveLog({ parsedError, directory, filename, addTimestamp }) {
    if (!directory || !filename) return;
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
