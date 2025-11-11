import { parsePhoneNumberWithError, isValidPhoneNumber } from 'libphonenumber-js';
import SaltoolsError from 'src/errors/saltools-error.js';
import { param } from 'src/helper/index.js';
import CachedOptions from 'src/helper/cached-options.js';
import OptionsService from 'src/helper/options-service.js';

export default class PhoneParser {
  static #DEFAULT_OPTIONS = {
    addCountryCode: true,
    addPlusPrefix: false,
    addAreaCode: true,
    numbersOnly: true,
    throwError: true,
    fixWhatsapp9: true,
  };
  static #cachedOptions = new CachedOptions();

  static parse(phone, options = {}) {
    options = OptionsService.update({ options, default: this.#DEFAULT_OPTIONS });

    try {
      this.#validateOptions(options);
      return this.#parse(phone, options);
    } catch (error) {
      if (!options.throwError) {
        return null;
      }
      if (!(error instanceof SaltoolsError)) {
        throw new SaltoolsError(`Número de telefone inválido ${phone} ${error.message}`);
      }
      throw error;
    }
  }

  static #parse(phone, options) {
    const country = this.#getCountryCode(phone);
    let phoneNumber = this.#parsePhoneNumber(phone, country);
    this.#validatePhoneNumber(phone, country);

    if (options.fixWhatsapp9 && phoneNumber.country === 'BR') {
      phoneNumber = this.#fixWhatsapp9Digit(phoneNumber);
    }

    const formattedPhone = this.#formatPhoneNumber(phoneNumber, options);
    return this.#addPlusPrefix(formattedPhone, options);
  }

  static #addPlusPrefix(result, options) {
    if (options.addPlusPrefix && options.addCountryCode && !result.startsWith('+')) {
      return `+${result}`;
    }
    return result;
  }

  static #validateOptions(options) {
    if (this.#cachedOptions.isCached(options)) return;

    param.bool({ value: options.addCountryCode, name: 'addCountryCode' });
    param.bool({ value: options.addPlusPrefix, name: 'addPlusPrefix' });
    param.bool({ value: options.addAreaCode, name: 'addAreaCode' });
    param.bool({ value: options.numbersOnly, name: 'numbersOnly' });
    param.bool({ value: options.throwError, name: 'throwError' });
    param.bool({ value: options.fixWhatsapp9, name: 'fixWhatsapp9' });

    this.#cachedOptions.cache(options);
  }

  static #parsePhoneNumber(phone, country) {
    return parsePhoneNumberWithError(phone, country);
  }

  static #validatePhoneNumber(phone, country) {
    if (!isValidPhoneNumber(phone, country)) {
      throw new SaltoolsError(`Número de telefone inválido: ${phone}`);
    }
  }

  static #getCountryCode(phone) {
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

  static #fixWhatsapp9Digit(phoneNumber) {
    const nationalNumber = phoneNumber.nationalNumber;
    const ddd = parseInt(nationalNumber.substring(0, 2), 10);
    const restOfNumber = nationalNumber.substring(2);

    if (restOfNumber.length === 8) {
      const firstDigit = restOfNumber.charAt(0);
      if (firstDigit >= '2' && firstDigit <= '5') {
        return phoneNumber;
      }
    }

    if (restOfNumber.length !== 9 && restOfNumber.length !== 8) {
      return phoneNumber;
    }

    const has9 = restOfNumber.startsWith('9');
    const shouldHave9 = ddd < 47;

    if (shouldHave9 && !has9 && restOfNumber.length === 8) {
      const fixedNumber = `+55${ddd}9${restOfNumber}`;
      try {
        const fixed = parsePhoneNumberWithError(fixedNumber);
        if (isValidPhoneNumber(fixedNumber, 'BR')) {
          return fixed;
        }
      } catch {
        return phoneNumber;
      }
    }

    if (!shouldHave9 && has9 && restOfNumber.length === 9) {
      const fixedNumber = `+55${ddd}${restOfNumber.substring(1)}`;
      return parsePhoneNumberWithError(fixedNumber);
    }

    return phoneNumber;
  }

  static #formatPhoneNumber(phoneNumber, options) {
    if (options.numbersOnly) {
      if (options.addCountryCode) {
        return phoneNumber.number.replace('+', '');
      }
      return phoneNumber.nationalNumber;
    }

    if (options.addCountryCode) {
      if (options.addPlusPrefix) {
        return phoneNumber.format('INTERNATIONAL');
      }
      const countryCode = phoneNumber.countryCallingCode;
      const nationalFormat = phoneNumber.format('NATIONAL');
      return `${countryCode} ${nationalFormat}`;
    }
    return phoneNumber.format('NATIONAL');
  }
}
