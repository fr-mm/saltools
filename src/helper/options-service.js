import Config from '../commands/config/config.js';

export default class OptionsService {
  static update({ options, default: defaultOptions, specificConfig }) {
    let config = Config.get();
    if (specificConfig) {
      const specifics = specificConfig.get();
      config = { ...config, ...specifics };
    }

    const filteredOptions = {};
    for (const [key, value] of Object.entries(options)) {
      if (value !== undefined) {
        filteredOptions[key] = value;
      }
    }
    return { ...defaultOptions, ...config, ...filteredOptions };
  }
}
