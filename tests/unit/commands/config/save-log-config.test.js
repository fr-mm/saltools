import { describe, test, expect, beforeEach } from '@jest/globals';
import SaveLogConfig from 'src/commands/config/save-log-config.js';
import SaltoolsError from 'src/errors/saltools-error.js';

describe('SaveLogConfig', () => {
  beforeEach(() => {
    SaveLogConfig.reset();
  });

  test('test_get_WHEN_noConfigSet_THEN_returnsEmptyObject', () => {
    const result = SaveLogConfig.get();
    expect(result).toEqual({});
  });

  test('test_directory_WHEN_setToValidString_THEN_setsConfigValue', () => {
    SaveLogConfig.directory('./logs');
    const result = SaveLogConfig.get();
    expect(result).toEqual({ directory: './logs' });
  });

  test('test_filename_WHEN_setToValidString_THEN_setsConfigValue', () => {
    SaveLogConfig.filename('app');
    const result = SaveLogConfig.get();
    expect(result).toEqual({ filename: 'app' });
  });

  test('test_addTimestamp_WHEN_setToTrue_THEN_setsConfigValue', () => {
    SaveLogConfig.addTimestamp(true);
    const result = SaveLogConfig.get();
    expect(result).toEqual({ addTimestamp: true });
  });

  test('test_addTimestamp_WHEN_setToFalse_THEN_setsConfigValue', () => {
    SaveLogConfig.addTimestamp(false);
    const result = SaveLogConfig.get();
    expect(result).toEqual({ addTimestamp: false });
  });

  test('test_directory_WHEN_setMultipleTimes_THEN_updatesValue', () => {
    SaveLogConfig.directory('./logs');
    expect(SaveLogConfig.get().directory).toBe('./logs');
    
    SaveLogConfig.directory('./output');
    expect(SaveLogConfig.get().directory).toBe('./output');
  });

  test('test_filename_WHEN_setMultipleTimes_THEN_updatesValue', () => {
    SaveLogConfig.filename('app');
    expect(SaveLogConfig.get().filename).toBe('app');
    
    SaveLogConfig.filename('application');
    expect(SaveLogConfig.get().filename).toBe('application');
  });

  test('test_addTimestamp_WHEN_setMultipleTimes_THEN_updatesValue', () => {
    SaveLogConfig.addTimestamp(true);
    expect(SaveLogConfig.get().addTimestamp).toBe(true);
    
    SaveLogConfig.addTimestamp(false);
    expect(SaveLogConfig.get().addTimestamp).toBe(false);
  });

  test('test_setters_WHEN_setAllValues_THEN_setsAllValues', () => {
    SaveLogConfig.directory('./logs');
    SaveLogConfig.filename('app');
    SaveLogConfig.addTimestamp(true);
    const result = SaveLogConfig.get();
    expect(result).toEqual({
      directory: './logs',
      filename: 'app',
      addTimestamp: true,
    });
  });

  test('test_reset_WHEN_called_THEN_clearsConfig', () => {
    SaveLogConfig.directory('./logs');
    SaveLogConfig.filename('app');
    SaveLogConfig.addTimestamp(true);
    SaveLogConfig.reset();
    const result = SaveLogConfig.get();
    expect(result).toEqual({});
  });

  test('test_directory_WHEN_setToNonString_THEN_throwsError', () => {
    expect(() => {
      SaveLogConfig.directory(123);
    }).toThrow(SaltoolsError);
  });

  test('test_filename_WHEN_setToNonString_THEN_throwsError', () => {
    expect(() => {
      SaveLogConfig.filename(true);
    }).toThrow(SaltoolsError);
  });

  test('test_addTimestamp_WHEN_setToNonBoolean_THEN_throwsError', () => {
    expect(() => {
      SaveLogConfig.addTimestamp('true');
    }).toThrow(SaltoolsError);
  });

  test('test_get_WHEN_afterReset_THEN_returnsEmptyObject', () => {
    SaveLogConfig.directory('./logs');
    SaveLogConfig.filename('app');
    SaveLogConfig.addTimestamp(true);
    SaveLogConfig.reset();
    const result = SaveLogConfig.get();
    expect(result).toEqual({});
    expect(result.directory).toBeUndefined();
    expect(result.filename).toBeUndefined();
    expect(result.addTimestamp).toBeUndefined();
  });
});

