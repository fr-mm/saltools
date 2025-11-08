import fs from 'fs';
import path from 'path';
import timestamp from 'src/commands/timestamp.js';
import { param } from 'src/helper/index.js';
import OptionsService from 'src/helper/options-service.js';

export default class LogSaver {
  static #DEFAULT_OPTIONS = {
    directory: undefined,
    filename: undefined,
    addTimestamp: true,
  };

  static run(content, options = {}) {
    options = OptionsService.update(options, this.#DEFAULT_OPTIONS, 'log.saveLog');
    LogSaver.#validateParameters(content, options);
    const stamp = options.addTimestamp ? `-${timestamp()}` : '';
    const filePath = path.join(options.directory, `${options.filename}${stamp}.log`);
    fs.writeFileSync(filePath, content);
  }

  static #validateParameters(content, options) {
    param.string({ value: content, name: 'content', required: true });
    param.string({ value: options.directory, name: 'directory', required: true });
    param.string({ value: options.filename, name: 'filename', required: true });
    param.bool({ value: options.addTimestamp, name: 'addTimestamp' });
  }
}
