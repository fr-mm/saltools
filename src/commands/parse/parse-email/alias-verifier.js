import Email from './email.js';
import SaltoolsError from 'src/errors/saltools-error.js';

export default class AliasVerifier {
  #domains;

  constructor() {
    this.#domains = [
      'gmail.com',
    ];
  }

  isAlias(email) {
    this.#verifyType(email);

    if (this.#domains.includes(email.domain)) {
      return this.#isAlias(email);
    }
    return false;
  }

  #verifyType(email) {
    if (!(email instanceof Email)) {
      throw new SaltoolsError(`Email ${email} não é uma instância de Email`);
    }
  }

  #isAlias(email) {
    return ['+', '.'].some(char => email.local.includes(char));
  }
}