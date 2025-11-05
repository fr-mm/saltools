import DNSValidator from './dns-validator.js';
import CachedOptions from 'src/helper/cachedOptions.js';
import validator from 'validator';
import SaltoolsError from 'src/errors/saltools-error.js';
import { param } from 'src/helper/index.js';

export default class EmailParser {
  static #DEFAULT_OPTIONS = {
    allowAlias: true,
    allowDisposable: false,
    validateSPF: true,
    validateDMARC: true,
    validateDKIM: true,
    validateMX: true,
    validateSMTP: true,
    throwError: true,
  };
  static #DISPOSABLE_DOMAINS = ['mailinator.com', 'tempmail.com', 'dispostable.com'];
  static #ALIAS_DOMAINS = ['gmail.com'];
  static #cachedOptions = new CachedOptions();

  static async parse(email, options = {}) {
    const mergedOptions = { ...EmailParser.#DEFAULT_OPTIONS, ...options };
    try {
      return await this.#parse(email, mergedOptions);
    } catch (error) {
      if (!mergedOptions.throwError && error instanceof SaltoolsError) {
        return null;
      }
      throw error;
    }
  }

  static async #parse(email, options) {
    param.string({ value: email, name: 'email', required: true });
    EmailParser.#validateOptions(options);

    email = EmailParser.#parseEmail(email);

    EmailParser.#validateSyntax(email);
    EmailParser.#validateAlias(email, options.allowAlias);
    EmailParser.#validateDisposable(email, options.allowDisposable);
    await DNSValidator.verify(email, options);

    return email.value;
  }

  static #validateOptions(options) {
    if (EmailParser.#cachedOptions.isCached(options)) return;

    param.bool({ value: options.allowAlias, name: 'allowAlias' });
    param.bool({ value: options.allowDisposable, name: 'allowDisposable' });
    param.bool({ value: options.validateSPF, name: 'validateSPF' });
    param.bool({ value: options.validateDMARC, name: 'validateDMARC' });
    param.bool({ value: options.validateDKIM, name: 'validateDKIM' });
    param.bool({ value: options.validateMX, name: 'validateMX' });
    param.bool({ value: options.validateSMTP, name: 'validateSMTP' });
    param.bool({ value: options.throwError, name: 'throwError' });

    EmailParser.#cachedOptions.cache(options);
  }

  static #parseEmail(email) {
    const value = email.toLowerCase().trim();
    const split = value.split('@');
    const domain = split[1];
    const local = split[0];

    if (!domain || !local) {
      throw new SaltoolsError(`Email ${email} inválido`);
    }

    return { value, domain, local };
  }

  static #validateDisposable(email, allowDisposable) {
    if (!allowDisposable && EmailParser.#DISPOSABLE_DOMAINS.includes(email.domain)) {
      throw new SaltoolsError(
        `Email ${email.value} é um email temporário e o parâmetro allowDisposable é false`
      );
    }
  }

  static #validateAlias(email, allowAlias) {
    if (!allowAlias && EmailParser.#isAlias(email)) {
      throw new SaltoolsError(`Email ${email.value} é um alias e o parâmetro allowAlias é false`);
    }
  }

  static #isAlias(email) {
    if (!EmailParser.#ALIAS_DOMAINS.includes(email.domain)) {
      return false;
    }
    return ['+', '.'].some((char) => email.local.includes(char));
  }

  static #validateSyntax(email) {
    if (!validator.isEmail(email.value)) {
      throw new SaltoolsError('Email inválido');
    }
  }
}
