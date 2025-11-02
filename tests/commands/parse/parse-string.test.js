const { string } = require('../../../src/commands/parse');

describe('parse-string', () => {
  test('test_string_WHEN_validString_THEN_returnsTrimmedString', () => {
    const result = string('  hello world  ');
    expect(result).toBe('hello world');
  });

  test('test_string_WHEN_validStringNoSpaces_THEN_returnsSameString', () => {
    const result = string('hello');
    expect(result).toBe('hello');
  });

  test('test_string_WHEN_validStringWithTrimFalse_THEN_returnsUntrimmedString', () => {
    const result = string('  hello world  ', { trim: false });
    expect(result).toBe('  hello world  ');
  });

  test('test_string_WHEN_emptyStringWithAllowEmptyTrue_THEN_returnsEmptyString', () => {
    const result = string('', { allowEmpty: true });
    expect(result).toBe('');
  });

  test('test_string_WHEN_emptyStringWithAllowEmptyFalse_THEN_throwsError', () => {
    expect(() => {
      string('', { allowEmpty: false });
    }).toThrow('String não pode ser vazia quando {allowEmpty: false}');
  });

  test('test_string_WHEN_whitespaceOnlyTrimmedToEmptyWithAllowEmptyFalse_THEN_throwsError', () => {
    expect(() => {
      string('   ', { allowEmpty: false });
    }).toThrow('String não pode ser vazia quando {allowEmpty: false}');
  });

  test('test_string_WHEN_nonStringValueWithoutCast_THEN_throwsError', () => {
    expect(() => {
      string(123);
    }).toThrow('não é uma string');
  });

  test('test_string_WHEN_nonStringValueWithCast_THEN_convertsToString', () => {
    const result = string(123, { cast: true });
    expect(result).toBe('123');
  });

  test('test_string_WHEN_nullValueWithoutCast_THEN_throwsError', () => {
    expect(() => {
      string(null);
    }).toThrow('não é uma string');
  });

  test('test_string_WHEN_nullValueWithCast_THEN_convertsToString', () => {
    const result = string(null, { cast: true });
    expect(result).toBe('null');
  });

  test('test_string_WHEN_undefinedValueWithoutCast_THEN_throwsError', () => {
    expect(() => {
      string(undefined);
    }).toThrow('não é uma string');
  });

  test('test_string_WHEN_undefinedValueWithCast_THEN_convertsToString', () => {
    const result = string(undefined, { cast: true });
    expect(result).toBe('undefined');
  });

  test('test_string_WHEN_numberWithCastAndTrim_THEN_convertsAndTrims', () => {
    const result = string(123.456, { cast: true, trim: true });
    expect(result).toBe('123.456');
  });

  test('test_string_WHEN_booleanWithCast_THEN_convertsToString', () => {
    const result = string(true, { cast: true });
    expect(result).toBe('true');
  });

  test('test_string_WHEN_lowercaseStringWithCapitalizeFalse_THEN_returnsUnchanged', () => {
    const result = string('hello world', { capitalize: false });
    expect(result).toBe('hello world');
  });

  test('test_string_WHEN_lowercaseStringWithCapitalizeTrue_THEN_returnsCapitalized', () => {
    const result = string('hello world', { capitalize: true });
    expect(result).toBe('Hello World');
  });

  test('test_string_WHEN_mixedCaseStringWithCapitalizeTrue_THEN_returnsProperlyCapitalized', () => {
    const result = string('hELLo WoRLd', { capitalize: true });
    expect(result).toBe('Hello World');
  });

  test('test_string_WHEN_stringWithPortugueseParticlesWithCapitalizeTrue_THEN_keepsParticlesLowercase', () => {
    const result = string('joão da silva e maria dos santos', { capitalize: true });
    expect(result).toBe('João da Silva e Maria dos Santos');
  });

  test('test_string_WHEN_stringWithAllPortugueseParticlesWithCapitalizeTrue_THEN_keepsAllParticlesLowercase', () => {
    const result = string('maria de souza do brasil da costa dos reis das flores e pedro', { capitalize: true });
    expect(result).toBe('Maria de Souza do Brasil da Costa dos Reis das Flores e Pedro');
  });

  test('test_string_WHEN_singleWordWithCapitalizeTrue_THEN_returnsCapitalized', () => {
    const result = string('hello', { capitalize: true });
    expect(result).toBe('Hello');
  });

  test('test_string_WHEN_emptyStringWithCapitalizeTrue_THEN_returnsEmptyString', () => {
    const result = string('', { capitalize: true, allowEmpty: true });
    expect(result).toBe('');
  });

  test('test_string_WHEN_stringWithMultipleSpacesWithCapitalizeTrue_THEN_normalizesSpacesAndCapitalizes', () => {
    const result = string('hello   world', { capitalize: true, trim: false });
    expect(result).toBe('Hello World');
  });

  test('test_string_WHEN_stringWithCapitalizeAndTrim_THEN_capitalizesAndTrims', () => {
    const result = string('  hello world  ', { capitalize: true, trim: true });
    expect(result).toBe('Hello World');
  });

  test('test_string_WHEN_stringWithCapitalizeAndNoTrim_THEN_capitalizesAndTrims', () => {
    const result = string('  hello world  ', { capitalize: true, trim: false });
    expect(result).toBe('Hello World');
  });

  test('test_string_WHEN_portugueseParticleAtStartWithCapitalizeTrue_THEN_keepsParticleLowercase', () => {
    const result = string('de joão silva', { capitalize: true });
    expect(result).toBe('de João Silva');
  });

  test('test_string_WHEN_emptyStringWithVarName_THEN_errorIncludesVarName', () => {
    expect(() => {
      string('', { allowEmpty: false, varName: 'userName' });
    }).toThrow('String não pode ser vazia quando {allowEmpty: false} varName: userName');
  });

  test('test_string_WHEN_nonStringValueWithVarName_THEN_errorIncludesVarName', () => {
    expect(() => {
      string(123, { varName: 'age' });
    }).toThrow('varName: age');
  });

  test('test_string_WHEN_whitespaceOnlyWithVarName_THEN_errorIncludesVarName', () => {
    expect(() => {
      string('   ', { allowEmpty: false, varName: 'description' });
    }).toThrow('varName: description');
  });

  test('test_string_WHEN_nullValueWithVarName_THEN_errorIncludesVarName', () => {
    expect(() => {
      string(null, { varName: 'email' });
    }).toThrow('varName: email');
  });

  test('test_string_WHEN_undefinedValueWithVarName_THEN_errorIncludesVarName', () => {
    expect(() => {
      string(undefined, { varName: 'name' });
    }).toThrow('varName: name');
  });

  test('test_string_WHEN_validStringWithVarName_THEN_returnsValueWithoutVarNameInOutput', () => {
    const result = string('hello world', { varName: 'testVar' });
    expect(result).toBe('hello world');
  });

  test('test_string_WHEN_varNameIsNull_THEN_errorDoesNotIncludeVarName', () => {
    expect(() => {
      string('', { allowEmpty: false, varName: null });
    }).toThrow('String não pode ser vazia quando {allowEmpty: false}');
    const errorMessage = (() => {
      try {
        string('', { allowEmpty: false, varName: null });
      } catch (error) {
        return error.message;
      }
    })();
    expect(errorMessage).not.toContain('varName:');
  });
});
