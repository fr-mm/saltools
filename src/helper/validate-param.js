import SaltoolsError from 'src/errors/saltools-error.js';

function validateParam({value, type, name, required = false}) {
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

function bool({value, name, required = false}) {
    return validateParam({value, type: 'boolean', name, required});
}

function string({value, name, required = false}) {
    return validateParam({value, type: 'string', name, required});
}

function number({value, name, required = false}) {
    return validateParam({value, type: 'number', name, required});
}

function integer({value, name, required = false}) {
    const number = validateParam({value, type: 'number', name, required});
    if (number === null || number === undefined) {
        return number;
    }
    if (!Number.isInteger(number)) {
        throw new SaltoolsError(`${name} deve ser um inteiro, recebeu ${typeof value} ${number}`);
    }
    return number;
}

export const param = {
    bool,
    string,
    number,
    integer
}
