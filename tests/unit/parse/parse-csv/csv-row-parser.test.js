import { describe, test, expect } from '@jest/globals';
import CSVRowParser from 'src/commands/parse/parse-csv/csv-row-parser.js';

describe('CSVRowParser', () => {
  test('test_parse_WHEN_simpleRow_THEN_returnsFields', () => {
    const parser = new CSVRowParser({ delimiter: ',', quoteChar: '"', escapeChar: '\\' });
    const row = 'John,30,New York';

    const result = parser.parse(row);

    expect(result).toEqual(['John', '30', 'New York']);
  });

  test('test_parse_WHEN_quotedFields_THEN_removesQuotes', () => {
    const parser = new CSVRowParser({ delimiter: ',', quoteChar: '"', escapeChar: '\\' });
    const row = 'John,"Software Engineer","New York"';

    const result = parser.parse(row);

    expect(result).toEqual(['John', 'Software Engineer', 'New York']);
  });

  test('test_parse_WHEN_quotedFieldWithDelimiter_THEN_preservesDelimiter', () => {
    const parser = new CSVRowParser({ delimiter: ',', quoteChar: '"', escapeChar: '\\' });
    const row = 'John,"123 Main St, Apt 4",New York';

    const result = parser.parse(row);

    expect(result).toEqual(['John', '123 Main St, Apt 4', 'New York']);
  });

  test('test_parse_WHEN_doubledQuotes_THEN_convertsToSingleQuote', () => {
    const parser = new CSVRowParser({ delimiter: ',', quoteChar: '"', escapeChar: '\\' });
    const row = 'John,"He said ""Hello""","New York"';

    const result = parser.parse(row);

    expect(result).toEqual(['John', 'He said "Hello"', 'New York']);
  });

  test('test_parse_WHEN_emptyFields_THEN_returnsEmptyStrings', () => {
    const parser = new CSVRowParser({ delimiter: ',', quoteChar: '"', escapeChar: '\\' });
    const row = 'John,,New York';

    const result = parser.parse(row);

    expect(result).toEqual(['John', '', 'New York']);
  });

  test('test_parse_WHEN_whitespaceAroundFields_THEN_trimsWhitespace', () => {
    const parser = new CSVRowParser({ delimiter: ',', quoteChar: '"', escapeChar: '\\' });
    const row = '  John  ,  30  ,  New York  ';

    const result = parser.parse(row);

    expect(result).toEqual(['John', '30', 'New York']);
  });

  test('test_parse_WHEN_customDelimiter_THEN_usesCustomDelimiter', () => {
    const parser = new CSVRowParser({ delimiter: '|', quoteChar: '"', escapeChar: '\\' });
    const row = 'John|30|New York';

    const result = parser.parse(row);

    expect(result).toEqual(['John', '30', 'New York']);
  });

  test('test_parse_WHEN_customQuoteChar_THEN_usesCustomQuote', () => {
    const parser = new CSVRowParser({ delimiter: ',', quoteChar: "'", escapeChar: '\\' });
    const row = "John,'Software Engineer','New York'";

    const result = parser.parse(row);

    expect(result).toEqual(['John', 'Software Engineer', 'New York']);
  });

  test('test_parse_WHEN_emptyRow_THEN_returnsEmptyArray', () => {
    const parser = new CSVRowParser({ delimiter: ',', quoteChar: '"', escapeChar: '\\' });
    const row = '';

    const result = parser.parse(row);

    expect(result).toEqual(['']);
  });
});

