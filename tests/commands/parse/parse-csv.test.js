import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import fs from 'fs';
import path from 'path';
import { csv } from 'src/commands/parse/index.js';
import SaltoolsError from 'src/errors/saltools-error.js';

describe('parse-csv', () => {
  const testDir = path.join(process.cwd(), 'tests', 'temp');

  beforeEach(() => {
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true });
    }
  });

  afterEach(() => {
    if (fs.existsSync(testDir)) {
      const files = fs.readdirSync(testDir);
      files.forEach(file => {
        fs.unlinkSync(path.join(testDir, file));
      });
      fs.rmdirSync(testDir);
    }
  });

  test('test_csv_WHEN_validCSVFile_THEN_returnsArrayOfObjects', () => {
    const filePath = path.join(testDir, 'test.csv');
    const csvContent = 'name,age,city\nJohn,30,New York\nJane,25,London';
    fs.writeFileSync(filePath, csvContent);

    const result = csv(filePath);
    
    expect(result).toEqual([
      { name: 'John', age: 30, city: 'New York' },
      { name: 'Jane', age: 25, city: 'London' }
    ]);
  });

  test('test_csv_WHEN_emptyCSVFile_THEN_returnsEmptyArray', () => {
    const filePath = path.join(testDir, 'empty.csv');
    fs.writeFileSync(filePath, '');

    const result = csv(filePath);
    
    expect(result).toEqual([]);
  });

  test('test_csv_WHEN_onlyHeaders_THEN_returnsEmptyArray', () => {
    const filePath = path.join(testDir, 'headers-only.csv');
    fs.writeFileSync(filePath, 'name,age,city');

    const result = csv(filePath);
    
    expect(result).toEqual([]);
  });

  test('test_csv_WHEN_quotedFields_THEN_parsesCorrectly', () => {
    const filePath = path.join(testDir, 'quoted.csv');
    const csvContent = 'name,description\nJohn,"Software Engineer"\nJane,"Product Manager"';
    fs.writeFileSync(filePath, csvContent);

    const result = csv(filePath);
    
    expect(result).toEqual([
      { name: 'John', description: 'Software Engineer' },
      { name: 'Jane', description: 'Product Manager' }
    ]);
  });

  test('test_csv_WHEN_quotedFieldsWithDelimiters_THEN_parsesCorrectly', () => {
    const filePath = path.join(testDir, 'quoted-delimiter.csv');
    const csvContent = 'name,address\nJohn,"123 Main St, Apt 4"\nJane,"456 Oak Ave, Suite 2"';
    fs.writeFileSync(filePath, csvContent);

    const result = csv(filePath);
    
    expect(result).toEqual([
      { name: 'John', address: '123 Main St, Apt 4' },
      { name: 'Jane', address: '456 Oak Ave, Suite 2' }
    ]);
  });

  test('test_csv_WHEN_quotedFieldsWithNewlines_THEN_parsesCorrectly', () => {
    const filePath = path.join(testDir, 'quoted-newline.csv');
    const csvContent = 'name,note\nJohn,"First line\nSecond line"\nJane,"Single note"';
    fs.writeFileSync(filePath, csvContent);

    const result = csv(filePath);
    
    expect(result).toEqual([
      { name: 'John', note: 'First line\nSecond line' },
      { name: 'Jane', note: 'Single note' }
    ]);
  });

  test('test_csv_WHEN_escapedQuotes_THEN_parsesCorrectly', () => {
    const filePath = path.join(testDir, 'escaped-quotes.csv');
    const csvContent = 'name,quote\nJohn,"He said ""Hello"""\nJane,"She said ""Hi"""';
    fs.writeFileSync(filePath, csvContent);

    const result = csv(filePath);
    
    expect(result).toEqual([
      { name: 'John', quote: 'He said "Hello"' },
      { name: 'Jane', quote: 'She said "Hi"' }
    ]);
  });

  test('test_csv_WHEN_customDelimiter_THEN_parsesCorrectly', () => {
    const filePath = path.join(testDir, 'custom-delimiter.csv');
    const csvContent = 'name|age|city\nJohn|30|New York\nJane|25|London';
    fs.writeFileSync(filePath, csvContent);

    const result = csv(filePath, { delimiter: '|' });
    
    expect(result).toEqual([
      { name: 'John', age: 30, city: 'New York' },
      { name: 'Jane', age: 25, city: 'London' }
    ]);
  });

  test('test_csv_WHEN_customQuoteChar_THEN_parsesCorrectly', () => {
    const filePath = path.join(testDir, 'custom-quote.csv');
    const csvContent = "name,description\nJohn,'Software Engineer'\nJane,'Product Manager'";
    fs.writeFileSync(filePath, csvContent);

    const result = csv(filePath, { quoteChar: "'" });
    
    expect(result).toEqual([
      { name: 'John', description: 'Software Engineer' },
      { name: 'Jane', description: 'Product Manager' }
    ]);
  });

  test('test_csv_WHEN_emptyFields_THEN_returnsEmptyStrings', () => {
    const filePath = path.join(testDir, 'empty-fields.csv');
    const csvContent = 'name,age,city\nJohn,,New York\n,25,London\nJane,30,';
    fs.writeFileSync(filePath, csvContent);

    const result = csv(filePath);
    
    expect(result).toEqual([
      { name: 'John', age: '', city: 'New York' },
      { name: '', age: 25, city: 'London' },
      { name: 'Jane', age: 30, city: '' }
    ]);
  });

  test('test_csv_WHEN_blankLines_THEN_skipsBlankLines', () => {
    const filePath = path.join(testDir, 'blank-lines.csv');
    const csvContent = 'name,age\nJohn,30\n\nJane,25\n  \nBob,40';
    fs.writeFileSync(filePath, csvContent);

    const result = csv(filePath);
    
    expect(result).toEqual([
      { name: 'John', age: 30 },
      { name: 'Jane', age: 25 },
      { name: 'Bob', age: 40 }
    ]);
  });

  test('test_csv_WHEN_whitespaceAroundFields_THEN_trimsWhitespace', () => {
    const filePath = path.join(testDir, 'whitespace.csv');
    const csvContent = 'name,age,city\n  John  ,  30  ,  New York  \n  Jane  ,  25  ,  London  ';
    fs.writeFileSync(filePath, csvContent);

    const result = csv(filePath);
    
    expect(result).toEqual([
      { name: 'John', age: 30, city: 'New York' },
      { name: 'Jane', age: 25, city: 'London' }
    ]);
  });

  test('test_csv_WHEN_singleRow_THEN_returnsSingleObject', () => {
    const filePath = path.join(testDir, 'single-row.csv');
    const csvContent = 'name,age,city\nJohn,30,New York';
    fs.writeFileSync(filePath, csvContent);

    const result = csv(filePath);
    
    expect(result).toEqual([
      { name: 'John', age: 30, city: 'New York' }
    ]);
  });

  test('test_csv_WHEN_fileNotFound_THEN_throwsError', () => {
    const filePath = path.join(testDir, 'nonexistent.csv');

    expect(() => {
      csv(filePath);
    }).toThrow(SaltoolsError);
    
    expect(() => {
      csv(filePath);
    }).toThrow('Arquivo');
  });

  test('test_csv_WHEN_notCSVFile_THEN_throwsError', () => {
    const filePath = path.join(testDir, 'test.txt');
    fs.writeFileSync(filePath, 'some content');

    expect(() => {
      csv(filePath);
    }).toThrow(SaltoolsError);
    
    expect(() => {
      csv(filePath);
    }).toThrow('não é um arquivo CSV');
  });

  test('test_csv_WHEN_pathIsNotString_THEN_throwsError', () => {
    expect(() => {
      csv(123);
    }).toThrow(SaltoolsError);
  });

  test('test_csv_WHEN_delimiterIsNotString_THEN_throwsError', () => {
    const filePath = path.join(testDir, 'test.csv');
    fs.writeFileSync(filePath, 'name,age\nJohn,30');

    expect(() => {
      csv(filePath, { delimiter: 123 });
    }).toThrow(SaltoolsError);
  });

  test('test_csv_WHEN_quoteCharIsNotString_THEN_throwsError', () => {
    const filePath = path.join(testDir, 'test.csv');
    fs.writeFileSync(filePath, 'name,age\nJohn,30');

    expect(() => {
      csv(filePath, { quoteChar: 123 });
    }).toThrow(SaltoolsError);
  });

  test('test_csv_WHEN_escapeCharIsNotString_THEN_throwsError', () => {
    const filePath = path.join(testDir, 'test.csv');
    fs.writeFileSync(filePath, 'name,age\nJohn,30');

    expect(() => {
      csv(filePath, { escapeChar: 123 });
    }).toThrow(SaltoolsError);
  });

  test('test_csv_WHEN_booleanValues_THEN_convertsToBooleans', () => {
    const filePath = path.join(testDir, 'boolean-values.csv');
    const csvContent = 'name,active,verified\nJohn,true,false\nJane,TRUE,FALSE\nBob,True,False';
    fs.writeFileSync(filePath, csvContent);

    const result = csv(filePath);
    
    expect(result).toEqual([
      { name: 'John', active: true, verified: false },
      { name: 'Jane', active: true, verified: false },
      { name: 'Bob', active: true, verified: false }
    ]);
    
    expect(typeof result[0].active).toBe('boolean');
    expect(typeof result[0].verified).toBe('boolean');
  });

  test('test_csv_WHEN_numericValues_THEN_convertsToNumbers', () => {
    const filePath = path.join(testDir, 'numeric-values.csv');
    const csvContent = 'name,age,price,score\nJohn,30,99.99,100\nJane,25,49.50,85.5';
    fs.writeFileSync(filePath, csvContent);

    const result = csv(filePath);
    
    expect(result).toEqual([
      { name: 'John', age: 30, price: 99.99, score: 100 },
      { name: 'Jane', age: 25, price: 49.50, score: 85.5 }
    ]);
    
    expect(typeof result[0].age).toBe('number');
    expect(typeof result[0].price).toBe('number');
    expect(typeof result[0].score).toBe('number');
  });

  test('test_csv_WHEN_mixedTypes_THEN_convertsAppropriately', () => {
    const filePath = path.join(testDir, 'mixed-types.csv');
    const csvContent = 'name,age,active,price,notes\nJohn,30,true,99.99,Description\nJane,25,false,49.50,"Special notes"';
    fs.writeFileSync(filePath, csvContent);

    const result = csv(filePath);
    
    expect(result).toEqual([
      { name: 'John', age: 30, active: true, price: 99.99, notes: 'Description' },
      { name: 'Jane', age: 25, active: false, price: 49.50, notes: 'Special notes' }
    ]);
    
    expect(typeof result[0].name).toBe('string');
    expect(typeof result[0].age).toBe('number');
    expect(typeof result[0].active).toBe('boolean');
    expect(typeof result[0].price).toBe('number');
    expect(typeof result[0].notes).toBe('string');
  });

  test('test_csv_WHEN_zeroAndNegativeNumbers_THEN_convertsToNumbers', () => {
    const filePath = path.join(testDir, 'zero-negative.csv');
    const csvContent = 'name,count,temperature\nJohn,0,-10\nJane,-5,25';
    fs.writeFileSync(filePath, csvContent);

    const result = csv(filePath);
    
    expect(result).toEqual([
      { name: 'John', count: 0, temperature: -10 },
      { name: 'Jane', count: -5, temperature: 25 }
    ]);
    
    expect(typeof result[0].count).toBe('number');
    expect(typeof result[0].temperature).toBe('number');
  });

  test('test_csv_WHEN_stringsThatLookLikeBooleans_THEN_keepsAsStrings', () => {
    const filePath = path.join(testDir, 'string-booleans.csv');
    const csvContent = 'name,status\nJohn,"true value"\nJane,"false alarm"';
    fs.writeFileSync(filePath, csvContent);

    const result = csv(filePath);
    
    expect(result).toEqual([
      { name: 'John', status: 'true value' },
      { name: 'Jane', status: 'false alarm' }
    ]);
    
    expect(typeof result[0].status).toBe('string');
  });
});

