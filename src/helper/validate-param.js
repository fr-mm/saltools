import SaltoolsError from 'src/errors/saltools-error.js';

function validateParam({value, type, name}) {
    if (value === null || value === undefined) {
        return value;
    }
    if (typeof value !== type) {
        throw new SaltoolsError(`${name} deve ser ${type}, recebeu ${typeof value} ${value}`);
    }
    return value;
}

function bool({value, name}) {
    return validateParam({value, type: 'boolean', name});
}

function string({value, name}) {
    return validateParam({value, type: 'string', name});
}

function number({value, name}) {
    return validateParam({value, type: 'number', name});
}

function integer({value, name}) {
    const number = validateParam({value, type: 'number', name});
    if (number === null || number === undefined) {
        return number;
    }
    if (!Number.isInteger(number)) {
        throw new SaltoolsError(`${name} deve ser um inteiro, recebeu ${typeof value} ${number}`);
    }
    return number;
}

export const param ={
    bool,
    string,
    number,
    integer
}
