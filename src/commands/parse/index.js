import string from './parse-string.js';
import { number, integer } from './parse-number.js';
import csv from './parse-csv/index.js';
import phone from './parse-phone.js';
import { date } from './parse-date/index.js';
import { email } from './parse-email/index.js';
import DocParser from './doc-parser.js';

const docParser = new DocParser();

function doc(doc, {
  numbersOnly = true,
  throwError = true,
} = {}) {
  return docParser.parse(doc, { numbersOnly, throwError });
}

export { string, number, integer, csv, phone, date, email, doc };