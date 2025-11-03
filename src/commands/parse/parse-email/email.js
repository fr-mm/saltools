import SaltoolsError from 'src/errors/saltools-error.js';

export default class Email {
  constructor(email) {
    this.value = email.toLowerCase().trim();
    const split = this.value.split('@');
    this.domain = split[1];
    this.local = split[0];

    if (!this.domain || !this.local) {
      throw new SaltoolsError(`Email ${email} inválido`);
    }
  }
}