import dns from 'dns';
import net from 'net';
import SaltoolsError from 'src/errors/saltools-error.js';
import Email from './email.js';


export default class DNSValidator {
  async verify(email, {
    validateSPF,
    validateDMARC,
    validateDKIM,
    validateMX,
    validateSMTP,
  } = {}) {
    this.#validateType(email);

    await Promise.all([
      this.#validateSPF(email, validateSPF),
      this.#validateDMARC(email, validateDMARC),
      this.#validateDKIM(email, validateDKIM),
      this.#validateMX(email, validateMX),
      this.#validateSMTP(email, validateSMTP),
    ]);
  }

  #validateType(email) {
    if (!(email instanceof Email)) {
      throw new SaltoolsError(`Email ${email.value} não é uma instância de Email`);
    }
  }

  async #validateSPF(email, validateSPF) {
    if (!validateSPF) return;
    await this.#dnsResolveText({email, type: 'SPF', text: email.domain});
  }

  async #validateDMARC(email, validateDMARC) {
    if (!validateDMARC) return;
    await this.#dnsResolveText({email, type: 'DMARC', text: `_dmarc.${email.domain}`});
  }

  async #validateDKIM(email, validateDKIM) {
    if (!validateDKIM) return;
    await this.#dnsResolveText({email, type: 'DKIM', text: `default._domainkey.${email.domain}`});
  }

  async #validateMX(email, validateMX) {
    if (!validateMX) return;
    try {
      const mxRecords = await dns.promises.resolveMx(email.domain);
      if (mxRecords.length === 0) {
        throw new SaltoolsError(`MX não encontrado para o email ${email.value}`);
      }
    } catch {
      throw new SaltoolsError(`Erro ao validar MX para o email ${email.value}`);
    }
  }

  async #validateSMTP(email, validateSMTP) {
    if (!validateSMTP) return;
    try {
      const domain = email.domain;
      const mx = await dns.promises.resolveMx(domain);
      const mxHost = mx.sort((a, b) => a.priority - b.priority)[0]?.exchange;
      if (!mxHost) {
        throw new SaltoolsError(`MX não encontrado para o email ${email.value}`);
      }

      const isValid = await new Promise((resolve) => {
        const socket = net.createConnection(25, mxHost);
        let stage = 0;
        socket.setEncoding('ascii');
        socket.setTimeout(5000);

        socket.on('data', (data) => {
          if (stage === 0) {
            socket.write(`HELO test.com\r\n`);
            stage++;
          } else if (stage === 1) {
            socket.write(`MAIL FROM:<verify@test.com>\r\n`);
            stage++;
          } else if (stage === 2) {
            socket.write(`RCPT TO:<${email.value}>\r\n`);
            stage++;
          } else if (stage === 3) {
            socket.write(`QUIT\r\n`);
            socket.end();
            resolve(data.includes('250'));
          }
        });

        socket.on('error', () => resolve(false));
        socket.on('timeout', () => {
          socket.destroy();
          resolve(false);
        });
      });

      if (!isValid) {
        throw new SaltoolsError(`SMTP inválido para o email ${email.value}`);
      }
    } catch (error) {
      if (error instanceof SaltoolsError) {
        throw error;
      }
      throw new SaltoolsError(`Erro ao validar SMTP para o email ${email.value} ${error.message}`);
    }
  }

  async #dnsResolveText({email, type, text}) {
    try {
      const txt = await dns.promises.resolveTxt(text);
      if (txt.flat().length === 0) {
        throw new SaltoolsError(`${type} não encontrado para o email ${email.value}`);
      }
    } catch {
      throw new SaltoolsError(`Erro ao validar ${type} para o email ${email.value}`);
    }
  }
}