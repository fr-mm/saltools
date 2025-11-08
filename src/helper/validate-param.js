import SaltoolsError from 'src/errors/saltools-error.js';

function validateParam({ value, type, name, required = false }) {
  if (value === null || value === undefined) {
    if (required) {
      throw new SaltoolsError(`${name} é obrigatório`);
    }
    return value;
  }
  if (typeof value !== type) {
    throw new SaltoolsError(`${name} deve ser ${type}, recebeu ${typeof value} ${value}`);
  }
  return value;
}

function bool({ value, name, required = false }) {
  return validateParam({ value, type: 'boolean', name, required });
}

function string({ value, name, required = false, options = null }) {
  const validated = validateParam({ value, type: 'string', name, required });
  if (options !== null && validated !== null && validated !== undefined) {
    if (!Array.isArray(options)) {
      throw new SaltoolsError(`${name} deve ser um array, recebeu ${typeof options} ${options}`);
    }
    if (!options.includes(validated)) {
      throw new SaltoolsError(`${name} não é uma option valida ${options.join(', ')}`);
    }
  }
  return validated;
}

function number({ value, name, required = false }) {
  return validateParam({ value, type: 'number', name, required });
}

function integer({ value, name, required = false }) {
  const number = validateParam({ value, type: 'number', name, required });
  if (number === null || number === undefined) {
    return number;
  }
  if (!Number.isInteger(number)) {
    throw new SaltoolsError(`${name} deve ser um inteiro, recebeu ${typeof value} ${number}`);
  }
  return number;
}

function object({ value, name, required = false }) {
  return validateParam({ value, type: 'object', name, required });
}

function error({ value, name, required = false }) {
  const validated = object({ value, name, required });
  if (!required && (validated === null || validated === undefined)) return validated;
  if (validated instanceof Error) return validated;
  throw new SaltoolsError(`${name} deve ser um erro, recebeu ${typeof validated} ${validated}`);
}

function date({ value, name, required = false }) {
  if (value === null || value === undefined) {
    if (required) {
      throw new SaltoolsError(`${name} é obrigatório`);
    }
    return value;
  }
  if (!(value instanceof Date)) {
    throw new SaltoolsError(`${name} deve ser uma data, recebeu ${typeof value} ${value}`);
  }
  if (isNaN(value.getTime())) {
    throw new SaltoolsError(`${name} deve ser uma data válida, recebeu ${typeof value} ${value}`);
  }
  return value;
}

export const param = {
  bool,
  string,
  number,
  integer,
  object,
  error,
  date,
};
