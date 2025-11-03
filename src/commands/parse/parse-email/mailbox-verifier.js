import Email from './email.js';
import axios from 'axios';
import SaltoolsError from 'src/errors/saltools-error.js';

export default class MailboxVerifier {
  #url = 'http://apilayer.net/api/check';
  #apiKey = process.env.MAILBOX_API_KEY;

  async verify(email) {
    this.#verifyApiKey();
    email = new Email(email);
    const response = await this.#makeRequest(email);
    this.#checkResponseStatus(response.status);
    this.#validateResponseData(response.data, email);
    return email;
  }

  async #makeRequest(email) {
    const params = { 
      access_key: this.#apiKey, 
      email: email.value, 
      smtp: 1, 
      format: 1 
    };
    return await axios.get(this.#url, { params });
  }

  #verifyApiKey() {
    if (!this.#apiKey) {
      throw new SaltoolsError("API key do MailboxLayer deve ser definida na variável de ambiente MAILBOX_API_KEY");
    }
  }
  
  #validateResponseData(data, email) {
    this.#responseDataIsValid(data);
    if (!data.format_valid || !data.mx_found || !data.smtp_check) {
      throw new SaltoolsError(`MailboxLayer invalidou o email ${email.value} ${data}`);
    }
  }

  #responseDataIsValid(data) {
    if (!data) {
      throw new SaltoolsError('Resposta do MailboxLayer veio vazia');
    }
    if (typeof data !== 'object') {
      throw new SaltoolsError(`Resposta do MailboxLayer não é um objeto ${typeof data} ${data}`);
    }
    if (data.success !== true) {
      throw new SaltoolsError(`MailboxLayer retornou erro ${data.error?.info || data}`);
    }
  }
  #checkResponseStatus(status) {
    if (status !== 200) {
      throw new SaltoolsError(`Resposta inválida do MailboxLayer: status ${status}`);
    }
  }
}