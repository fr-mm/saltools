import { describe, test, expect, beforeEach } from '@jest/globals';
import Config from 'src/commands/config/config.js';

describe('Config', () => {
  beforeEach(() => {
    Config.reset();
  });

  test('test_get_WHEN_noConfigSet_THEN_returnsEmptyObject', () => {
    const result = Config.get();
    expect(result).toEqual({});
  });

  test('test_throwError_WHEN_setToTrue_THEN_setsConfigValue', () => {
    Config.throwError(true);
    const result = Config.get();
    expect(result).toEqual({ throwError: true });
  });

  test('test_throwError_WHEN_setToFalse_THEN_setsConfigValue', () => {
    Config.throwError(false);
    const result = Config.get();
    expect(result).toEqual({ throwError: false });
  });

  test('test_get_WHEN_configSet_THEN_returnsConfigObject', () => {
    Config.throwError(true);
    const result = Config.get();
    expect(result.throwError).toBe(true);
  });

  test('test_reset_WHEN_called_THEN_clearsConfig', () => {
    Config.throwError(true);
    Config.reset();
    const result = Config.get();
    expect(result).toEqual({});
  });

  test('test_throwError_WHEN_calledMultipleTimes_THEN_updatesValue', () => {
    Config.throwError(true);
    expect(Config.get().throwError).toBe(true);

    Config.throwError(false);
    expect(Config.get().throwError).toBe(false);

    Config.throwError(true);
    expect(Config.get().throwError).toBe(true);
  });

  test('test_get_WHEN_afterReset_THEN_returnsEmptyObject', () => {
    Config.throwError(true);
    Config.reset();
    const result = Config.get();
    expect(result).toEqual({});
    expect(result.throwError).toBeUndefined();
  });

  describe('Config.date', () => {
    test('test_date_WHEN_accessed_THEN_returnsDateConfig', () => {
      expect(Config.date).toBeDefined();
      expect(typeof Config.date.get).toBe('function');
      expect(typeof Config.date.reset).toBe('function');
      expect(typeof Config.date.inputFormat).toBe('function');
      expect(typeof Config.date.outputFormat).toBe('function');
    });
  });

  describe('Config.log', () => {
    describe('Config.log.error', () => {
      test('test_logError_WHEN_accessed_THEN_returnsErrorLogConfig', () => {
        expect(Config.log.error).toBeDefined();
        expect(typeof Config.log.error.get).toBe('function');
        expect(typeof Config.log.error.reset).toBe('function');
        expect(typeof Config.log.error.directory).toBe('function');
        expect(typeof Config.log.error.filename).toBe('function');
        expect(typeof Config.log.error.addTimestamp).toBe('function');
        expect(typeof Config.log.error.print).toBe('function');
        expect(typeof Config.log.error.throwError).toBe('function');
      });
    });

    describe('Config.log.saveLog', () => {
      test('test_logSaveLog_WHEN_accessed_THEN_returnsSaveLogConfig', () => {
        expect(Config.log.saveLog).toBeDefined();
        expect(typeof Config.log.saveLog.get).toBe('function');
        expect(typeof Config.log.saveLog.reset).toBe('function');
        expect(typeof Config.log.saveLog.directory).toBe('function');
        expect(typeof Config.log.saveLog.filename).toBe('function');
        expect(typeof Config.log.saveLog.addTimestamp).toBe('function');
      });
    });
  });
});
