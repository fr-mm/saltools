import dns from 'dns';
import net from 'net';
import SaltoolsError from 'src/errors/saltools-error.js';
import { param } from 'src/helper/index.js';
import CachedOptions from 'src/helper/cached-options.js';
import OptionsService from 'src/helper/options-service.js';

export default class DNSParser {
  static #DEFAULT_OPTIONS = {
    validateMX: true,
    validateSMTP: true,
    throwError: true,
  };
  static #cachedOptions = new CachedOptions();

  static async parse(domainOrEmail, options = {}) {
    options = OptionsService.update({ options, default: this.#DEFAULT_OPTIONS });
    try {
      return await DNSParser.#parse(domainOrEmail, options);
    } catch (error) {
      if (!options.throwError && error instanceof SaltoolsError) {
        return null;
      }
      throw error;
    }
  }

  static async #parse(domainOrEmail, options) {
    param.string({ value: domainOrEmail, name: 'domainOrEmail', required: true });
    DNSParser.#validateOptions(options);

    const domain = DNSParser.#extractDomain(domainOrEmail);
    const email = { value: domainOrEmail, domain, local: domainOrEmail.split('@')[0] || '' };

    await Promise.all([
      DNSParser.#validateMX(email, options.validateMX),
      DNSParser.#validateSMTP(email, options.validateSMTP),
    ]);

    return domain;
  }

  static #extractDomain(domainOrEmail) {
    if (domainOrEmail.includes('@')) {
      const parts = domainOrEmail.split('@');
      if (parts.length !== 2 || !parts[1]) {
        throw new SaltoolsError(`Domínio inválido: ${domainOrEmail}`);
      }
      return parts[1].toLowerCase().trim();
    }
    return domainOrEmail.toLowerCase().trim();
  }

  static #validateOptions(options) {
    if (DNSParser.#cachedOptions.isCached(options)) return;

    param.bool({ value: options.validateMX, name: 'validateMX' });
    param.bool({ value: options.validateSMTP, name: 'validateSMTP' });
    param.bool({ value: options.throwError, name: 'throwError' });

    DNSParser.#cachedOptions.cache(options);
  }

  static async #validateMX(email, validateMX) {
    if (!validateMX) return;
    try {
      const mxRecords = await dns.promises.resolveMx(email.domain);
      if (mxRecords.length === 0) {
        throw new SaltoolsError(`MX não encontrado para ${email.value}`);
      }
    } catch {
      throw new SaltoolsError(`Erro ao validar MX para ${email.value}`);
    }
  }

  static async #validateSMTP(email, validateSMTP) {
    if (!validateSMTP) return;
    try {
      const domain = email.domain;
      const mx = await dns.promises.resolveMx(domain);
      const mxHost = mx.sort((a, b) => a.priority - b.priority)[0]?.exchange;
      if (!mxHost) {
        throw new SaltoolsError(`MX não encontrado para ${email.value}`);
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
        throw new SaltoolsError(`SMTP inválido para ${email.value}`);
      }
    } catch (error) {
      if (error instanceof SaltoolsError) {
        throw error;
      }
      throw new SaltoolsError(`Erro ao validar SMTP para ${email.value} ${error.message}`);
    }
  }
}
