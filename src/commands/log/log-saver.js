import fs from 'fs';
import path from 'path';
import timestamp from 'src/commands/timestamp.js';
import { param } from 'src/helper/index.js';

export default class LogSaver {
  run(content, {
    directory = null,
    filename = null,
    addTimestamp = true,
  } = {}) {
    this.#validateParameters({ content, directory, filename, addTimestamp });
    const stamp = addTimestamp ? `-${timestamp()}` : '';
    const filePath = path.join(directory, `${filename}${stamp}.log`);
    fs.writeFileSync(filePath, content);
  }

  #validateParameters({ content, directory, filename, addTimestamp }) {
    param.string({ value: content, name: 'content', required: true });
    param.string({ value: directory, name: 'directory', required: true });
    param.string({ value: filename, name: 'filename', required: true });
    param.bool({ value: addTimestamp, name: 'addTimestamp' });
  }
}
