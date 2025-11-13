import fs from 'fs';
import path from 'path';
import timestamp from 'src/commands/timestamp.js';
import { param } from 'src/helper/index.js';
import OptionsService from 'src/helper/options-service.js';
import SaveLogConfig from 'src/commands/config/save-log-config.js';

export default class LogSaver {
  static #DEFAULT_OPTIONS = {
    directory: undefined,
    filename: undefined,
    addTimestamp: true,
    print: true,
  };

  static run(content, options = {}) {
    options = OptionsService.update({
      options,
      default: this.#DEFAULT_OPTIONS,
      specificConfig: SaveLogConfig,
    });
    LogSaver.#validateParameters(content, options);
    if (options.print) console.log(content);
    if (options.directory) {
      fs.mkdirSync(options.directory, { recursive: true });
    }
    const stamp = options.addTimestamp ? `-${timestamp()}` : '';
    const filePath = path.join(options.directory, `${options.filename}${stamp}.log`);
    fs.writeFileSync(filePath, content);
  }

  static #validateParameters(content, options) {
    param.string({ value: content, name: 'content', required: true });
    param.string({ value: options.directory, name: 'directory', required: true });
    param.string({ value: options.filename, name: 'filename', required: true });
    param.bool({ value: options.addTimestamp, name: 'addTimestamp' });
    param.bool({ value: options.print, name: 'print' });
  }
}
