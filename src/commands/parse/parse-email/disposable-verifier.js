import Email from './email.js';
import SaltoolsError from 'src/errors/saltools-error.js';


export default class DisposableVerifier {
  #domains;

  constructor() {
    this.#domains = [
      'mailinator.com',
      'tempmail.com',
      'dispostable.com',
    ];
  }

  isDisposable(email) {
    this.#validateType(email);
    return this.#domains.includes(email.domain);
  }

  #validateType(email) {
    if (!(email instanceof Email)) {
      throw new SaltoolsError(`Email ${email} não é uma instância de Email`);
    }
  }
}