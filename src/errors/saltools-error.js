export default class SaltoolsError extends Error {
  constructor(message, options = {}) {
    super(`[Saltools] ${message}`, options);
    this.name = 'SaltoolsError';
    this.options = options;
  }
}
