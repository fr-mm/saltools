import { param } from 'src/helper/index.js';
import CSVParser from './csv-parser.js';

export default function csv(path, {
  delimiter = ',',
  quoteChar = '"',
  escapeChar = '\\',
  throwError = true
} = {}) {
  param.string({value: path, name: 'path'});
  param.string({value: delimiter, name: 'delimiter'});
  param.string({value: quoteChar, name: 'quoteChar'});
  param.string({value: escapeChar, name: 'escapeChar'});
  param.bool({value: throwError, name: 'throwError'});
  
  return new CSVParser(path, { delimiter, quoteChar, escapeChar, throwError }).parse();
}