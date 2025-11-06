import DateParser from './parse-date/date-parser.js';
import FwfParser from './fwf-parser.js';
import DocParser from './doc-parser.js';
import EmailParser from './email-parser.js';
import DNSParser from './parse-dns.js';
import StringParser from './parse-string.js';
import NumberParser from './parse-number.js';
import PhoneParser from './parse-phone.js';
import CSVParser from './parse-csv/csv-parser.js';

export const parse = {
  fwf: FwfParser.parse.bind(FwfParser),
  doc: DocParser.parse.bind(DocParser),
  date: DateParser.parse.bind(DateParser),
  email: EmailParser.parse.bind(EmailParser),
  dns: DNSParser.parse.bind(DNSParser),
  string: StringParser.parse.bind(StringParser),
  number: NumberParser.parseNumber.bind(NumberParser),
  integer: NumberParser.parseInteger.bind(NumberParser),
  phone: PhoneParser.parse.bind(PhoneParser),
  csv: CSVParser.parse.bind(CSVParser),
};
