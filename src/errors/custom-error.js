class CustomError extends Error {
  constructor(message, options = {}) {
    super(`[Saltools] ${message}`, options);
    this.name = 'SaltoolsError';
    this.options = options;
  }
}

module.exports = CustomError;
