import { describe, test, expect, jest } from '@jest/globals';
import { helloWorld, parse } from 'src/index.js';

describe('index', () => {
  test('test_helloWorld_WHEN_called_THEN_logsHelloWorld', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    helloWorld();
    expect(consoleSpy).toHaveBeenCalledWith('Hello, World!');
    consoleSpy.mockRestore();
  });

  test('test_parse_WHEN_called_THEN_returnsParseObject', () => {
    expect(parse).toBeDefined();
    expect(typeof parse).toBe('object');
    expect(parse.string).toBeDefined();
    expect(typeof parse.string).toBe('function');
  });
});

