import { describe, test, expect, jest, beforeEach, afterEach } from '@jest/globals';
import ErrorLogger from 'src/commands/log/error-logger.js';
import SaltoolsError from 'src/errors/saltools-error.js';
import fs from 'fs';
import path from 'path';

describe('ErrorLogger', () => {
  let logger;
  let consoleErrorSpy;
  let fsWriteFileSyncSpy;
  const testDir = path.join(process.cwd(), 'tests', 'temp', 'logs');

  beforeEach(() => {
    logger = new ErrorLogger();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    fsWriteFileSyncSpy = jest.spyOn(fs, 'writeFileSync').mockImplementation();

    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true });
    }
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
    fsWriteFileSyncSpy.mockRestore();
    try {
      if (fs.existsSync(testDir)) {
        fs.rmSync(testDir, { recursive: true, force: true });
      }
    } catch (_) {
      /* ignore cleanup errors */
    }
  });

  describe('run', () => {
    test('test_run_WHEN_validErrorWithDefaults_THEN_printsError', () => {
      const error = new Error('Test error');

      logger.run(error, { addTimestamp: false });

      expect(consoleErrorSpy).toHaveBeenCalled();
      expect(fsWriteFileSyncSpy).not.toHaveBeenCalled();
    });

    test('test_run_WHEN_printFalse_THEN_doesNotPrint', () => {
      const error = new Error('Test error');

      logger.run(error, { print: false, addTimestamp: false });

      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    test('test_run_WHEN_throwErrorTrue_THEN_throwsError', () => {
      const error = new Error('Test error');

      expect(() => {
        logger.run(error, { throwError: true, addTimestamp: false });
      }).toThrow(error);
    });

    test('test_run_WHEN_withDirectoryAndFilename_THEN_savesLog', () => {
      const error = new Error('Test error');

      logger.run(error, { directory: testDir, filename: 'error' });

      expect(fsWriteFileSyncSpy).toHaveBeenCalled();
      const callArgs = fsWriteFileSyncSpy.mock.calls[0];
      expect(callArgs[0]).toContain(testDir);
      expect(callArgs[0]).toContain('error');
      expect(callArgs[0]).toMatch(/\.log$/);
    });

    test('test_run_WHEN_addTimestampTrue_THEN_includesTimestampInFilename', () => {
      const error = new Error('Test error');

      logger.run(error, { directory: testDir, filename: 'error', addTimestamp: true });

      expect(fsWriteFileSyncSpy).toHaveBeenCalled();
      const filePath = fsWriteFileSyncSpy.mock.calls[0][0];
      expect(filePath).toMatch(/^.*error-.*\.log$/);
      expect(filePath).toContain(testDir);
    });

    test('test_run_WHEN_addTimestampFalse_THEN_doesNotIncludeTimestamp', () => {
      const error = new Error('Test error');

      logger.run(error, { directory: testDir, filename: 'error', addTimestamp: false });

      expect(fsWriteFileSyncSpy).toHaveBeenCalled();
      const filePath = fsWriteFileSyncSpy.mock.calls[0][0];
      expect(filePath).toBe(path.join(testDir, 'error.log'));
    });

    test('test_run_WHEN_errorWithCodeAndStack_THEN_parsesCorrectly', () => {
      const error = new Error('Test error');
      error.code = 'ERR_TEST';
      error.stack = 'Error: Test error\n    at test.js:1:1';

      logger.run(error, { print: false, addTimestamp: false });

      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });
  });

  describe('parameter validation', () => {
    test('test_run_WHEN_errorIsNull_THEN_throwsError', () => {
      expect(() => {
        logger.run(null);
      }).toThrow(SaltoolsError);
    });

    test('test_run_WHEN_errorIsUndefined_THEN_throwsError', () => {
      expect(() => {
        logger.run(undefined);
      }).toThrow(SaltoolsError);
    });

    test('test_run_WHEN_errorIsString_THEN_throwsError', () => {
      expect(() => {
        logger.run('error');
      }).toThrow(SaltoolsError);
    });

    test('test_run_WHEN_directoryOnlyProvided_THEN_throwsError', () => {
      const error = new Error('Test error');
      expect(() => {
        logger.run(error, { directory: testDir });
      }).toThrow(SaltoolsError);
    });

    test('test_run_WHEN_filenameOnlyProvided_THEN_throwsError', () => {
      const error = new Error('Test error');
      expect(() => {
        logger.run(error, { filename: 'error' });
      }).toThrow(SaltoolsError);
    });

    test('test_run_WHEN_addTimestampTrueWithoutDirectoryAndFilename_THEN_throwsError', () => {
      const error = new Error('Test error');
      expect(() => {
        logger.run(error, { addTimestamp: true });
      }).toThrow(SaltoolsError);
    });

    test('test_run_WHEN_printIsString_THEN_throwsError', () => {
      const error = new Error('Test error');
      expect(() => {
        logger.run(error, { print: 'true' });
      }).toThrow(SaltoolsError);
    });

    test('test_run_WHEN_addTimestampIsString_THEN_throwsError', () => {
      const error = new Error('Test error');
      expect(() => {
        logger.run(error, { addTimestamp: 'true' });
      }).toThrow(SaltoolsError);
    });

    test('test_run_WHEN_throwErrorIsString_THEN_throwsError', () => {
      const error = new Error('Test error');
      expect(() => {
        logger.run(error, { throwError: 'true' });
      }).toThrow(SaltoolsError);
    });

    test('test_run_WHEN_directoryIsNumber_THEN_throwsError', () => {
      const error = new Error('Test error');
      expect(() => {
        logger.run(error, { directory: 123 });
      }).toThrow(SaltoolsError);
    });

    test('test_run_WHEN_filenameIsNumber_THEN_throwsError', () => {
      const error = new Error('Test error');
      expect(() => {
        logger.run(error, { filename: 123 });
      }).toThrow(SaltoolsError);
    });
  });

  describe('error parsing', () => {
    test('test_run_WHEN_errorWithCode_THEN_includesCodeInOutput', () => {
      const error = new Error('Test error');
      error.code = 'ERR_TEST';

      logger.run(error, { directory: testDir, filename: 'error', addTimestamp: false });

      const writtenContent = fsWriteFileSyncSpy.mock.calls[0][1];
      expect(writtenContent).toContain('ERR_TEST');
      expect(writtenContent).toContain('Test error');
    });

    test('test_run_WHEN_errorWithoutCode_THEN_doesNotIncludeCode', () => {
      const error = new Error('Test error');

      logger.run(error, { directory: testDir, filename: 'error', addTimestamp: false });

      const writtenContent = fsWriteFileSyncSpy.mock.calls[0][1];
      expect(writtenContent).toContain('Test error');
      expect(writtenContent).not.toContain('ERR_TEST');
    });

    test('test_run_WHEN_errorWithStack_THEN_includesStack', () => {
      const error = new Error('Test error');
      error.stack = 'Error: Test error\n    at test.js:1:1';

      logger.run(error, { directory: testDir, filename: 'error', addTimestamp: false });

      const writtenContent = fsWriteFileSyncSpy.mock.calls[0][1];
      expect(writtenContent).toContain('stack:');
      expect(writtenContent).toContain('at test.js:1:1');
    });

    test('test_run_WHEN_errorWithoutStack_THEN_doesNotIncludeStack', () => {
      const error = new Error('Test error');
      delete error.stack;

      logger.run(error, { directory: testDir, filename: 'error', addTimestamp: false });

      const writtenContent = fsWriteFileSyncSpy.mock.calls[0][1];
      expect(writtenContent).toContain('Test error');
      expect(writtenContent).not.toContain('stack:');
    });

    test('test_run_WHEN_SaltoolsError_THEN_parsesCorrectly', () => {
      const error = new SaltoolsError('Custom error');

      logger.run(error, { addTimestamp: false });

      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });

  describe('log saving', () => {
    test('test_run_WHEN_noDirectoryOrFilename_THEN_doesNotSave', () => {
      const error = new Error('Test error');

      logger.run(error, { addTimestamp: false });

      expect(fsWriteFileSyncSpy).not.toHaveBeenCalled();
    });

    test('test_run_WHEN_directoryAndFilenameProvided_THEN_savesToCorrectPath', () => {
      const error = new Error('Test error');

      logger.run(error, { directory: testDir, filename: 'test-error', addTimestamp: false });

      expect(fsWriteFileSyncSpy).toHaveBeenCalledTimes(1);
      const filePath = fsWriteFileSyncSpy.mock.calls[0][0];
      expect(filePath).toBe(path.join(testDir, 'test-error.log'));
    });

    test('test_run_WHEN_saved_THEN_writesParsedError', () => {
      const error = new Error('Test error');
      error.code = 'ERR_TEST';

      logger.run(error, { directory: testDir, filename: 'error', print: false });

      const writtenContent = fsWriteFileSyncSpy.mock.calls[0][1];
      expect(writtenContent).toContain('ERR_TEST');
      expect(writtenContent).toContain('Test error');
    });
  });
});

