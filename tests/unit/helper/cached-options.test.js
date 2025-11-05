import { describe, test, expect } from '@jest/globals';
import CachedOptions from 'src/helper/cachedOptions.js';

describe('CachedOptions', () => {
  test('test_isCached_WHEN_noOptionsCached_THEN_returnsFalse', () => {
    const cachedOptions = new CachedOptions();
    const result = cachedOptions.isCached({ key: 'value' });
    expect(result).toBe(false);
  });

  test('test_isCached_WHEN_optionsCached_THEN_returnsTrue', () => {
    const cachedOptions = new CachedOptions();
    const options = { key: 'value' };
    cachedOptions.cache(options);
    const result = cachedOptions.isCached(options);
    expect(result).toBe(true);
  });

  test('test_isCached_WHEN_differentOptions_THEN_returnsFalse', () => {
    const cachedOptions = new CachedOptions();
    cachedOptions.cache({ key: 'value1' });
    const result = cachedOptions.isCached({ key: 'value2' });
    expect(result).toBe(false);
  });

  test('test_isCached_WHEN_sameOptionsDifferentInstance_THEN_returnsTrue', () => {
    const cachedOptions = new CachedOptions();
    cachedOptions.cache({ key: 'value' });
    const result = cachedOptions.isCached({ key: 'value' });
    expect(result).toBe(true);
  });

  test('test_isCached_WHEN_multipleOptionsCached_THEN_checksCorrectly', () => {
    const cachedOptions = new CachedOptions();
    cachedOptions.cache({ key1: 'value1' });
    cachedOptions.cache({ key2: 'value2' });
    expect(cachedOptions.isCached({ key1: 'value1' })).toBe(true);
    expect(cachedOptions.isCached({ key2: 'value2' })).toBe(true);
    expect(cachedOptions.isCached({ key3: 'value3' })).toBe(false);
  });

  test('test_isCached_WHEN_emptyOptions_THEN_returnsFalse', () => {
    const cachedOptions = new CachedOptions();
    const result = cachedOptions.isCached({});
    expect(result).toBe(false);
  });

  test('test_isCached_WHEN_emptyOptionsCached_THEN_returnsTrue', () => {
    const cachedOptions = new CachedOptions();
    cachedOptions.cache({});
    const result = cachedOptions.isCached({});
    expect(result).toBe(true);
  });

  test('test_isCached_WHEN_optionsWithMultipleProperties_THEN_checksCorrectly', () => {
    const cachedOptions = new CachedOptions();
    cachedOptions.cache({ prop1: 'value1', prop2: 'value2', prop3: 'value3' });
    expect(cachedOptions.isCached({ prop1: 'value1', prop2: 'value2', prop3: 'value3' })).toBe(
      true
    );
    expect(cachedOptions.isCached({ prop1: 'value1', prop2: 'value2' })).toBe(false);
  });

  test('test_isCached_WHEN_optionsWithNumericValues_THEN_checksCorrectly', () => {
    const cachedOptions = new CachedOptions();
    cachedOptions.cache({ count: 5, price: 10.5 });
    expect(cachedOptions.isCached({ count: 5, price: 10.5 })).toBe(true);
    expect(cachedOptions.isCached({ count: 5, price: 10.6 })).toBe(false);
  });

  test('test_isCached_WHEN_optionsWithBooleanValues_THEN_checksCorrectly', () => {
    const cachedOptions = new CachedOptions();
    cachedOptions.cache({ enabled: true, disabled: false });
    expect(cachedOptions.isCached({ enabled: true, disabled: false })).toBe(true);
    expect(cachedOptions.isCached({ enabled: false, disabled: true })).toBe(false);
  });

  test('test_isCached_WHEN_optionsWithNullValues_THEN_checksCorrectly', () => {
    const cachedOptions = new CachedOptions();
    cachedOptions.cache({ key: null });
    expect(cachedOptions.isCached({ key: null })).toBe(true);
    expect(cachedOptions.isCached({ key: 'value' })).toBe(false);
  });

  test('test_isCached_WHEN_optionsWithUndefinedValues_THEN_checksCorrectly', () => {
    const cachedOptions = new CachedOptions();
    cachedOptions.cache({ key: undefined });
    expect(cachedOptions.isCached({ key: undefined })).toBe(true);
  });

  test('test_cache_WHEN_sameOptionsCachedTwice_THEN_bothCached', () => {
    const cachedOptions = new CachedOptions();
    const options = { key: 'value' };
    cachedOptions.cache(options);
    cachedOptions.cache(options);
    expect(cachedOptions.isCached(options)).toBe(true);
  });

  test('test_isCached_WHEN_sameValueDifferentTypes_THEN_returnsFalse', () => {
    const cachedOptions = new CachedOptions();
    cachedOptions.cache({ key: 'true' });
    expect(cachedOptions.isCached({ key: true })).toBe(false);
    expect(cachedOptions.isCached({ key: 'true' })).toBe(true);
  });

  test('test_isCached_WHEN_sameValueDifferentTypesNumbers_THEN_returnsFalse', () => {
    const cachedOptions = new CachedOptions();
    cachedOptions.cache({ key: '123' });
    expect(cachedOptions.isCached({ key: 123 })).toBe(false);
    expect(cachedOptions.isCached({ key: '123' })).toBe(true);
  });

  test('test_isCached_WHEN_samePropertiesDifferentOrder_THEN_returnsFalse', () => {
    const cachedOptions = new CachedOptions();
    cachedOptions.cache({ a: 1, b: 2, c: 3 });
    expect(cachedOptions.isCached({ c: 3, a: 1, b: 2 })).toBe(false);
    expect(cachedOptions.isCached({ b: 2, c: 3, a: 1 })).toBe(false);
    expect(cachedOptions.isCached({ a: 1, b: 2, c: 3 })).toBe(true);
  });
});
