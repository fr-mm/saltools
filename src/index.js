import ErrorLogger from './commands/log/error-logger.js';
import LogSaver from './commands/log/log-saver.js';
import timestamp from './commands/timestamp.js';
import helloWorld from './commands/hello-world.js';
import Config from './commands/config/config.js';
import DocParser from './commands/parse/doc-parser.js';
import DateParser from './commands/parse/parse-date/date-parser.js';
import CSVParser from './commands/parse/parse-csv/csv-parser.js';
import StringParser from './commands/parse/parse-string.js';
import NumberParser from './commands/parse/parse-number.js';
import PhoneParser from './commands/parse/parse-phone.js';
import DNSParser from './commands/parse/parse-dns.js';
import EmailParser from './commands/parse/email-parser.js';
import FwfParser from './commands/parse/fwf-parser.js';
import SaltoolsError from './errors/saltools-error.js';

export { timestamp, helloWorld };

export const log = {
  error: ErrorLogger.run.bind(ErrorLogger),
  saveLog: LogSaver.run.bind(LogSaver),
};

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

export const config = {
  get: Config.get.bind(Config),
  reset: Config.reset.bind(Config),
  throwError: Config.throwError.bind(Config),
  date: {
    inputFormat: Config.date.inputFormat.bind(Config.date),
    outputFormat: Config.date.outputFormat.bind(Config.date),
    get: Config.date.get.bind(Config.date),
    reset: Config.date.reset.bind(Config.date),
  },
};

export const errors = {
  SaltoolsError,
};
