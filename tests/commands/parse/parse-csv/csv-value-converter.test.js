import { describe, test, expect } from '@jest/globals';
import CSVValueConverter from 'src/commands/parse/parse-csv/csv-value-converter.js';

describe('CSVValueConverter', () => {
  test('test_convert_WHEN_emptyString_THEN_returnsEmptyString', () => {
    const converter = new CSVValueConverter();

    const result = converter.convert('');

    expect(result).toBe('');
  });

  test('test_convert_WHEN_trueString_THEN_returnsBooleanTrue', () => {
    const converter = new CSVValueConverter();

    const result = converter.convert('true');

    expect(result).toBe(true);
    expect(typeof result).toBe('boolean');
  });

  test('test_convert_WHEN_falseString_THEN_returnsBooleanFalse', () => {
    const converter = new CSVValueConverter();

    const result = converter.convert('false');

    expect(result).toBe(false);
    expect(typeof result).toBe('boolean');
  });

  test('test_convert_WHEN_uppercaseBoolean_THEN_returnsBoolean', () => {
    const converter = new CSVValueConverter();

    expect(converter.convert('TRUE')).toBe(true);
    expect(converter.convert('FALSE')).toBe(false);
    expect(converter.convert('True')).toBe(true);
    expect(converter.convert('False')).toBe(false);
  });

  test('test_convert_WHEN_integerString_THEN_returnsNumber', () => {
    const converter = new CSVValueConverter();

    const result = converter.convert('30');

    expect(result).toBe(30);
    expect(typeof result).toBe('number');
  });

  test('test_convert_WHEN_floatString_THEN_returnsNumber', () => {
    const converter = new CSVValueConverter();

    const result = converter.convert('99.99');

    expect(result).toBe(99.99);
    expect(typeof result).toBe('number');
  });

  test('test_convert_WHEN_negativeNumber_THEN_returnsNumber', () => {
    const converter = new CSVValueConverter();

    const result = converter.convert('-10');

    expect(result).toBe(-10);
    expect(typeof result).toBe('number');
  });

  test('test_convert_WHEN_zero_THEN_returnsZero', () => {
    const converter = new CSVValueConverter();

    const result = converter.convert('0');

    expect(result).toBe(0);
    expect(typeof result).toBe('number');
  });

  test('test_convert_WHEN_stringWithSpaces_THEN_keepsAsString', () => {
    const converter = new CSVValueConverter();

    const result = converter.convert('John Doe');

    expect(result).toBe('John Doe');
    expect(typeof result).toBe('string');
  });

  test('test_convert_WHEN_stringLikeBoolean_THEN_keepsAsString', () => {
    const converter = new CSVValueConverter();

    const result = converter.convert('true value');

    expect(result).toBe('true value');
    expect(typeof result).toBe('string');
  });

  test('test_convert_WHEN_alphanumericString_THEN_keepsAsString', () => {
    const converter = new CSVValueConverter();

    const result = converter.convert('ABC123');

    expect(result).toBe('ABC123');
    expect(typeof result).toBe('string');
  });

  test('test_convert_WHEN_whitespaceAroundBoolean_THEN_returnsBoolean', () => {
    const converter = new CSVValueConverter();

    expect(converter.convert('  true  ')).toBe(true);
    expect(converter.convert('  false  ')).toBe(false);
  });

  test('test_convert_WHEN_whitespaceOnly_THEN_returnsEmptyString', () => {
    const converter = new CSVValueConverter();

    expect(converter.convert('   ')).toBe('');
    expect(converter.convert('\t')).toBe('');
    expect(converter.convert('\n')).toBe('');
  });

  test('test_convert_WHEN_NaNString_THEN_keepsAsString', () => {
    const converter = new CSVValueConverter();

    const result = converter.convert('NaN');

    expect(result).toBe('NaN');
    expect(typeof result).toBe('string');
  });

  test('test_convert_WHEN_InfinityString_THEN_keepsAsString', () => {
    const converter = new CSVValueConverter();

    expect(converter.convert('Infinity')).toBe('Infinity');
    expect(converter.convert('-Infinity')).toBe('-Infinity');
    expect(typeof converter.convert('Infinity')).toBe('string');
  });
});

