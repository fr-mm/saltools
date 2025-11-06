import { describe, test, expect, beforeEach } from '@jest/globals';
import OptionsService from 'src/helper/options-service.js';
import Config from 'src/commands/config.js';

describe('OptionsService', () => {
  beforeEach(() => {
    Config.reset();
  });

  test('test_update_WHEN_noConfig_THEN_returnsMergedOptions', () => {
    const defaultOptions = { allowEmpty: false, trim: true };
    const options = { trim: false };
    const result = OptionsService.update(options, defaultOptions);
    expect(result).toEqual({ allowEmpty: false, trim: false });
    expect(options).toEqual({ trim: false });
  });

  test('test_update_WHEN_configHasValueAndOptionUndefined_THEN_appliesConfigToMergedOptions', () => {
    Config.throwError(false);
    const defaultOptions = { allowEmpty: false, throwError: true };
    const options = { allowEmpty: true };
    const result = OptionsService.update(options, defaultOptions);
    expect(result).toEqual({ allowEmpty: true, throwError: false });
    expect(options).toEqual({ allowEmpty: true });
  });

  test('test_update_WHEN_configHasValueAndOptionDefined_THEN_doesNotOverrideOption', () => {
    Config.throwError(false);
    const defaultOptions = { allowEmpty: false, throwError: true };
    const options = { allowEmpty: true, throwError: true };
    const result = OptionsService.update(options, defaultOptions);
    expect(result).toEqual({ allowEmpty: true, throwError: true });
    expect(options).toEqual({ allowEmpty: true, throwError: true });
  });

  test('test_update_WHEN_configUndefined_THEN_doesNotSetInMergedOptions', () => {
    Config.reset();
    const defaultOptions = { allowEmpty: false };
    const options = {};
    const result = OptionsService.update(options, defaultOptions);
    expect(result).toEqual({ allowEmpty: false });
    expect(result.throwError).toBeUndefined();
  });

  test('test_update_WHEN_multipleConfigValues_THEN_appliesAllToMergedOptions', () => {
    Config.throwError(false);
    const defaultOptions = { allowEmpty: false, throwError: true, trim: true };
    const options = { allowEmpty: true };
    const result = OptionsService.update(options, defaultOptions);
    expect(result).toEqual({ allowEmpty: true, throwError: false, trim: true });
  });

  test('test_update_WHEN_emptyOptionsAndDefaultOptions_THEN_returnsEmptyObject', () => {
    const defaultOptions = {};
    const options = {};
    const result = OptionsService.update(options, defaultOptions);
    expect(result).toEqual({});
  });

  test('test_update_WHEN_optionsOverrideDefaults_THEN_usesOptions', () => {
    const defaultOptions = { allowEmpty: false, trim: true };
    const options = { allowEmpty: true, trim: false };
    const result = OptionsService.update(options, defaultOptions);
    expect(result).toEqual({ allowEmpty: true, trim: false });
  });

  test('test_update_WHEN_configValueIsFalse_THEN_appliesFalseToMergedOptions', () => {
    Config.throwError(false);
    const defaultOptions = { throwError: true };
    const options = {};
    const result = OptionsService.update(options, defaultOptions);
    expect(result).toEqual({ throwError: false });
  });

  test('test_update_WHEN_configValueIsTrue_THEN_appliesTrueToMergedOptions', () => {
    Config.throwError(true);
    const defaultOptions = { throwError: false };
    const options = {};
    const result = OptionsService.update(options, defaultOptions);
    expect(result).toEqual({ throwError: true });
  });

  test('test_update_WHEN_optionsObjectNotModified_THEN_originalOptionsUnchanged', () => {
    Config.throwError(false);
    const defaultOptions = { allowEmpty: false, throwError: true };
    const options = { allowEmpty: true };
    const originalOptions = { ...options };
    OptionsService.update(options, defaultOptions);
    expect(options).toEqual(originalOptions);
  });

  test('test_update_WHEN_configHasMultipleKeys_THEN_appliesAllToMergedOptions', () => {
    Config.throwError(false);
    const defaultOptions = { allowEmpty: false, throwError: true, trim: true, capitalize: false };
    const options = { allowEmpty: true };
    const result = OptionsService.update(options, defaultOptions);
    expect(result.throwError).toBe(false);
    expect(result.allowEmpty).toBe(true);
    expect(result.trim).toBe(true);
    expect(result.capitalize).toBe(false);
  });

  test('test_update_WHEN_optionExplicitlySetToUndefined_THEN_configApplied', () => {
    Config.throwError(false);
    const defaultOptions = { throwError: true };
    const options = { throwError: undefined };
    const result = OptionsService.update(options, defaultOptions);
    expect(result.throwError).toBe(false);
  });
});
