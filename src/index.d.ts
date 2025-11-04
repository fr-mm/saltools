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
  [key: string]: any;
}

export interface EmailParseOptions {
  [key: string]: any;
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
  string: (value: any, options?: StringParseOptions) => string | null;
  number: (value: any, options?: NumberParseOptions) => number | null;
  integer: (value: any, options?: IntegerParseOptions) => number | null;
  csv: (path: string, options?: CSVParseOptions) => any;
  phone: (phone: string, options?: PhoneParseOptions) => string | null;
  date: (value: any, options?: DateParseOptions) => any;
  email: (value: any, options?: EmailParseOptions) => any;
  doc: (doc: string | number, options?: DocParseOptions) => string | null;
};

export const log: {
  error: (error: Error, options?: ErrorLoggerOptions) => void;
  saveLog: (content: string, options?: LogSaverOptions) => void;
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

