export default class CachedOptions {
  #cache = new Set();

  cache(options) {
    const hash = this.#hash(options);
    this.#cache.add(hash);
  }

  isCached(options) {
    const hash = this.#hash(options);
    return this.#cache.has(hash);
  }

  #hash(options) {
    let hash = '';
    for (const key in options) {
      const value = options[key];
      hash += `${key}:${typeof value}:${value}|`;
    }
    return hash;
  }
}
