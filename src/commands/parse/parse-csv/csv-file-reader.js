import fs from 'fs';
import SaltoolsError from 'src/errors/saltools-error.js';

export default class CSVFileReader {
  constructor(path) {
    this.path = path;
  }

  read() {
    this._validatePath();
    this._validateExtension();
    return fs.readFileSync(this.path, 'utf8');
  }

  _validatePath() {
    if (!fs.existsSync(this.path)) {
      throw new SaltoolsError(`Arquivo ${this.path} não encontrado`);
    }
  }
  
  _validateExtension() {  
    if (!this.path.toLowerCase().endsWith('.csv')) {
      throw new SaltoolsError(`Arquivo ${this.path} não é um arquivo CSV`);
    }
  }
}