import { describe, test, expect } from '@jest/globals';
import phone from 'src/commands/parse/parse-phone.js';
import SaltoolsError from 'src/errors/saltools-error.js';

describe('phone', () => {
    test('test_phone_WHEN_validBrazilianPhoneWithPlus_THEN_returnsFormattedNumber', () => {
      const result = phone('+5511987654321', {
        addCountryCode: true,
        addPlusPrefix: false,
        addAreaCode: true,
        numbersOnly: true,
        throwError: true,
      });
      expect(result).toBe('5511987654321');
    });

    test('test_phone_WHEN_validBrazilianPhoneWithoutPlus_THEN_returnsFormattedNumber', () => {
      const result = phone('11987654321', {
        addCountryCode: true,
        addPlusPrefix: false,
        addAreaCode: true,
        numbersOnly: true,
        throwError: true,
      });
      expect(result).toBe('5511987654321');
    });

    test('test_phone_WHEN_brazilianPhoneWithoutPlusAndNumbersOnlyFalse_THEN_returnsFormattedNumber', () => {
      const result = phone('11987654321', {
        addCountryCode: true,
        addPlusPrefix: false,
        addAreaCode: true,
        numbersOnly: false,
        throwError: true,
      });
      expect(result).toBe('55 (11) 98765-4321');
    });

    test('test_phone_WHEN_brazilianPhoneWithFormattedInputWithoutPlus_THEN_assumesBR', () => {
      const result = phone('(71) 98888-7777', {
        addCountryCode: true,
        addPlusPrefix: false,
        addAreaCode: true,
        numbersOnly: true,
        throwError: true,
      });
      expect(result).toBe('5571988887777');
    });

    test('test_phone_WHEN_brazilianPhoneWithFormattedInputWithoutPlusAndNumbersOnlyFalse_THEN_assumesBR', () => {
      const result = phone('(71) 98888-7777', {
        addCountryCode: true,
        addPlusPrefix: false,
        addAreaCode: true,
        numbersOnly: false,
        throwError: true,
      });
      expect(result).toBe('55 (71) 98888-7777');
    });

    test('test_phone_WHEN_numberStartingWith55WithoutPlus_THEN_detectsAsBR', () => {
      const result = phone('5511987654321', {
        addCountryCode: true,
        addPlusPrefix: false,
        addAreaCode: true,
        numbersOnly: true,
        throwError: true,
      });
      expect(result).toBe('5511987654321');
    });

    test('test_phone_WHEN_validUSPhoneWithPlus_THEN_returnsFormattedNumber', () => {
      const result = phone('+12125551234', {
        addCountryCode: true,
        addPlusPrefix: false,
        addAreaCode: true,
        numbersOnly: true,
        throwError: true,
      });
      expect(result).toBe('12125551234');
    });

    test('test_phone_WHEN_addPlusPrefixTrue_THEN_returnsNumberWithPlus', () => {
      const result = phone('+5511987654321', {
        addCountryCode: true,
        addPlusPrefix: true,
        addAreaCode: true,
        numbersOnly: true,
        throwError: true,
      });
      expect(result).toBe('+5511987654321');
    });

    test('test_phone_WHEN_addPlusPrefixTrueAndAddCountryCodeTrue_THEN_returnsE164Format', () => {
      const result = phone('+5511987654321', {
        addCountryCode: true,
        addPlusPrefix: true,
        addAreaCode: true,
        numbersOnly: true,
        throwError: true,
      });
      expect(result).toBe('+5511987654321');
    });

    test('test_phone_WHEN_addCountryCodeFalse_THEN_returnsNationalNumber', () => {
      const result = phone('+5511987654321', {
        addCountryCode: false,
        addPlusPrefix: false,
        addAreaCode: true,
        numbersOnly: true,
        throwError: true,
      });
      expect(result).toBe('11987654321');
    });

    test('test_phone_WHEN_numbersOnlyFalse_THEN_returnsFormattedNumber', () => {
      const result = phone('+5511987654321', {
        addCountryCode: true,
        addPlusPrefix: false,
        addAreaCode: true,
        numbersOnly: false,
        throwError: true,
      });
      expect(result).toBe('55 (11) 98765-4321');
    });

    test('test_phone_WHEN_numbersOnlyFalseAndAddPlusPrefixTrue_THEN_returnsInternationalFormat', () => {
      const result = phone('+5511987654321', {
        addCountryCode: true,
        addPlusPrefix: true,
        addAreaCode: true,
        numbersOnly: false,
        throwError: true,
      });
      expect(result).toBe('+55 11 98765 4321');
    });

    test('test_phone_WHEN_numbersOnlyFalseAndAddCountryCodeFalse_THEN_returnsNationalFormat', () => {
      const result = phone('+5511987654321', {
        addCountryCode: false,
        addPlusPrefix: false,
        addAreaCode: true,
        numbersOnly: false,
        throwError: true,
      });
      expect(result).toBe('(11) 98765-4321');
    });

    test('test_phone_WHEN_invalidPhoneNumber_THEN_throwsSaltoolsError', () => {
      expect(() => {
        phone('123', {
          addCountryCode: true,
          addPlusPrefix: false,
          addAreaCode: true,
          numbersOnly: true,
          throwError: true,
        });
      }).toThrow(SaltoolsError);
      expect(() => {
        phone('123', {
          addCountryCode: true,
          addPlusPrefix: false,
          addAreaCode: true,
          numbersOnly: true,
          throwError: true,
        });
      }).toThrow('inválido');
    });

    test('test_phone_WHEN_invalidPhoneNumberAndThrowErrorFalse_THEN_returnsNull', () => {
      const result = phone('123', {
        addCountryCode: true,
        addPlusPrefix: false,
        addAreaCode: true,
        numbersOnly: true,
        throwError: false,
      });
      expect(result).toBeNull();
    });

    test('test_phone_WHEN_phoneIsNull_THEN_throwsSaltoolsError', () => {
      expect(() => {
        phone(null, {
          addCountryCode: true,
          addPlusPrefix: false,
          addAreaCode: true,
          numbersOnly: true,
          throwError: true,
        });
      }).toThrow(SaltoolsError);
    });

    test('test_phone_WHEN_phoneIsUndefined_THEN_throwsSaltoolsError', () => {
      expect(() => {
        phone(undefined, {
          addCountryCode: true,
          addPlusPrefix: false,
          addAreaCode: true,
          numbersOnly: true,
          throwError: true,
        });
      }).toThrow(SaltoolsError);
    });

    test('test_phone_WHEN_phoneIsNumber_THEN_throwsSaltoolsError', () => {
      expect(() => {
        phone(11987654321, {
          addCountryCode: true,
          addPlusPrefix: false,
          addAreaCode: true,
          numbersOnly: true,
          throwError: true,
        });
      }).toThrow(SaltoolsError);
    });

    test('test_phone_WHEN_addCountryCodeIsNotBoolean_THEN_throwsSaltoolsError', () => {
      expect(() => {
        phone('+5511987654321', {
          addCountryCode: 'true',
          addPlusPrefix: false,
          addAreaCode: true,
          numbersOnly: true,
          throwError: true,
        });
      }).toThrow(SaltoolsError);
    });

    test('test_phone_WHEN_addPlusPrefixIsNotBoolean_THEN_throwsSaltoolsError', () => {
      expect(() => {
        phone('+5511987654321', {
          addCountryCode: true,
          addPlusPrefix: 'true',
          addAreaCode: true,
          numbersOnly: true,
          throwError: true,
        });
      }).toThrow(SaltoolsError);
    });

    test('test_phone_WHEN_addAreaCodeIsNotBoolean_THEN_throwsSaltoolsError', () => {
      expect(() => {
        phone('+5511987654321', {
          addCountryCode: true,
          addPlusPrefix: false,
          addAreaCode: 'true',
          numbersOnly: true,
          throwError: true,
        });
      }).toThrow(SaltoolsError);
    });

    test('test_phone_WHEN_numbersOnlyIsNotBoolean_THEN_throwsSaltoolsError', () => {
      expect(() => {
        phone('+5511987654321', {
          addCountryCode: true,
          addPlusPrefix: false,
          addAreaCode: true,
          numbersOnly: 'true',
          throwError: true,
        });
      }).toThrow(SaltoolsError);
    });

    test('test_phone_WHEN_throwErrorIsNotBoolean_THEN_throwsSaltoolsError', () => {
      expect(() => {
        phone('+5511987654321', {
          addCountryCode: true,
          addPlusPrefix: false,
          addAreaCode: true,
          numbersOnly: true,
          throwError: 'true',
        });
      }).toThrow(SaltoolsError);
    });

    test('test_phone_WHEN_defaultOptions_THEN_usesDefaultValues', () => {
      const result = phone('+5511987654321', {
        addCountryCode: true,
        addPlusPrefix: false,
        addAreaCode: true,
        numbersOnly: true,
        throwError: true,
      });
      expect(result).toBe('5511987654321');
    });

    test('test_phone_WHEN_phoneWithSpacesAndNumbersOnly_THEN_removesSpaces', () => {
      const result = phone('+55 11 98765-4321', {
        addCountryCode: true,
        addPlusPrefix: false,
        addAreaCode: true,
        numbersOnly: true,
        throwError: true,
      });
      expect(result).toBe('5511987654321');
    });

    test('test_phone_WHEN_phoneWithParenthesesAndNumbersOnly_THEN_removesParentheses', () => {
      const result = phone('+55 (11) 98765-4321', {
        addCountryCode: true,
        addPlusPrefix: false,
        addAreaCode: true,
        numbersOnly: true,
        throwError: true,
      });
      expect(result).toBe('5511987654321');
    });

    test('test_phone_WHEN_phoneWithHyphensAndNumbersOnly_THEN_removesHyphens', () => {
      const result = phone('+55-11-98765-4321', {
        addCountryCode: true,
        addPlusPrefix: false,
        addAreaCode: true,
        numbersOnly: true,
        throwError: true,
      });
      expect(result).toBe('5511987654321');
    });
});

