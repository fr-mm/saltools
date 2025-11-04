import fs from 'fs';
import SaltoolsError from 'src/errors/saltools-error.js';

export default class CSVFileReader {
  constructor(path) {
    this.path = path;
  }

  read() {
    this.#validatePath();
    this.#validateExtension();
    return fs.readFileSync(this.path, 'utf8');
  }

  #validatePath() {
    if (!fs.existsSync(this.path)) {
      throw new SaltoolsError(`Arquivo ${this.path} não encontrado`);
    }
  }
  
  #validateExtension() {  
    if (!this.path.toLowerCase().endsWith('.csv')) {
      throw new SaltoolsError(`Arquivo ${this.path} não é um arquivo CSV`);
    }
  }
}