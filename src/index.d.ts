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
  string: (value: any, options?: {
    allowEmpty?: boolean;
    cast?: boolean;
    trim?: boolean;
    capitalize?: boolean;
    varName?: string | null;
    throwError?: boolean;
  }) => string | null;
  number: (value: any, options?: {
    allowEmptyString?: boolean;
    allowNull?: boolean;
    allowNegative?: boolean;
    allowZero?: boolean;
    varName?: string | null;
    throwError?: boolean;
  }) => number | null;
  integer: (value: any, options?: {
    allowEmptyString?: boolean;
    allowNull?: boolean;
    allowNegative?: boolean;
    allowZero?: boolean;
    varName?: string | null;
    throwError?: boolean;
  }) => number | null;
  csv: (path: string, options?: {
    delimiter?: string;
    quoteChar?: string;
    escapeChar?: string;
    throwError?: boolean;
  }) => any;
  phone: (phone: string, options?: {
    addCountryCode?: boolean;
    addPlusPrefix?: boolean;
    addAreaCode?: boolean;
    numbersOnly?: boolean;
    throwError?: boolean;
  }) => string | null;
  date: (value: any, options?: {
    inputFormat?: string;
    outputFormat?: string;
    throwError?: boolean;
  }) => any;
  email: (value: any, options?: {
    allowAlias?: boolean;
    allowDisposable?: boolean;
    validateSPF?: boolean;
    validateDMARC?: boolean;
    validateDKIM?: boolean;
    validateMX?: boolean;
    validateSMTP?: boolean;
    throwError?: boolean;
  }) => Promise<string | null>;
  doc: (doc: string | number, options?: {
    numbersOnly?: boolean;
    type?: 'cpf' | 'cnpj';
    throwError?: boolean;
  }) => string | null;
};

export const log: {
  error: (error: Error, options?: {
    directory?: string | null;
    filename?: string | null;
    addTimestamp?: boolean;
    print?: boolean;
    throwError?: boolean;
  }) => void;
  saveLog: (content: string, options?: {
    directory?: string | null;
    filename?: string | null;
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

