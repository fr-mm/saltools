import CachedOptions from 'src/helper/cachedOptions.js';
import validator from 'validator';
import SaltoolsError from 'src/errors/saltools-error.js';
import { param } from 'src/helper/index.js';
import OptionsService from 'src/helper/options-service.js';

export default class EmailParser {
  static #DEFAULT_OPTIONS = {
    allowAlias: true,
    allowDisposable: false,
    throwError: true,
  };
  static #DISPOSABLE_DOMAINS = ['mailinator.com', 'tempmail.com', 'dispostable.com'];
  static #ALIAS_DOMAINS = ['gmail.com'];
  static #cachedOptions = new CachedOptions();

  static parse(email, options = {}) {
    options = OptionsService.update(options, this.#DEFAULT_OPTIONS);
    try {
      return this.#parse(email, options);
    } catch (error) {
      if (!options.throwError && error instanceof SaltoolsError) {
        return null;
      }
      throw error;
    }
  }

  static #parse(email, options) {
    param.string({ value: email, name: 'email', required: true });
    EmailParser.#validateOptions(options);

    email = EmailParser.#parseEmail(email);

    EmailParser.#validateSyntax(email);
    EmailParser.#validateAlias(email, options.allowAlias);
    EmailParser.#validateDisposable(email, options.allowDisposable);

    return email.value;
  }

  static #validateOptions(options) {
    if (EmailParser.#cachedOptions.isCached(options)) return;

    param.bool({ value: options.allowAlias, name: 'allowAlias' });
    param.bool({ value: options.allowDisposable, name: 'allowDisposable' });
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
