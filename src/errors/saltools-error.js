export default class SaltoolsError extends Error {
  constructor(message, options = {}) {
    super(`[Saltools] ${message}`, options);
    this.name = 'SaltoolsError';
    this.options = options;
    this._originalStack = this.stack;
  }

  get stack() {
    if (!this._originalStack) return undefined;
    const stackLines = this._originalStack.split('\n');
    const messageLine = `${this.name}: ${this.message}`;
    const stackTrace = stackLines.slice(1).join('\n');
    return `${stackTrace}\n${messageLine}`;
  }
}
