import { parse } from './parse/index.js';
import { error, saveLog } from './log/index.js';
import timestamp from './timestamp.js';
import helloWorld from './hello-world.js';
import Config from './config.js';

export const config = {
  get: Config.get.bind(Config),
  reset: Config.reset.bind(Config),
  throwError: Config.throwError.bind(Config),
};

export const log = {
  error,
  saveLog,
};

export { parse, timestamp, helloWorld };
