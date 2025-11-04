import { describe, test, expect, jest, beforeEach, afterEach } from '@jest/globals';
import timestamp from 'src/commands/timestamp.js';

describe('timestamp', () => {
  let originalDate;

  beforeEach(() => {
    originalDate = global.Date;
  });

  afterEach(() => {
    global.Date = originalDate;
  });

  function createMockDate(year, month, day, hours, minutes, seconds, milliseconds) {
    const mockDate = {
      getDate: () => day,
      getMonth: () => month - 1,
      getFullYear: () => year,
      getHours: () => hours,
      getMinutes: () => minutes,
      getSeconds: () => seconds,
      getMilliseconds: () => milliseconds,
    };
    return mockDate;
  }

  test('test_timestamp_WHEN_called_THEN_returnsString', () => {
    const result = timestamp();
    expect(typeof result).toBe('string');
  });

  test('test_timestamp_WHEN_called_THEN_returnsCorrectFormat', () => {
    const mockDate = createMockDate(2024, 3, 15, 14, 30, 45, 123);
    global.Date = jest.fn(() => mockDate);

    const result = timestamp();

    expect(result).toMatch(/^\d{2}-\d{2}-\d{4}-\d{2}h-\d{2}m-\d{2}s-\d{2,3}ms$/);
  });

  test('test_timestamp_WHEN_singleDigitValues_THEN_padsWithZeros', () => {
    const mockDate = createMockDate(2024, 1, 5, 9, 5, 3, 7);
    global.Date = jest.fn(() => mockDate);

    const result = timestamp();

    expect(result).toBe('05-01-2024-09h-05m-03s-07ms');
  });

  test('test_timestamp_WHEN_doubleDigitValues_THEN_returnsCorrectFormat', () => {
    const mockDate = createMockDate(2024, 12, 25, 23, 59, 59, 999);
    global.Date = jest.fn(() => mockDate);

    const result = timestamp();

    expect(result).toBe('25-12-2024-23h-59m-59s-999ms');
  });

  test('test_timestamp_WHEN_called_THEN_containsAllComponents', () => {
    const mockDate = createMockDate(2024, 6, 20, 12, 30, 45, 789);
    global.Date = jest.fn(() => mockDate);

    const result = timestamp();

    const parts = result.split('-');
    expect(parts.length).toBe(7);
    expect(parts[0]).toBe('20');
    expect(parts[1]).toBe('06');
    expect(parts[2]).toBe('2024');
    expect(parts[3]).toBe('12h');
    expect(parts[4]).toBe('30m');
    expect(parts[5]).toBe('45s');
    expect(parts[6]).toBe('789ms');
  });
});

