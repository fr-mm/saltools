import CSVParser from './csv-parser.js';

export default function csv(path, options = {}) {
  return new CSVParser(path, options).parse();
}
