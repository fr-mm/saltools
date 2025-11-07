export interface StringParseOptions {
  allowEmpty?: boolean;
  cast?: boolean;
  trim?: boolean;
  capitalize?: boolean;
  varName?: string;
  throwError?: boolean;
}

export interface NumberParseOptions {
  allowEmptyString?: boolean;
  allowNull?: boolean;
  allowNegative?: boolean;
  allowZero?: boolean;
  varName?: string;
  throwError?: boolean;
}

export interface IntegerParseOptions {
  allowEmptyString?: boolean;
  allowNull?: boolean;
  allowNegative?: boolean;
  allowZero?: boolean;
  varName?: string;
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
  throwError?: boolean;
}

export interface DNSParseOptions {
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
  directory?: string;
  filename?: string;
  addTimestamp?: boolean;
  print?: boolean;
  throwError?: boolean;
}

export interface LogSaverOptions {
  directory?: string;
  filename?: string;
  addTimestamp?: boolean;
}

export interface FwfField {
  key: string;
  start: number;
  end: number;
  type?: 'number' | 'bool';
}

export interface FwfParseOptions {
  lineValidation?: (line: string) => boolean;
}

export function timestamp(): string;

export function helloWorld(): void;

export const log: {
  /** @param error - O objeto de erro a ser registrado
   *  @param options - Objeto de opções
   *  @param options.directory - Diretório para salvar o arquivo de log. Padrão: undefined
   *  @param options.filename - Nome do arquivo de log. Padrão: undefined
   *  @param options.addTimestamp - Adicionar timestamp ao nome do arquivo. Padrão: true
   *  @param options.print - Imprimir erro no console. Padrão: true
   *  @param options.throwError - Relançar o erro após o registro. Padrão: false */
  error: (
    error: Error,
    options?: {
      /** @default undefined */
      directory?: string;
      /** @default undefined */
      filename?: string;
      /** @default true */
      addTimestamp?: boolean;
      /** @default true */
      print?: boolean;
      /** @default false */
      throwError?: boolean;
    }
  ) => void;
  /** @param content - O conteúdo a ser salvo
   *  @param options - Objeto de opções
   *  @param options.directory - Diretório para salvar o arquivo de log. Padrão: undefined
   *  @param options.filename - Nome do arquivo de log. Padrão: undefined
   *  @param options.addTimestamp - Adicionar timestamp ao nome do arquivo. Padrão: true */
  saveLog: (
    content: string,
    options?: {
      /** @default undefined */
      directory?: string;
      /** @default undefined */
      filename?: string;
      /** @default true */
      addTimestamp?: boolean;
    }
  ) => void;
};

