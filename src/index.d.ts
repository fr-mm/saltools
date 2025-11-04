export interface StringParseOptions {
  allowEmpty?: boolean;
  cast?: boolean;
  trim?: boolean;
  capitalize?: boolean;
  varName?: string | null;
  throwError?: boolean;
}

export interface NumberParseOptions {
  allowEmptyString?: boolean;
  allowNull?: boolean;
  allowNegative?: boolean;
  allowZero?: boolean;
  varName?: string | null;
  throwError?: boolean;
}

export interface IntegerParseOptions {
  allowEmptyString?: boolean;
  allowNull?: boolean;
  allowNegative?: boolean;
  allowZero?: boolean;
  varName?: string | null;
  throwError?: boolean;
}

export interface CSVParseOptions {
  delimiter?: string;
  quoteChar?: string;
  escapeChar?: string;
  throwError?: boolean;
}

export interface PhoneParseOptions {
  addCountryCode?: boolean;
  addPlusPrefix?: boolean;
  addAreaCode?: boolean;
  numbersOnly?: boolean;
  throwError?: boolean;
}

export interface DateParseOptions {
  inputFormat?: string;
  outputFormat?: string;
  throwError?: boolean;
}

export interface EmailParseOptions {
  allowAlias?: boolean;
  allowDisposable?: boolean;
  validateSPF?: boolean;
  validateDMARC?: boolean;
  validateDKIM?: boolean;
  validateMX?: boolean;
  validateSMTP?: boolean;
  throwError?: boolean;
}

export interface DocParseOptions {
  numbersOnly?: boolean;
  type?: 'cpf' | 'cnpj';
  throwError?: boolean;
}

export interface ErrorLoggerOptions {
  directory?: string | null;
  filename?: string | null;
  addTimestamp?: boolean;
  print?: boolean;
  throwError?: boolean;
}

export interface LogSaverOptions {
  directory?: string | null;
  filename?: string | null;
  addTimestamp?: boolean;
}

