import string from './parse-string.js';
import { number, integer } from './parse-number.js';
import csv from './parse-csv/index.js';
import phone from './parse-phone.js';
import DateParser from './parse-date/date-parser.js';
import FwfParser from './fwf-parser.js';
import DocParser from './doc-parser.js';
import EmailParser from './email-parser.js';
import DNSParser from './parse-dns.js';

export const fwf = FwfParser.parse.bind(FwfParser);
export const doc = DocParser.parse.bind(DocParser);
export const date = DateParser.parse.bind(DateParser);
export const email = EmailParser.parse.bind(EmailParser);
export const dns = DNSParser.parse.bind(DNSParser);

export { string, number, integer, csv, phone };
