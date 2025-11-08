import Config from '../commands/config/config.js';

export default class OptionsService {
  static update(options, defaultOptions, specificConfig) {
    const mergedOptions = { ...defaultOptions, ...options };
    let config = Config.get();
    if (specificConfig) {
      const configPath = specificConfig.split('.');
      let configObject = Config;
      for (const pathPart of configPath) {
        configObject = configObject[pathPart];
      }
      const specifics = configObject.get();
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
