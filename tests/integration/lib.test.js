import { describe, test, expect, jest, beforeEach, afterEach } from '@jest/globals';
import { helloWorld, parse, errors } from 'src/index.js';
import fs from 'fs';
import path from 'path';

const saltools = { helloWorld, parse, errors };

describe('saltools - integration tests', () => {
  describe('exports', () => {
    test('test_mainExport_WHEN_imported_THEN_exportsAllPublicAPI', () => {
      expect(saltools.helloWorld).toBeDefined();
      expect(typeof saltools.helloWorld).toBe('function');
      expect(saltools.parse).toBeDefined();
      expect(typeof saltools.parse).toBe('object');
      expect(saltools.errors).toBeDefined();
    });

    test('test_parseExport_WHEN_accessed_THEN_exportsAllParseFunctions', () => {
      expect(saltools.parse.string).toBeDefined();
      expect(typeof saltools.parse.string).toBe('function');
      expect(saltools.parse.number).toBeDefined();
      expect(typeof saltools.parse.number).toBe('function');
      expect(saltools.parse.integer).toBeDefined();
      expect(typeof saltools.parse.integer).toBe('function');
      expect(saltools.parse.phone).toBeDefined();
      expect(typeof saltools.parse.phone).toBe('function');
      expect(saltools.parse.date).toBeDefined();
      expect(typeof saltools.parse.date).toBe('function');
      expect(saltools.parse.csv).toBeDefined();
      expect(typeof saltools.parse.csv).toBe('function');
      expect(saltools.parse.fwf).toBeDefined();
      expect(typeof saltools.parse.fwf).toBe('function');
      expect(saltools.parse.email).toBeDefined();
      expect(typeof saltools.parse.email).toBe('function');
      expect(saltools.parse.doc).toBeDefined();
      expect(typeof saltools.parse.doc).toBe('function');
    });
  });

  describe('parse.string', () => {
    test('test_parseString_WHEN_validString_THEN_returnsTrimmedString', () => {
      const result = saltools.parse.string('  joão silva  ');
      expect(result).toBe('joão silva');
    });

    test('test_parseString_WHEN_withCapitalize_THEN_returnsCapitalizedString', () => {
      const result = saltools.parse.string('  joão silva  ', { capitalize: true });
      expect(result).toBe('João Silva');
    });

    test('test_parseString_WHEN_withCast_THEN_convertsToString', () => {
      const result = saltools.parse.string(123, { cast: true });
      expect(result).toBe('123');
    });

    test('test_parseString_WHEN_emptyStringWithThrowErrorFalse_THEN_returnsNull', () => {
      const result = saltools.parse.string('', { throwError: false });
      expect(result).toBeNull();
    });

    test('test_parseString_WHEN_invalidInput_THEN_throwsError', () => {
      expect(() => {
        saltools.parse.string(null);
      }).toThrow();
    });
  });

  describe('parse.number', () => {
    test('test_parseNumber_WHEN_validString_THEN_returnsNumber', () => {
      const result = saltools.parse.number('123.45');
      expect(result).toBe(123.45);
    });

    test('test_parseNumber_WHEN_negativeWithAllowNegative_THEN_returnsNegativeNumber', () => {
      const result = saltools.parse.number('-10', { allowNegative: true });
      expect(result).toBe(-10);
    });

    test('test_parseNumber_WHEN_zeroWithAllowZero_THEN_returnsZero', () => {
      const result = saltools.parse.number('0', { allowZero: true });
      expect(result).toBe(0);
    });

    test('test_parseNumber_WHEN_invalidInput_THEN_throwsError', () => {
      expect(() => {
        saltools.parse.number('invalid');
      }).toThrow();
    });
  });

  describe('parse.integer', () => {
    test('test_parseInteger_WHEN_validString_THEN_returnsInteger', () => {
      const result = saltools.parse.integer('123');
      expect(result).toBe(123);
    });

    test('test_parseInteger_WHEN_decimal_THEN_throwsError', () => {
      expect(() => {
        saltools.parse.integer('123.45');
      }).toThrow();
    });
  });

  describe('parse.phone', () => {
    test('test_parsePhone_WHEN_validPhone_THEN_returnsFormattedPhone', () => {
      const result = saltools.parse.phone('11987654321', {
        numbersOnly: false,
        addCountryCode: false,
      });
      expect(result).toBe('(11) 98765-4321');
    });

    test('test_parsePhone_WHEN_withCountryCode_THEN_includesCountryCode', () => {
      const result = saltools.parse.phone('11987654321', {
        numbersOnly: false,
      });
      expect(result).toBe('55 (11) 98765-4321');
    });

    test('test_parsePhone_WHEN_withPlusPrefix_THEN_includesPlusPrefix', () => {
      const result = saltools.parse.phone('11987654321', {
        addPlusPrefix: true,
      });
      expect(result).toBe('+5511987654321');
    });

    test('test_parsePhone_WHEN_invalidPhone_THEN_throwsError', () => {
      expect(() => {
        saltools.parse.phone('123');
      }).toThrow();
    });
  });

  describe('parse.date', () => {
    test('test_parseDate_WHEN_isoToFormatted_THEN_convertsFormat', () => {
      const result = saltools.parse.date('2024-03-15T10:30:00Z', {
        inputFormat: 'iso',
        outputFormat: 'dd/mm/yyyy',
      });
      expect(result).toBe('15/03/2024');
    });

    test('test_parseDate_WHEN_ddmmToMMDD_THEN_convertsFormat', () => {
      const result = saltools.parse.date('15/03/2024', {
        inputFormat: 'dd/mm/yyyy',
        outputFormat: 'mm/dd/yyyy',
      });
      expect(result).toBe('03/15/2024');
    });

    test('test_parseDate_WHEN_noSeparators_THEN_parsesCorrectly', () => {
      const result = saltools.parse.date('15032024', {
        inputFormat: 'ddmmyyyy',
        outputFormat: 'dd/mm/yyyy',
      });
      expect(result).toBe('15/03/2024');
    });

    test('test_parseDate_WHEN_withTwoDigitYear_THEN_returnsTwoDigitYear', () => {
      const result = saltools.parse.date('15/03/2024', {
        inputFormat: 'dd/mm/yyyy',
        outputFormat: 'dd/mm/yy',
      });
      expect(result).toBe('15/03/24');
    });

    test('test_parseDate_WHEN_invalidDate_THEN_throwsError', () => {
      expect(() => {
        saltools.parse.date('invalid-date', {
          inputFormat: 'dd/mm/yyyy',
          outputFormat: 'dd/mm/yyyy',
        });
      }).toThrow();
    });
  });

  describe('parse.email', () => {
    test('test_parseEmail_WHEN_validEmail_THEN_validatesEmail', async () => {
      const result = await saltools.parse.email('test@example.com', {
        validateSPF: false,
        validateDMARC: false,
        validateDKIM: false,
        validateMX: false,
        validateSMTP: false,
      });
      expect(result).toBe('test@example.com');
    });

    test('test_parseEmail_WHEN_invalidEmail_THEN_throwsError', async () => {
      await expect(
        saltools.parse.email('invalid-email', {
          validateSPF: false,
          validateDMARC: false,
          validateDKIM: false,
          validateMX: false,
          validateSMTP: false,
        })
      ).rejects.toThrow();
    });
  });

  describe('parse.doc', () => {
    test('test_parseDoc_WHEN_validCPFString_THEN_returnsNumbersOnly', () => {
      const result = saltools.parse.doc('123.456.789-00');
      expect(result).toBe('12345678900');
    });

    test('test_parseDoc_WHEN_validCPFStringWithNumbersOnlyFalse_THEN_returnsFormattedCPF', () => {
      const result = saltools.parse.doc('12345678900', { numbersOnly: false });
      expect(result).toBe('123.456.789-00');
    });

    test('test_parseDoc_WHEN_validCNPJString_THEN_returnsNumbersOnly', () => {
      const result = saltools.parse.doc('12.345.678/0001-90');
      expect(result).toBe('12345678000190');
    });

    test('test_parseDoc_WHEN_validCNPJStringWithNumbersOnlyFalse_THEN_returnsFormattedCNPJ', () => {
      const result = saltools.parse.doc('12345678000190', { numbersOnly: false });
      expect(result).toBe('12.345.678/0001-90');
    });

    test('test_parseDoc_WHEN_validCPFNumber_THEN_returnsNumbersOnly', () => {
      const result = saltools.parse.doc(12345678900);
      expect(result).toBe('12345678900');
    });

    test('test_parseDoc_WHEN_validCPFWithSpecialChars_THEN_removesSpecialChars', () => {
      const result = saltools.parse.doc('123.456-789/00');
      expect(result).toBe('12345678900');
    });

    test('test_parseDoc_WHEN_validCNPJWithSpecialChars_THEN_removesSpecialChars', () => {
      const result = saltools.parse.doc('12.345-678/0001.90');
      expect(result).toBe('12345678000190');
    });

    test('test_parseDoc_WHEN_invalidLength_THEN_throwsError', () => {
      expect(() => {
        saltools.parse.doc('123456789');
      }).toThrow();
    });

    test('test_parseDoc_WHEN_invalidLengthWithThrowErrorFalse_THEN_returnsNull', () => {
      const result = saltools.parse.doc('123456789', { throwError: false });
      expect(result).toBeNull();
    });

    test('test_parseDoc_WHEN_invalidType_THEN_throwsError', () => {
      expect(() => {
        saltools.parse.doc(null);
      }).toThrow();
    });

    test('test_parseDoc_WHEN_invalidTypeWithThrowErrorFalse_THEN_returnsNull', () => {
      const result = saltools.parse.doc(null, { throwError: false });
      expect(result).toBeNull();
    });
  });

  describe('parse.fwf', () => {
    const testDir = path.join(process.cwd(), 'tests', 'temp_integration');

    beforeEach(() => {
      if (!fs.existsSync(testDir)) {
        fs.mkdirSync(testDir, { recursive: true });
      }
    });

    afterEach(() => {
      try {
        if (fs.existsSync(testDir)) {
          fs.rmSync(testDir, { recursive: true, force: true });
        }
      } catch (_) {
        /* ignore */
      }
    });

    test('test_parseFwf_WHEN_validFile_THEN_parsesFixedWidth', () => {
      const filePath = path.join(testDir, 'fwf.txt');
      fs.writeFileSync(filePath, 'John Doe  30New York\nJane Smith25London  ');

      const fields = [
        { key: 'name', start: 0, end: 10 },
        { key: 'age', start: 10, end: 12 },
        { key: 'city', start: 12, end: 20 },
      ];

      const result = saltools.parse.fwf(filePath, fields);

      expect(result).toEqual([
        { name: 'John Doe', age: '30', city: 'New York' },
        { name: 'Jane Smith', age: '25', city: 'London' },
      ]);
    });
  });

  describe('error handling', () => {
    test('test_errorsExport_WHEN_accessed_THEN_exportsErrorClass', () => {
      expect(saltools.errors.SaltoolsError).toBeDefined();
      expect(typeof saltools.errors.SaltoolsError).toBe('function');
    });

    test('test_parseFunctions_WHEN_invalidInput_THEN_throwsSaltoolsError', () => {
      expect(() => {
        saltools.parse.string(null);
      }).toThrow(saltools.errors.SaltoolsError);
    });
  });

  describe('real-world scenarios', () => {
    test('test_parseUserData_WHEN_processingUserInput_THEN_validatesAllFields', () => {
      const userData = {
        name: '  joão silva  ',
        phone: '11987654321',
        age: '25',
      };

      const parsed = {
        name: saltools.parse.string(userData.name, { capitalize: true }),
        phone: saltools.parse.phone(userData.phone, {
          numbersOnly: false,
          addCountryCode: false,
        }),
        age: saltools.parse.integer(userData.age, { allowZero: true }),
      };

      expect(parsed.name).toBe('João Silva');
      expect(parsed.phone).toBe('(11) 98765-4321');
      expect(parsed.age).toBe(25);
    });

    test('test_parseDateConversion_WHEN_convertingMultipleDates_THEN_maintainsConsistency', () => {
      const dates = [
        { input: '15/03/2024', format: 'dd/mm/yyyy' },
        { input: '2024-03-15T10:30:00Z', format: 'iso' },
      ];

      const results = dates.map((date) => {
        if (date.format === 'iso') {
          return saltools.parse.date(date.input, {
            inputFormat: 'iso',
            outputFormat: 'dd/mm/yyyy',
          });
        }
        return saltools.parse.date(date.input, {
          inputFormat: 'dd/mm/yyyy',
          outputFormat: 'dd/mm/yyyy',
        });
      });

      expect(results[0]).toBe('15/03/2024');
      expect(results[1]).toBe('15/03/2024');
    });

    test('test_parseWithErrorHandling_WHEN_throwErrorFalse_THEN_returnsNull', () => {
      const invalidName = saltools.parse.string('', { throwError: false });
      const invalidNumber = saltools.parse.number('', { throwError: false });
      const invalidPhone = saltools.parse.phone('', { throwError: false });
      const invalidDoc = saltools.parse.doc('123', { throwError: false });

      expect(invalidName).toBeNull();
      expect(invalidNumber).toBeNull();
      expect(invalidPhone).toBeNull();
      expect(invalidDoc).toBeNull();
    });

    test('test_parseUserDataWithDoc_WHEN_processingUserInput_THEN_validatesAllFields', () => {
      const userData = {
        name: '  joão silva  ',
        phone: '11987654321',
        age: '25',
        cpf: '123.456.789-00',
        cnpj: '12.345.678/0001-90',
      };

      const parsed = {
        name: saltools.parse.string(userData.name, { capitalize: true }),
        phone: saltools.parse.phone(userData.phone, {
          numbersOnly: false,
          addCountryCode: false,
        }),
        age: saltools.parse.integer(userData.age, { allowZero: true }),
        cpf: saltools.parse.doc(userData.cpf),
        cnpj: saltools.parse.doc(userData.cnpj, { numbersOnly: false }),
      };

      expect(parsed.name).toBe('João Silva');
      expect(parsed.phone).toBe('(11) 98765-4321');
      expect(parsed.age).toBe(25);
      expect(parsed.cpf).toBe('12345678900');
      expect(parsed.cnpj).toBe('12.345.678/0001-90');
    });
  });

  describe('helloWorld', () => {
    test('test_helloWorld_WHEN_called_THEN_logsHelloWorld', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      saltools.helloWorld();
      expect(consoleSpy).toHaveBeenCalledWith('Hello, World!');
      consoleSpy.mockRestore();
    });
  });
});
