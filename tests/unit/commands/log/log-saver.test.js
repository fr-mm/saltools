import { describe, test, expect, jest, beforeEach, afterEach } from '@jest/globals';
import LogSaver from 'src/commands/log/log-saver.js';
import SaltoolsError from 'src/errors/saltools-error.js';
import fs from 'fs';
import path from 'path';

describe('LogSaver', () => {
  let fsWriteFileSyncSpy;
  let fsMkdirSyncSpy;
  const testDir = path.join(process.cwd(), 'tests', 'temp', 'logs');

  beforeEach(() => {
    fsWriteFileSyncSpy = jest.spyOn(fs, 'writeFileSync').mockImplementation();
    fsMkdirSyncSpy = jest.spyOn(fs, 'mkdirSync').mockImplementation();
  });

  afterEach(() => {
    fsWriteFileSyncSpy.mockRestore();
    fsMkdirSyncSpy.mockRestore();
  });

  describe('run', () => {
    test('test_run_WHEN_validParametersWithTimestamp_THEN_savesFile', () => {
      const content = 'Test log content';

      LogSaver.run(content, { directory: testDir, filename: 'test-log' });

      expect(fsWriteFileSyncSpy).toHaveBeenCalledTimes(1);
      const filePath = fsWriteFileSyncSpy.mock.calls[0][0];
      expect(filePath).toMatch(/^.*test-log-.*\.log$/);
      expect(filePath).toContain(testDir);
    });

    test('test_run_WHEN_addTimestampFalse_THEN_savesFileWithoutTimestamp', () => {
      const content = 'Test log content';

      LogSaver.run(content, { directory: testDir, filename: 'test-log', addTimestamp: false });

      expect(fsWriteFileSyncSpy).toHaveBeenCalledTimes(1);
      const filePath = fsWriteFileSyncSpy.mock.calls[0][0];
      expect(filePath).toBe(path.join(testDir, 'test-log.log'));
    });

    test('test_run_WHEN_addTimestampTrue_THEN_includesTimestampInFilename', () => {
      const content = 'Test log content';

      LogSaver.run(content, { directory: testDir, filename: 'test-log', addTimestamp: true });

      expect(fsWriteFileSyncSpy).toHaveBeenCalledTimes(1);
      const filePath = fsWriteFileSyncSpy.mock.calls[0][0];
      expect(filePath).toMatch(/^.*test-log-.*\.log$/);
      expect(filePath).toContain(testDir);
    });

    test('test_run_WHEN_savesFile_THEN_writesCorrectContent', () => {
      const content = 'Test log content\nLine 2';

      LogSaver.run(content, { directory: testDir, filename: 'test-log', addTimestamp: false });

      const writtenContent = fsWriteFileSyncSpy.mock.calls[0][1];
      expect(writtenContent).toBe(content);
    });

    test('test_run_WHEN_emptyContent_THEN_savesEmptyFile', () => {
      const content = '';

      LogSaver.run(content, { directory: testDir, filename: 'test-log', addTimestamp: false });

      expect(fsWriteFileSyncSpy).toHaveBeenCalledTimes(1);
      const writtenContent = fsWriteFileSyncSpy.mock.calls[0][1];
      expect(writtenContent).toBe('');
    });

    test('test_run_WHEN_multilineContent_THEN_preservesFormatting', () => {
      const content = 'Line 1\nLine 2\nLine 3';

      LogSaver.run(content, { directory: testDir, filename: 'test-log', addTimestamp: false });

      const writtenContent = fsWriteFileSyncSpy.mock.calls[0][1];
      expect(writtenContent).toBe(content);
      expect(writtenContent).toContain('\n');
    });
  });

  describe('parameter validation', () => {
    test('test_run_WHEN_contentIsNull_THEN_throwsError', () => {
      expect(() => {
        LogSaver.run(null, { directory: testDir, filename: 'test-log' });
      }).toThrow(SaltoolsError);
    });

    test('test_run_WHEN_contentIsUndefined_THEN_throwsError', () => {
      expect(() => {
        LogSaver.run(undefined, { directory: testDir, filename: 'test-log' });
      }).toThrow(SaltoolsError);
    });

    test('test_run_WHEN_contentIsNumber_THEN_throwsError', () => {
      expect(() => {
        LogSaver.run(123, { directory: testDir, filename: 'test-log' });
      }).toThrow(SaltoolsError);
    });

    test('test_run_WHEN_contentIsBoolean_THEN_throwsError', () => {
      expect(() => {
        LogSaver.run(true, { directory: testDir, filename: 'test-log' });
      }).toThrow(SaltoolsError);
    });

    test('test_run_WHEN_directoryIsNull_THEN_throwsError', () => {
      expect(() => {
        LogSaver.run('content', { directory: null, filename: 'test-log' });
      }).toThrow(SaltoolsError);
    });

    test('test_run_WHEN_directoryIsUndefined_THEN_throwsError', () => {
      expect(() => {
        LogSaver.run('content', { directory: undefined, filename: 'test-log' });
      }).toThrow(SaltoolsError);
    });

    test('test_run_WHEN_directoryIsNumber_THEN_throwsError', () => {
      expect(() => {
        LogSaver.run('content', { directory: 123, filename: 'test-log' });
      }).toThrow(SaltoolsError);
    });

    test('test_run_WHEN_directoryIsBoolean_THEN_throwsError', () => {
      expect(() => {
        LogSaver.run('content', { directory: true, filename: 'test-log' });
      }).toThrow(SaltoolsError);
    });

    test('test_run_WHEN_filenameIsNull_THEN_throwsError', () => {
      expect(() => {
        LogSaver.run('content', { directory: testDir, filename: null });
      }).toThrow(SaltoolsError);
    });

    test('test_run_WHEN_filenameIsUndefined_THEN_throwsError', () => {
      expect(() => {
        LogSaver.run('content', { directory: testDir, filename: undefined });
      }).toThrow(SaltoolsError);
    });

    test('test_run_WHEN_filenameIsNumber_THEN_throwsError', () => {
      expect(() => {
        LogSaver.run('content', { directory: testDir, filename: 123 });
      }).toThrow(SaltoolsError);
    });

    test('test_run_WHEN_filenameIsBoolean_THEN_throwsError', () => {
      expect(() => {
        LogSaver.run('content', { directory: testDir, filename: true });
      }).toThrow(SaltoolsError);
    });

    test('test_run_WHEN_addTimestampIsString_THEN_throwsError', () => {
      expect(() => {
        LogSaver.run('content', { directory: testDir, filename: 'test-log', addTimestamp: 'true' });
      }).toThrow(SaltoolsError);
    });

    test('test_run_WHEN_addTimestampIsNumber_THEN_throwsError', () => {
      expect(() => {
        LogSaver.run('content', { directory: testDir, filename: 'test-log', addTimestamp: 1 });
      }).toThrow(SaltoolsError);
    });

    test('test_run_WHEN_emptyStringContent_THEN_savesFile', () => {
      const content = '';

      LogSaver.run(content, { directory: testDir, filename: 'test-log', addTimestamp: false });

      expect(fsWriteFileSyncSpy).toHaveBeenCalled();
    });

    test('test_run_WHEN_emptyStringDirectory_THEN_savesFile', () => {
      const content = 'content';

      LogSaver.run(content, { directory: '', filename: 'test-log', addTimestamp: false });

      expect(fsWriteFileSyncSpy).toHaveBeenCalled();
      const filePath = fsWriteFileSyncSpy.mock.calls[0][0];
      expect(filePath).toContain('test-log.log');
      expect(fsMkdirSyncSpy).not.toHaveBeenCalled();
    });

    test('test_run_WHEN_emptyStringFilename_THEN_savesFile', () => {
      const content = 'content';

      LogSaver.run(content, { directory: testDir, filename: '', addTimestamp: false });

      expect(fsWriteFileSyncSpy).toHaveBeenCalled();
      const filePath = fsWriteFileSyncSpy.mock.calls[0][0];
      expect(filePath).toMatch(/\.log$/);
    });
  });

  describe('directory creation', () => {
    beforeEach(() => {
      fsWriteFileSyncSpy.mockRestore();
      fsMkdirSyncSpy.mockRestore();
      fsWriteFileSyncSpy = jest.spyOn(fs, 'writeFileSync').mockImplementation();
      fsMkdirSyncSpy = jest.spyOn(fs, 'mkdirSync').mockImplementation();
    });

    test('test_run_WHEN_directoryDoesNotExist_THEN_createsDirectory', () => {
      const newDir = path.join(process.cwd(), 'tests', 'temp', 'new-logs');
      const content = 'Test content';

      LogSaver.run(content, { directory: newDir, filename: 'test', addTimestamp: false });

      expect(fsMkdirSyncSpy).toHaveBeenCalledWith(newDir, { recursive: true });
    });

    test('test_run_WHEN_nestedDirectoryDoesNotExist_THEN_createsNestedDirectories', () => {
      const nestedDir = path.join(process.cwd(), 'tests', 'temp', 'nested', 'deep', 'logs');
      const content = 'Test content';

      LogSaver.run(content, { directory: nestedDir, filename: 'test', addTimestamp: false });

      expect(fsMkdirSyncSpy).toHaveBeenCalledWith(nestedDir, { recursive: true });
    });
  });

  describe('file path generation', () => {
    test('test_run_WHEN_relativeDirectory_THEN_joinsPathsCorrectly', () => {
      const content = 'content';
      const relativeDir = 'logs';

      LogSaver.run(content, { directory: relativeDir, filename: 'test', addTimestamp: false });

      const filePath = fsWriteFileSyncSpy.mock.calls[0][0];
      expect(filePath).toBe(path.join(relativeDir, 'test.log'));
    });

    test('test_run_WHEN_absoluteDirectory_THEN_usesAbsolutePath', () => {
      const content = 'content';
      const absoluteDir = path.resolve(testDir);

      LogSaver.run(content, { directory: absoluteDir, filename: 'test', addTimestamp: false });

      const filePath = fsWriteFileSyncSpy.mock.calls[0][0];
      expect(filePath).toBe(path.join(absoluteDir, 'test.log'));
    });

    test('test_run_WHEN_filenameWithExtension_THEN_appendsLogExtension', () => {
      const content = 'content';

      LogSaver.run(content, { directory: testDir, filename: 'test.txt', addTimestamp: false });

      const filePath = fsWriteFileSyncSpy.mock.calls[0][0];
      expect(filePath).toBe(path.join(testDir, 'test.txt.log'));
    });

    test('test_run_WHEN_filenameWithSpecialChars_THEN_preservesInFilename', () => {
      const content = 'content';

      LogSaver.run(content, { directory: testDir, filename: 'test-log_2024', addTimestamp: false });

      const filePath = fsWriteFileSyncSpy.mock.calls[0][0];
      expect(filePath).toContain('test-log_2024.log');
    });
  });
});