export const parse: {
  /** @param value - The value to parse
   *  @param options - Options object
   *  @param options.allowEmpty - Default: false
   *  @param options.cast - Default: false
   *  @param options.trim - Default: true
   *  @param options.capitalize - Default: false
   *  @param options.varName - Default: null
   *  @param options.throwError - Default: true */
  string: (value: any, options?: {
    /** @default false */
    allowEmpty?: boolean;
    /** @default false */
    cast?: boolean;
    /** @default true */
    trim?: boolean;
    /** @default false */
    capitalize?: boolean;
    /** @default null */
    varName?: string | null;
    /** @default true */
    throwError?: boolean;
  }) => string | null;
  /** @param value - The value to parse
   *  @param options - Options object
   *  @param options.allowEmptyString - Default: false
   *  @param options.allowNull - Default: false
   *  @param options.allowNegative - Default: false
   *  @param options.allowZero - Default: false
   *  @param options.varName - Default: null
   *  @param options.throwError - Default: true */
  number: (value: any, options?: {
    /** @default false */
    allowEmptyString?: boolean;
    /** @default false */
    allowNull?: boolean;
    /** @default false */
    allowNegative?: boolean;
    /** @default false */
    allowZero?: boolean;
    /** @default null */
    varName?: string | null;
    /** @default true */
    throwError?: boolean;
  }) => number | null;
  /** @param value - The value to parse
   *  @param options - Options object
   *  @param options.allowEmptyString - Default: false
   *  @param options.allowNull - Default: false
   *  @param options.allowNegative - Default: false
   *  @param options.allowZero - Default: false
   *  @param options.varName - Default: null
   *  @param options.throwError - Default: true */
  integer: (value: any, options?: {
    /** @default false */
    allowEmptyString?: boolean;
    /** @default false */
    allowNull?: boolean;
    /** @default false */
    allowNegative?: boolean;
    /** @default false */
    allowZero?: boolean;
    /** @default null */
    varName?: string | null;
    /** @default true */
    throwError?: boolean;
  }) => number | null;
  /** @param path - The CSV file path
   *  @param options - Options object
   *  @param options.delimiter - Default: ','
   *  @param options.quoteChar - Default: '"'
   *  @param options.escapeChar - Default: '\\'
   *  @param options.throwError - Default: true */
  csv: (path: string, options?: {
    /** @default ',' */
    delimiter?: string;
    /** @default '"' */
    quoteChar?: string;
    /** @default '\\' */
    escapeChar?: string;
    /** @default true */
    throwError?: boolean;
  }) => any;
  /** @param phone - The phone number to parse
   *  @param options - Options object
   *  @param options.addCountryCode - Default: true
   *  @param options.addPlusPrefix - Default: false
   *  @param options.addAreaCode - Default: true
   *  @param options.numbersOnly - Default: true
   *  @param options.throwError - Default: true */
  phone: (phone: string, options?: {
    /** @default true */
    addCountryCode?: boolean;
    /** @default false */
    addPlusPrefix?: boolean;
    /** @default true */
    addAreaCode?: boolean;
    /** @default true */
    numbersOnly?: boolean;
    /** @default true */
    throwError?: boolean;
  }) => string | null;
  /** @param value - The date value to parse
   *  @param options - Options object
   *  @param options.inputFormat - Default: 'iso'
   *  @param options.outputFormat - Default: 'iso'
   *  @param options.throwError - Default: true */
  date: (value: any, options?: {
    /** @default 'iso' */
    inputFormat?: string;
    /** @default 'iso' */
    outputFormat?: string;
    /** @default true */
    throwError?: boolean;
  }) => any;
  /** @param value - The email to parse
   *  @param options - Options object
   *  @param options.allowAlias - Default: false
   *  @param options.allowDisposable - Default: false
   *  @param options.validateSPF - Default: true
   *  @param options.validateDMARC - Default: true
   *  @param options.validateDKIM - Default: true
   *  @param options.validateMX - Default: true
   *  @param options.validateSMTP - Default: true
   *  @param options.throwError - Default: true */
  email: (value: any, options?: {
    /** @default false */
    allowAlias?: boolean;
    /** @default false */
    allowDisposable?: boolean;
    /** @default true */
    validateSPF?: boolean;
    /** @default true */
    validateDMARC?: boolean;
    /** @default true */
    validateDKIM?: boolean;
    /** @default true */
    validateMX?: boolean;
    /** @default true */
    validateSMTP?: boolean;
    /** @default true */
    throwError?: boolean;
  }) => Promise<string | null>;
  /** @param doc - The document to parse (CPF or CNPJ)
   *  @param options - Options object
   *  @param options.numbersOnly - Default: true
   *  @param options.type - Document type: 'cpf' or 'cnpj'
   *  @param options.throwError - Default: true */
  doc: (doc: string | number, options?: {
    /** @default true */
    numbersOnly?: boolean;
    type?: 'cpf' | 'cnpj';
    /** @default true */
    throwError?: boolean;
  }) => string | null;
};

export const log: {
  /** @param error - The error object to log
   *  @param options - Options object
   *  @param options.directory - Directory to save log file. Default: null
   *  @param options.filename - Filename for log file. Default: null
   *  @param options.addTimestamp - Add timestamp to filename. Default: true
   *  @param options.print - Print error to console. Default: true
   *  @param options.throwError - Re-throw the error after logging. Default: false */
  error: (error: Error, options?: {
    /** @default null */
    directory?: string | null;
    /** @default null */
    filename?: string | null;
    /** @default true */
    addTimestamp?: boolean;
    /** @default true */
    print?: boolean;
    /** @default false */
    throwError?: boolean;
  }) => void;
  /** @param content - The content to save
   *  @param options - Options object
   *  @param options.directory - Directory to save log file. Default: null
   *  @param options.filename - Filename for log file. Default: null
   *  @param options.addTimestamp - Add timestamp to filename. Default: true */
  saveLog: (content: string, options?: {
    /** @default null */
    directory?: string | null;
    /** @default null */
    filename?: string | null;
    /** @default true */
    addTimestamp?: boolean;
  }) => void;
};

export function timestamp(): string;

export function helloWorld(): void;

export class SaltoolsError extends Error {
  constructor(message: string, options?: any);
  name: string;
  options: any;
}

export const errors: {
  SaltoolsError: typeof SaltoolsError;
};

