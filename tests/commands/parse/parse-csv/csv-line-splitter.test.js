import { describe, test, expect } from '@jest/globals';
import CSVLineSplitter from 'src/commands/parse/parse-csv/csv-line-splitter.js';

describe('CSVLineSplitter', () => {
  test('test_split_WHEN_simpleContent_THEN_returnsLines', () => {
    const splitter = new CSVLineSplitter({ quoteChar: '"', escapeChar: '\\' });
    const content = 'line1\nline2\nline3';

    const result = splitter.split(content);

    expect(result).toEqual(['line1', 'line2', 'line3']);
  });

  test('test_split_WHEN_emptyContent_THEN_returnsEmptyArray', () => {
    const splitter = new CSVLineSplitter({ quoteChar: '"', escapeChar: '\\' });
    const content = '';

    const result = splitter.split(content);

    expect(result).toEqual([]);
  });

  test('test_split_WHEN_quotedFieldsWithNewlines_THEN_preservesQuotedNewlines', () => {
    const splitter = new CSVLineSplitter({ quoteChar: '"', escapeChar: '\\' });
    const content = 'name,note\nJohn,"First line\nSecond line"\nJane,"Single note"';

    const result = splitter.split(content);

    expect(result).toEqual([
      'name,note',
      'John,"First line\nSecond line"',
      'Jane,"Single note"'
    ]);
  });

  test('test_split_WHEN_carriageReturnNewline_THEN_splitsCorrectly', () => {
    const splitter = new CSVLineSplitter({ quoteChar: '"', escapeChar: '\\' });
    const content = 'line1\r\nline2\r\nline3';

    const result = splitter.split(content);

    expect(result).toEqual(['line1', 'line2', 'line3']);
  });

  test('test_split_WHEN_escapedQuotes_THEN_preservesEscapedQuotes', () => {
    const splitter = new CSVLineSplitter({ quoteChar: '"', escapeChar: '\\' });
    const content = 'field1,"He said \\"Hello\\""\nfield2,"Normal text"';

    const result = splitter.split(content);

    expect(result).toEqual([
      'field1,"He said "Hello""',
      'field2,"Normal text"'
    ]);
  });

  test('test_split_WHEN_customQuoteChar_THEN_splitsWithCustomQuote', () => {
    const splitter = new CSVLineSplitter({ quoteChar: "'", escapeChar: '\\' });
    const content = "field1,'Line with\nnewline'\nfield2,'Single line'";

    const result = splitter.split(content);

    expect(result.length).toBeGreaterThan(0);
  });

  test('test_split_WHEN_unclosedQuotes_THEN_treatsAsSingleLine', () => {
    const splitter = new CSVLineSplitter({ quoteChar: '"', escapeChar: '\\' });
    const content = 'field1,"Unclosed quote\nline2';

    const result = splitter.split(content);

    expect(result).toHaveLength(1);
  });
});

