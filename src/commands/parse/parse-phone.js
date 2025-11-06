import { parsePhoneNumberWithError, isValidPhoneNumber } from 'libphonenumber-js';
import SaltoolsError from 'src/errors/saltools-error.js';
import { param } from 'src/helper/index.js';
import CachedOptions from 'src/helper/cachedOptions.js';
import OptionsService from 'src/helper/options-service.js';

export default class PhoneParser {
  static #DEFAULT_OPTIONS = {
    addCountryCode: true,
    addPlusPrefix: false,
    addAreaCode: true,
    numbersOnly: true,
    throwError: true,
  };
  static #cachedOptions = new CachedOptions();

  static parse(phone, options = {}) {
    options = OptionsService.update(options, this.#DEFAULT_OPTIONS);

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
    const phoneNumber = this.#parsePhoneNumber(phone, country);
    this.#validatePhoneNumber(phone, country);
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
