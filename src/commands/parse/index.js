import string from './parse-string.js';
import { number, integer } from './parse-number.js';
import csv from './parse-csv/index.js';
import phone from './parse-phone.js';
import { date } from './parse-date/index.js';
import { email } from './parse-email/index.js';
import FwfParser from './fwf-parser.js';
import DocParser from './doc-parser.js';

const fwfParser = new FwfParser();

export const fwf = fwfParser.parse.bind(fwfParser);
export const doc = DocParser.parse.bind(DocParser);

export { string, number, integer, csv, phone, date, email };
