import ErrorLogger from './error-logger.js';
import LogSaver from './log-saver.js';

const errorLogger = new ErrorLogger();
const logSaver = new LogSaver();

export const error = errorLogger.run.bind(errorLogger);
export const saveLog = logSaver.run.bind(logSaver);