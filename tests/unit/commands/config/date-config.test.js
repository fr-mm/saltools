import { describe, test, expect, beforeEach } from '@jest/globals';
import DateConfig from 'src/commands/config/date-config.js';
import SaltoolsError from 'src/errors/saltools-error.js';

describe('DateConfig', () => {
  beforeEach(() => {
    DateConfig.reset();
  });

  test('test_get_WHEN_noConfigSet_THEN_returnsEmptyObject', () => {
    const result = DateConfig.get();
    expect(result).toEqual({});
  });

  test('test_inputFormat_WHEN_setToValidString_THEN_setsConfigValue', () => {
    DateConfig.inputFormat('dd/mm/yyyy');
    const result = DateConfig.get();
    expect(result).toEqual({ inputFormat: 'dd/mm/yyyy' });
  });

  test('test_outputFormat_WHEN_setToValidString_THEN_setsConfigValue', () => {
    DateConfig.outputFormat('mm/dd/yyyy');
    const result = DateConfig.get();
    expect(result).toEqual({ outputFormat: 'mm/dd/yyyy' });
  });

  test('test_inputFormat_WHEN_setMultipleTimes_THEN_updatesValue', () => {
    DateConfig.inputFormat('dd/mm/yyyy');
    expect(DateConfig.get().inputFormat).toBe('dd/mm/yyyy');
    
    DateConfig.inputFormat('iso');
    expect(DateConfig.get().inputFormat).toBe('iso');
  });

  test('test_outputFormat_WHEN_setMultipleTimes_THEN_updatesValue', () => {
    DateConfig.outputFormat('dd/mm/yyyy');
    expect(DateConfig.get().outputFormat).toBe('dd/mm/yyyy');
    
    DateConfig.outputFormat('mm/dd/yyyy');
    expect(DateConfig.get().outputFormat).toBe('mm/dd/yyyy');
  });

  test('test_inputFormat_WHEN_setBothFormats_THEN_setsBothValues', () => {
    DateConfig.inputFormat('dd/mm/yyyy');
    DateConfig.outputFormat('mm/dd/yyyy');
    const result = DateConfig.get();
    expect(result).toEqual({
      inputFormat: 'dd/mm/yyyy',
      outputFormat: 'mm/dd/yyyy',
    });
  });

  test('test_reset_WHEN_called_THEN_clearsConfig', () => {
    DateConfig.inputFormat('dd/mm/yyyy');
    DateConfig.outputFormat('mm/dd/yyyy');
    DateConfig.reset();
    const result = DateConfig.get();
    expect(result).toEqual({});
  });

  test('test_inputFormat_WHEN_setToNonString_THEN_throwsError', () => {
    expect(() => {
      DateConfig.inputFormat(123);
    }).toThrow(SaltoolsError);
  });

  test('test_outputFormat_WHEN_setToNonString_THEN_throwsError', () => {
    expect(() => {
      DateConfig.outputFormat(true);
    }).toThrow(SaltoolsError);
  });

  test('test_get_WHEN_afterReset_THEN_returnsEmptyObject', () => {
    DateConfig.inputFormat('dd/mm/yyyy');
    DateConfig.outputFormat('mm/dd/yyyy');
    DateConfig.reset();
    const result = DateConfig.get();
    expect(result).toEqual({});
    expect(result.inputFormat).toBeUndefined();
    expect(result.outputFormat).toBeUndefined();
  });
});

