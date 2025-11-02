import { describe, test, expect, jest } from '@jest/globals';
import { hello_world, parse } from 'src/index.js';

describe('index', () => {
  test('test_hello_world_WHEN_called_THEN_logsHelloWorld', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    hello_world();
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

