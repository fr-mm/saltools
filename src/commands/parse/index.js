import DateParser from './parse-date/date-parser.js';
import FwfParser from './fwf-parser.js';
import DocParser from './doc-parser.js';
import EmailParser from './email-parser.js';
import DNSParser from './parse-dns.js';
import StringParser from './parse-string.js';
import NumberParser from './parse-number.js';
import PhoneParser from './parse-phone.js';
import CSVParser from './parse-csv/csv-parser.js';

export const fwf = FwfParser.parse.bind(FwfParser);
export const doc = DocParser.parse.bind(DocParser);
export const date = DateParser.parse.bind(DateParser);
export const email = EmailParser.parse.bind(EmailParser);
export const dns = DNSParser.parse.bind(DNSParser);
export const string = StringParser.parse.bind(StringParser);
export const number = NumberParser.parseNumber.bind(NumberParser);
export const integer = NumberParser.parseInteger.bind(NumberParser);
export const phone = PhoneParser.parse.bind(PhoneParser);
export const csv = (path, options = {}) => {
  const parser = new CSVParser(path, options);
  return parser.parse();
};
