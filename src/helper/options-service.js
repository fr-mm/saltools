import Config from '../commands/config/config.js';

export default class OptionsService {
  static update({ options, default: defaultOptions, specificConfig }) {
    const mergedOptions = { ...defaultOptions, ...options };
    let config = Config.get();
    if (specificConfig) {
      const specifics = specificConfig.get();
      config = { ...config, ...specifics };
    }

    for (const [key, value] of Object.entries(config)) {
      if (value !== undefined && options[key] === undefined) {
        mergedOptions[key] = value;
      }
    }
    return mergedOptions;
  }
}
