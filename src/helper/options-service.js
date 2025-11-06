import Config from '../commands/config.js';

export default class OptionsService {
  static update(options, defaultOptions) {
    const mergedOptions = { ...defaultOptions, ...options };
    const config = Config.get();

    for (const [key, value] of Object.entries(config)) {
      if (value !== undefined && options[key] === undefined) {
        mergedOptions[key] = value;
      }
    }
    return mergedOptions;
  }
}