export const parse: {
  /** Faz o parse de um arquivo de largura fixa
   *  @param path - O caminho do arquivo de largura fixa
   *  @param fields - Array descrevendo os cortes dos campos
   *  Cada campo contém uma chave, índice inicial e índice final (inclusivo)
   *  @param options - Objeto de opções
   *  @param options.lineValidation - Função para validar se uma linha deve ser processada. Padrão: undefined */
  fwf(
    path: string,
    fields: FwfField[],
    options?: {
      /** Função para validar se uma linha deve ser processada. @default undefined */
      lineValidation?: (line: string) => boolean;
    }
  ): Array<Record<string, string | number | boolean>>;
  /** Faz o parse de um documento (CPF ou CNPJ)
   *  @param doc - O documento a ser parseado (CPF ou CNPJ)
   *  @param options - Objeto de opções
   *  @param options.numbersOnly - Retornar apenas números (sem formatação). Padrão: true
   *  @param options.type - Tipo de documento: 'cpf' ou 'cnpj'. Se undefined, inferirá pelo comprimento. Padrão: undefined
   *  @param options.throwError - Lançar erro se inválido, caso contrário retorna null. Padrão: true */
  doc(
    doc: string | number,
    options?: {
      /** Retornar apenas números (sem formatação). @default true */
      numbersOnly?: boolean;
      /** Tipo de documento: 'cpf' ou 'cnpj'. Se undefined, inferirá pelo comprimento. @default undefined */
      type?: 'cpf' | 'cnpj';
      /** Lançar erro se inválido, caso contrário retorna null. @default true */
      throwError?: boolean;
    }
  ): string | null;
  /** Faz o parse de um valor de data
   *  @param value - O valor de data a ser parseado
   *  @param options - Objeto de opções
   *  @param options.inputFormat - Padrão: 'iso'
   *  @param options.outputFormat - Padrão: 'iso'
   *  @param options.throwError - Padrão: true */
  date(
    value: any,
    options?: {
      /** @default 'iso' */
      inputFormat?: string;
      /** @default 'iso' */
      outputFormat?: string;
      /** @default true */
      throwError?: boolean;
    }
  ): string | null;
  /** Faz o parse de um endereço de email
   *  @param value - O email a ser parseado
   *  @param options - Objeto de opções
   *  @param options.allowAlias - Padrão: true
   *  @param options.allowDisposable - Padrão: false
   *  @param options.throwError - Padrão: true */
  email(
    value: any,
    options?: {
      /** @default true */
      allowAlias?: boolean;
      /** @default false */
      allowDisposable?: boolean;
      /** @default true */
      throwError?: boolean;
    }
  ): string | null;
  /** Valida registros DNS para um domínio ou email
   *  @param domainOrEmail - O domínio ou email a ser validado
   *  @param options - Objeto de opções
   *  @param options.validateSPF - Padrão: true
   *  @param options.validateDMARC - Padrão: true
   *  @param options.validateDKIM - Padrão: true
   *  @param options.validateMX - Padrão: true
   *  @param options.validateSMTP - Padrão: true
   *  @param options.throwError - Padrão: true */
  dns(
    domainOrEmail: string,
    options?: {
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
    }
  ): Promise<string | null>;
  /** Faz o parse de um valor string
   *  @param value - O valor a ser parseado
   *  @param options - Objeto de opções
   *  @param options.allowEmpty - Padrão: false
   *  @param options.cast - Padrão: false
   *  @param options.trim - Padrão: true
   *  @param options.capitalize - Padrão: false
   *  @param options.varName - Padrão: undefined
   *  @param options.throwError - Padrão: true */
  string(
    value: any,
    options?: {
      /** @default false */
      allowEmpty?: boolean;
      /** @default false */
      cast?: boolean;
      /** @default true */
      trim?: boolean;
      /** @default false */
      capitalize?: boolean;
      /** @default undefined */
      varName?: string;
      /** @default true */
      throwError?: boolean;
    }
  ): string | null;
  /** Faz o parse de um valor numérico
   *  @param value - O valor a ser parseado
   *  @param options - Objeto de opções
   *  @param options.allowEmptyString - Padrão: false
   *  @param options.allowNull - Padrão: false
   *  @param options.allowNegative - Padrão: true
   *  @param options.allowZero - Padrão: true
   *  @param options.varName - Padrão: undefined
   *  @param options.throwError - Padrão: true */
  number(
    value: any,
    options?: {
      /** @default false */
      allowEmptyString?: boolean;
      /** @default false */
      allowNull?: boolean;
      /** @default true */
      allowNegative?: boolean;
      /** @default true */
      allowZero?: boolean;
      /** @default undefined */
      varName?: string;
      /** @default true */
      throwError?: boolean;
    }
  ): number | null;
  /** Faz o parse de um valor inteiro
   *  @param value - O valor a ser parseado
   *  @param options - Objeto de opções
   *  @param options.allowEmptyString - Padrão: false
   *  @param options.allowNull - Padrão: false
   *  @param options.allowNegative - Padrão: true
   *  @param options.allowZero - Padrão: true
   *  @param options.varName - Padrão: undefined
   *  @param options.throwError - Padrão: true */
  integer(
    value: any,
    options?: {
      /** @default false */
      allowEmptyString?: boolean;
      /** @default false */
      allowNull?: boolean;
      /** @default true */
      allowNegative?: boolean;
      /** @default true */
      allowZero?: boolean;
      /** @default undefined */
      varName?: string;
      /** @default true */
      throwError?: boolean;
    }
  ): number | null;
  /** Faz o parse de um número de telefone
   *  @param phone - O número de telefone a ser parseado
   *  @param options - Objeto de opções
   *  @param options.addCountryCode - Padrão: true
   *  @param options.addPlusPrefix - Padrão: false
   *  @param options.addAreaCode - Padrão: true
   *  @param options.numbersOnly - Padrão: true
   *  @param options.throwError - Padrão: true */
  phone(
    phone: string,
    options?: {
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
    }
  ): string | null;
  /** Faz o parse de um arquivo CSV
   *  @param path - O caminho do arquivo CSV
   *  @param options - Objeto de opções
   *  @param options.delimiter - Padrão: ','
   *  @param options.quoteChar - Padrão: '"'
   *  @param options.escapeChar - Padrão: '\\'
   *  @param options.throwError - Padrão: true */
  csv(
    path: string,
    options?: {
      /** @default ',' */
      delimiter?: string;
      /** @default '"' */
      quoteChar?: string;
      /** @default '\\' */
      escapeChar?: string;
      /** @default true */
      throwError?: boolean;
    }
  ): Array<Record<string, string | number | boolean>> | null;
};

export const config: {
  /** Obtém o objeto de configuração atual
   *  @returns O objeto de configuração */
  get(): Record<string, any>;
  /** Redefine a configuração para um objeto vazio */
  reset(): void;
  /** Define o valor de configuração throwError
   *  @param value - O valor booleano a ser definido */
  throwError(value: boolean): void;
  /** Configurações específicas para parsing de datas */
  date: {
    /** Define o formato de entrada para parsing de datas
     *  @param value - O formato de entrada (ex: 'dd/mm/yyyy', 'iso') */
    inputFormat(value: string): void;
    /** Define o formato de saída para parsing de datas
     *  @param value - O formato de saída (ex: 'dd/mm/yyyy', 'iso') */
    outputFormat(value: string): void;
    /** Obtém o objeto de configuração de data atual
     *  @returns O objeto de configuração de data */
    get(): Record<string, string>;
    /** Redefine a configuração de data para um objeto vazio */
    reset(): void;
  };
};

/** Classe SaltoolsError */
export type SaltoolsError = new (
  message: string,
  options?: any
) => Error & {
  name: string;
  options: any;
};

export const errors: {
  SaltoolsError: SaltoolsError;
};
