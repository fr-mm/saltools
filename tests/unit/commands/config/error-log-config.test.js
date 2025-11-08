import { describe, test, expect, beforeEach } from '@jest/globals';
import ErrorLogConfig from 'src/commands/config/error-log-config.js';
import SaltoolsError from 'src/errors/saltools-error.js';

describe('ErrorLogConfig', () => {
  beforeEach(() => {
    ErrorLogConfig.reset();
  });

  test('test_get_WHEN_noConfigSet_THEN_returnsEmptyObject', () => {
    const result = ErrorLogConfig.get();
    expect(result).toEqual({});
  });

  test('test_directory_WHEN_setToValidString_THEN_setsConfigValue', () => {
    ErrorLogConfig.directory('./logs');
    const result = ErrorLogConfig.get();
    expect(result).toEqual({ directory: './logs' });
  });

  test('test_filename_WHEN_setToValidString_THEN_setsConfigValue', () => {
    ErrorLogConfig.filename('error');
    const result = ErrorLogConfig.get();
    expect(result).toEqual({ filename: 'error' });
  });

  test('test_addTimestamp_WHEN_setToTrue_THEN_setsConfigValue', () => {
    ErrorLogConfig.addTimestamp(true);
    const result = ErrorLogConfig.get();
    expect(result).toEqual({ addTimestamp: true });
  });

  test('test_addTimestamp_WHEN_setToFalse_THEN_setsConfigValue', () => {
    ErrorLogConfig.addTimestamp(false);
    const result = ErrorLogConfig.get();
    expect(result).toEqual({ addTimestamp: false });
  });

  test('test_print_WHEN_setToTrue_THEN_setsConfigValue', () => {
    ErrorLogConfig.print(true);
    const result = ErrorLogConfig.get();
    expect(result).toEqual({ print: true });
  });

  test('test_print_WHEN_setToFalse_THEN_setsConfigValue', () => {
    ErrorLogConfig.print(false);
    const result = ErrorLogConfig.get();
    expect(result).toEqual({ print: false });
  });

  test('test_throwError_WHEN_setToTrue_THEN_setsConfigValue', () => {
    ErrorLogConfig.throwError(true);
    const result = ErrorLogConfig.get();
    expect(result).toEqual({ throwError: true });
  });

  test('test_throwError_WHEN_setToFalse_THEN_setsConfigValue', () => {
    ErrorLogConfig.throwError(false);
    const result = ErrorLogConfig.get();
    expect(result).toEqual({ throwError: false });
  });

  test('test_directory_WHEN_setMultipleTimes_THEN_updatesValue', () => {
    ErrorLogConfig.directory('./logs');
    expect(ErrorLogConfig.get().directory).toBe('./logs');
    
    ErrorLogConfig.directory('./errors');
    expect(ErrorLogConfig.get().directory).toBe('./errors');
  });

  test('test_filename_WHEN_setMultipleTimes_THEN_updatesValue', () => {
    ErrorLogConfig.filename('error');
    expect(ErrorLogConfig.get().filename).toBe('error');
    
    ErrorLogConfig.filename('app-error');
    expect(ErrorLogConfig.get().filename).toBe('app-error');
  });

  test('test_addTimestamp_WHEN_setMultipleTimes_THEN_updatesValue', () => {
    ErrorLogConfig.addTimestamp(true);
    expect(ErrorLogConfig.get().addTimestamp).toBe(true);
    
    ErrorLogConfig.addTimestamp(false);
    expect(ErrorLogConfig.get().addTimestamp).toBe(false);
  });

  test('test_print_WHEN_setMultipleTimes_THEN_updatesValue', () => {
    ErrorLogConfig.print(true);
    expect(ErrorLogConfig.get().print).toBe(true);
    
    ErrorLogConfig.print(false);
    expect(ErrorLogConfig.get().print).toBe(false);
  });

  test('test_throwError_WHEN_setMultipleTimes_THEN_updatesValue', () => {
    ErrorLogConfig.throwError(true);
    expect(ErrorLogConfig.get().throwError).toBe(true);
    
    ErrorLogConfig.throwError(false);
    expect(ErrorLogConfig.get().throwError).toBe(false);
  });

  test('test_setters_WHEN_setAllValues_THEN_setsAllValues', () => {
    ErrorLogConfig.directory('./logs');
    ErrorLogConfig.filename('error');
    ErrorLogConfig.addTimestamp(true);
    ErrorLogConfig.print(false);
    ErrorLogConfig.throwError(true);
    const result = ErrorLogConfig.get();
    expect(result).toEqual({
      directory: './logs',
      filename: 'error',
      addTimestamp: true,
      print: false,
      throwError: true,
    });
  });

  test('test_reset_WHEN_called_THEN_clearsConfig', () => {
    ErrorLogConfig.directory('./logs');
    ErrorLogConfig.filename('error');
    ErrorLogConfig.addTimestamp(true);
    ErrorLogConfig.print(false);
    ErrorLogConfig.throwError(true);
    ErrorLogConfig.reset();
    const result = ErrorLogConfig.get();
    expect(result).toEqual({});
  });

  test('test_directory_WHEN_setToNonString_THEN_throwsError', () => {
    expect(() => {
      ErrorLogConfig.directory(123);
    }).toThrow(SaltoolsError);
  });

  test('test_filename_WHEN_setToNonString_THEN_throwsError', () => {
    expect(() => {
      ErrorLogConfig.filename(true);
    }).toThrow(SaltoolsError);
  });

  test('test_addTimestamp_WHEN_setToNonBoolean_THEN_throwsError', () => {
    expect(() => {
      ErrorLogConfig.addTimestamp('true');
    }).toThrow(SaltoolsError);
  });

  test('test_print_WHEN_setToNonBoolean_THEN_throwsError', () => {
    expect(() => {
      ErrorLogConfig.print(1);
    }).toThrow(SaltoolsError);
  });

  test('test_throwError_WHEN_setToNonBoolean_THEN_throwsError', () => {
    expect(() => {
      ErrorLogConfig.throwError('false');
    }).toThrow(SaltoolsError);
  });

  test('test_get_WHEN_afterReset_THEN_returnsEmptyObject', () => {
    ErrorLogConfig.directory('./logs');
    ErrorLogConfig.filename('error');
    ErrorLogConfig.addTimestamp(true);
    ErrorLogConfig.print(false);
    ErrorLogConfig.throwError(true);
    ErrorLogConfig.reset();
    const result = ErrorLogConfig.get();
    expect(result).toEqual({});
    expect(result.directory).toBeUndefined();
    expect(result.filename).toBeUndefined();
    expect(result.addTimestamp).toBeUndefined();
    expect(result.print).toBeUndefined();
    expect(result.throwError).toBeUndefined();
  });
});

