import dns from 'dns';
import net from 'net';
import SaltoolsError from 'src/errors/saltools-error.js';

export default class DNSValidator {
  static async verify(email, options = {}) {
    await Promise.all([
      DNSValidator.#validateSPF(email, options.validateSPF),
      DNSValidator.#validateDMARC(email, options.validateDMARC),
      DNSValidator.#validateDKIM(email, options.validateDKIM),
      DNSValidator.#validateMX(email, options.validateMX),
      DNSValidator.#validateSMTP(email, options.validateSMTP),
    ]);
  }

  static async #validateSPF(email, validateSPF) {
    if (validateSPF) {
      await DNSValidator.#dnsResolveText({ email, type: 'SPF', text: email.domain });
    }
  }

  static async #validateDMARC(email, validateDMARC) {
    if (validateDMARC) {
      await DNSValidator.#dnsResolveText({ email, type: 'DMARC', text: `_dmarc.${email.domain}` });
    }
  }

  static async #validateDKIM(email, validateDKIM) {
    if (validateDKIM) {
      await DNSValidator.#dnsResolveText({
        email,
        type: 'DKIM',
        text: `default._domainkey.${email.domain}`,
      });
    }
  }

  static async #validateMX(email, validateMX) {
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

  static async #validateSMTP(email, validateSMTP) {
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

  static async #dnsResolveText({ email, type, text }) {
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
