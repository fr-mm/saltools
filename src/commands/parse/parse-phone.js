import { parsePhoneNumberWithError, isValidPhoneNumber } from 'libphonenumber-js';
import SaltoolsError from 'src/errors/saltools-error.js';
import { param } from 'src/helper/index.js';

class PhoneParser {
  parse(phone, {
    addCountryCode,
    addPlusPrefix,
    addAreaCode,
    numbersOnly,
    throwError,
  }) {
    try {
      this.#validateParameters({ phone, addCountryCode, addPlusPrefix, addAreaCode, numbersOnly, throwError });

      const country = this.#getCountryCode(phone);
      const phoneNumber = this.#parsePhoneNumber(phone, country);
      this.#validatePhoneNumber(phone, country);
      let result = this.#formatPhoneNumber(phoneNumber, { addCountryCode, addPlusPrefix, numbersOnly });
      
      if (numbersOnly) {
        if (addPlusPrefix && addCountryCode) {
          result = `+${result}`;
        }
      }
      
      return result;
    } catch (error) {
      if (!throwError) {
        return null;
      }
      if (!(error instanceof SaltoolsError)) {
        throw new SaltoolsError(`Número de telefone inválido: ${phone}`);
      }
      throw error;
    }
  }

  #validateParameters({ phone, addCountryCode, addPlusPrefix, addAreaCode, numbersOnly, throwError }) {
    param.string({ value: phone, name: 'phone' });
    param.bool({ value: addCountryCode, name: 'addCountryCode' });
    param.bool({ value: addPlusPrefix, name: 'addPlusPrefix' });
    param.bool({ value: addAreaCode, name: 'addAreaCode' });
    param.bool({ value: numbersOnly, name: 'numbersOnly' });
    param.bool({ value: throwError, name: 'throwError' });
  }

  #parsePhoneNumber(phone, country) {
    return parsePhoneNumberWithError(phone, country);
  }

  #validatePhoneNumber(phone, country) {
    if (!isValidPhoneNumber(phone, country)) {
      throw new SaltoolsError(`Número de telefone inválido: ${phone}`);
    }
  }

  #getCountryCode(phone) {
    if (phone.startsWith('+')) {
      return undefined;
    }
    
    const cleanPhone = phone.replace(/\D/g, '');
    
    if (cleanPhone.startsWith('55')) {
      try {
        const phoneNumber = parsePhoneNumberWithError(phone);
        return phoneNumber.country;
      } catch {
        return 'BR';
      }
    }
    
    return 'BR';
  }

  #formatPhoneNumber(phoneNumber, { addCountryCode, addPlusPrefix, numbersOnly }) {
    if (numbersOnly) {
      if (addCountryCode) {
        return phoneNumber.number.replace('+', '');
      }
      return phoneNumber.nationalNumber;
    }
    
    if (addCountryCode) {
      if (addPlusPrefix) {
        return phoneNumber.format('INTERNATIONAL');
      }
      const countryCode = phoneNumber.countryCallingCode;
      const nationalFormat = phoneNumber.format('NATIONAL');
      return `${countryCode} ${nationalFormat}`;
    }
    return phoneNumber.format('NATIONAL');
  }
}

export default function phone(phone, {
  addCountryCode = true,
  addPlusPrefix = false,
  addAreaCode = true,
  numbersOnly = true,
  throwError = true,
} = {}) {
  return new PhoneParser().parse(phone, {
    addCountryCode,
    addPlusPrefix,
    addAreaCode,
    numbersOnly,
    throwError,
  });
}