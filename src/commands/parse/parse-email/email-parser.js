import Email from './email.js';
import DNSValidator from './dns-validator.js';
import MailboxVerifier from './mailbox-verifier.js';
import NeverbounceVerifier from './neverbounce-verifier.js';
import AliasVerifier from './alias-verifier.js';
import DisposableVerifier from './disposable-verifier.js';
import validator from 'validator';
import SaltoolsError from 'src/errors/saltools-error.js';
import { param } from 'src/helper/index.js';


export default class EmailParser {
  #dnsValidator;
  #aliasVerifier;
  #disposableVerifier;
  #mailboxVerifier;
  #neverbounceVerifier;

  constructor({
    dnsValidator = new DNSValidator(),
    aliasVerifier = new AliasVerifier(),
    disposableVerifier = new DisposableVerifier(),
    mailboxVerifier = new MailboxVerifier(),
    neverbounceVerifier = new NeverbounceVerifier(),
  } = {}) {
    this.#dnsValidator = dnsValidator;
    this.#aliasVerifier = aliasVerifier;
    this.#disposableVerifier = disposableVerifier;
    this.#mailboxVerifier = mailboxVerifier;
    this.#neverbounceVerifier = neverbounceVerifier;
  }

  async parse(email, {
    allowAlias = false, 
    allowDisposable = false, 
    useMailbox = false, 
    useNeverbounce = false,
    validateSPF = true,
    validateDMARC = true,
    validateDKIM = true,
    validateMX = true,
    validateSMTP = true,
  } = {}) {
    this.#validateParameters({
      email, 
      allowAlias, 
      allowDisposable, 
      useMailbox, 
      useNeverbounce, 
      validateSPF, 
      validateDMARC, 
      validateDKIM, 
      validateMX, 
      validateSMTP,
    });

    email = new Email(email);

    this.#validateSyntax(email);
    this.#validateAlias(email, allowAlias);
    this.#validateDisposable(email, allowDisposable);
    await this.#validateDns(email, {validateSPF, validateDMARC, validateDKIM, validateMX, validateSMTP});
    await this.#validateMailbox(email, useMailbox);
    await this.#validateNeverbounce(email, useNeverbounce);

    return email.value;
  }

  #validateParameters({email, allowAlias, allowDisposable, useMailbox, useNeverbounce, validateSPF, validateDMARC, validateDKIM, validateMX, validateSMTP}) {
    param.string({value: email, name: 'email'});
    param.bool({value: allowAlias, name: 'allowAlias'});
    param.bool({value: allowDisposable, name: 'allowDisposable'});
    param.bool({value: useMailbox, name: 'useMailbox'});
    param.bool({value: useNeverbounce, name: 'useNeverbounce'});
    param.bool({value: validateSPF, name: 'validateSPF'});
    param.bool({value: validateDMARC, name: 'validateDMARC'});
    param.bool({value: validateDKIM, name: 'validateDKIM'});
    param.bool({value: validateMX, name: 'validateMX'});
    param.bool({value: validateSMTP, name: 'validateSMTP'});
  }

  async #validateMailbox(email, useMailbox) {
    if (!useMailbox) return;
    await this.#mailboxVerifier.verify(email);
  }

  async #validateNeverbounce(email, useNeverbounce) {
    if (!useNeverbounce) return;
    await this.#neverbounceVerifier.verify(email);
  }

  #validateDisposable(email, allowDisposable) {
    if (!allowDisposable && this.#disposableVerifier.isDisposable(email)) {
      throw new SaltoolsError(`Email ${email.value} é um email temporário e o parâmetro allowDisposable é false`);
    }
  }

  async #validateDns(email, {validateSPF, validateDMARC, validateDKIM, validateMX, validateSMTP} = {}) {
    await this.#dnsValidator.verify(email, {validateSPF, validateDMARC, validateDKIM, validateMX, validateSMTP});
  }

  #validateAlias(email, allowAlias) {
    if (!allowAlias && this.#aliasVerifier.isAlias(email)) {
      throw new SaltoolsError(`Email ${email.value} é um alias e o parâmetro allowAlias é false`);
    }
  }

  #validateSyntax(email) {
    if (!validator.isEmail(email.value)) {
      throw new SaltoolsError('Email inválido');
    }
  }
}