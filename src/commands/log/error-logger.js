import fs from 'fs';
import path from 'path';
import timestamp from 'src/commands/timestamp.js';
import SaltoolsError from 'src/errors/saltools-error.js';
import { param } from 'src/helper/index.js';

export default class ErrorLogger {
  run(error, {
    directory = null,
    filename = null,
    addTimestamp = true,
    print = true,
    throwError = false,
  } = {}) {
    this.#validateParameters({ error, directory, filename, print, addTimestamp, throwError });
    const parsedError = this.#parseError(error);
    this.#saveLog({ parsedError, directory, filename, addTimestamp });
    if (print) console.error(parsedError);
    if (throwError) throw error;
  }

  #validateParameters({ error, directory, filename, print, addTimestamp, throwError }) {
    param.error({ value: error, name: 'error', required: true });
    param.string({ value: directory, name: 'directory' });
    param.string({ value: filename, name: 'filename' });
    param.bool({ value: print, name: 'print' });
    param.bool({ value: addTimestamp, name: 'addTimestamp' });
    param.bool({ value: throwError, name: 'throwError' });

    if ((!directory && filename) || (directory && !filename)) {
      throw new SaltoolsError('directory e filename devem ser ambos fornecidos ou ambos não fornecidos');
    }

    if (addTimestamp && (!directory || !filename)) {
      throw new SaltoolsError('directory e filename são obrigatórios quando addTimestamp é true');
    }
  }

  #saveLog({ parsedError, directory, filename, addTimestamp }) {
    if (!directory || !filename) return;
    const stamp = addTimestamp ? `-${timestamp()}` : '';
    const filePath = path.join(directory, `${filename}${stamp}.log`);
    fs.writeFileSync(filePath, parsedError);
  }

  #parseError(error) {
    const code = error.code || '';
    const stack = error.stack ? `stack: ${error.stack}` : '';
    return `${code} ${error.message}\n${stack}`;
  }
}