import axios from 'axios';
import SaltoolsError from 'src/errors/saltools-error.js';


export default class NeverbounceVerifier {
  #apiKey = process.env.NEVERBOUNCE_API_KEY;
  #url = 'https://api.neverbounce.com/v4/single/check';

  async verify(email) {
    this.#verifyApiKey();
    const response = await this.#makeRequest(email);
    if (response.data.result === 'valid') {
      return email;
    } else {
      throw new SaltoolsError(`Neverbounce invalidou o email ${email} ${response.data.result}`);
    }
  }

  async #makeRequest(email) {
    return await axios.get(
      this.#url,
      {
        params: {
          key: this.#apiKey,
          email: email,
          address_info: 1,
          credits_info: 1,
        },
      }
    );
  }

  #verifyApiKey() {
    if (!this.#apiKey) {
      throw new SaltoolsError("API key do Neverbounce deve ser definida na variável de ambiente NEVERBOUNCE_API_KEY");
    }
  }
}
