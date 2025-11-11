import { describe, test, expect, jest, beforeEach, afterEach } from '@jest/globals';
import SFTPWrapper from 'src/commands/sftp-wrapper.js';
import SaltoolsError from 'src/errors/saltools-error.js';

describe('SFTPWrapper', () => {
  let mockClient;

  beforeEach(() => {
    mockClient = {
      connect: jest.fn().mockResolvedValue(undefined),
      end: jest.fn().mockResolvedValue(undefined),
    };
    SFTPWrapper.configure({
      client: mockClient,
      host: 'test-host',
      username: 'test-user',
      password: 'test-password',
    });
  });

  afterEach(async () => {
    try {
      await SFTPWrapper.disconnect();
    } catch (_) {
      /* ignore disconnect errors */
    }
    mockClient = null;
  });

  describe('configure', () => {
    test('test_configure_WHEN_validConfig_THEN_setsOptionsAndClient', () => {
      const newClient = {
        connect: jest.fn(),
        end: jest.fn(),
      };
      SFTPWrapper.configure({
        client: newClient,
        host: 'new-host',
        username: 'new-user',
        password: 'new-password',
        port: 2222,
        readyTimeout: 5000,
      });

      expect(SFTPWrapper.client).toBe(newClient);
    });

    test('test_configure_WHEN_missingClient_THEN_throwsError', () => {
      expect(() => {
        SFTPWrapper.configure({
          host: 'test-host',
          username: 'test-user',
          password: 'test-password',
        });
      }).toThrow(SaltoolsError);
    });

    test('test_configure_WHEN_missingHost_THEN_throwsError', () => {
      expect(() => {
        SFTPWrapper.configure({
          client: mockClient,
          username: 'test-user',
          password: 'test-password',
        });
      }).toThrow(SaltoolsError);
    });

    test('test_configure_WHEN_missingUsername_THEN_throwsError', () => {
      expect(() => {
        SFTPWrapper.configure({
          client: mockClient,
          host: 'test-host',
          password: 'test-password',
        });
      }).toThrow(SaltoolsError);
    });

    test('test_configure_WHEN_missingPassword_THEN_throwsError', () => {
      expect(() => {
        SFTPWrapper.configure({
          client: mockClient,
          host: 'test-host',
          username: 'test-user',
        });
      }).toThrow(SaltoolsError);
    });

    test('test_configure_WHEN_invalidClientType_THEN_throwsError', () => {
      expect(() => {
        SFTPWrapper.configure({
          client: 'not-an-object',
          host: 'test-host',
          username: 'test-user',
          password: 'test-password',
        });
      }).toThrow(SaltoolsError);
    });

    test('test_configure_WHEN_invalidPortType_THEN_throwsError', () => {
      expect(() => {
        SFTPWrapper.configure({
          client: mockClient,
          host: 'test-host',
          username: 'test-user',
          password: 'test-password',
          port: 'not-a-number',
        });
      }).toThrow(SaltoolsError);
    });

    test('test_configure_WHEN_invalidReadyTimeoutType_THEN_throwsError', () => {
      expect(() => {
        SFTPWrapper.configure({
          client: mockClient,
          host: 'test-host',
          username: 'test-user',
          password: 'test-password',
          readyTimeout: 'not-a-number',
        });
      }).toThrow(SaltoolsError);
    });

    test('test_configure_WHEN_portNotProvided_THEN_usesDefault', () => {
      const newClient = {
        connect: jest.fn(),
        end: jest.fn(),
      };
      SFTPWrapper.configure({
        client: newClient,
        host: 'test-host',
        username: 'test-user',
        password: 'test-password',
      });

      expect(SFTPWrapper.client).toBe(newClient);
    });

    test('test_configure_WHEN_readyTimeoutNotProvided_THEN_usesDefault', () => {
      const newClient = {
        connect: jest.fn(),
        end: jest.fn(),
      };
      SFTPWrapper.configure({
        client: newClient,
        host: 'test-host',
        username: 'test-user',
        password: 'test-password',
      });

      expect(SFTPWrapper.client).toBe(newClient);
    });
  });

  describe('client getter', () => {
    test('test_client_WHEN_configured_THEN_returnsClient', () => {
      const newClient = {
        connect: jest.fn(),
        end: jest.fn(),
      };
      SFTPWrapper.configure({
        client: newClient,
        host: 'test-host',
        username: 'test-user',
        password: 'test-password',
      });

      expect(SFTPWrapper.client).toBe(newClient);
    });
  });

  describe('connect', () => {
    test('test_connect_WHEN_notConnected_THEN_callsClientConnect', async () => {
      await SFTPWrapper.connect();

      expect(mockClient.connect).toHaveBeenCalledTimes(1);
      expect(mockClient.connect).toHaveBeenCalledWith({
        host: 'test-host',
        username: 'test-user',
        password: 'test-password',
        port: 22,
        readyTimeout: 10000,
      });
    });

    test('test_connect_WHEN_alreadyConnected_THEN_doesNotCallClientConnect', async () => {
      await SFTPWrapper.connect();
      mockClient.connect.mockClear();

      await SFTPWrapper.connect();

      expect(mockClient.connect).not.toHaveBeenCalled();
    });

    test('test_connect_WHEN_clientConnectFails_THEN_throwsSaltoolsError', async () => {
      const error = new Error('Connection failed');
      mockClient.connect.mockRejectedValue(error);

      await expect(SFTPWrapper.connect()).rejects.toThrow(SaltoolsError);
      await expect(SFTPWrapper.connect()).rejects.toThrow(
        'Erro ao estabelecer conexão com SFTP: Connection failed'
      );
    });

    test('test_connect_WHEN_successful_THEN_setsConnectedToTrue', async () => {
      await SFTPWrapper.connect();

      await SFTPWrapper.connect();
      expect(mockClient.connect).toHaveBeenCalledTimes(1);
    });

    test('test_connect_WHEN_customPort_THEN_usesCustomPort', async () => {
      SFTPWrapper.configure({
        client: mockClient,
        host: 'test-host',
        username: 'test-user',
        password: 'test-password',
        port: 2222,
      });
      await SFTPWrapper.disconnect();

      await SFTPWrapper.connect();

      expect(mockClient.connect).toHaveBeenCalledWith(
        expect.objectContaining({
          port: 2222,
        })
      );
    });

    test('test_connect_WHEN_customReadyTimeout_THEN_usesCustomReadyTimeout', async () => {
      SFTPWrapper.configure({
        client: mockClient,
        host: 'test-host',
        username: 'test-user',
        password: 'test-password',
        readyTimeout: 5000,
      });
      await SFTPWrapper.disconnect();

      await SFTPWrapper.connect();

      expect(mockClient.connect).toHaveBeenCalledWith(
        expect.objectContaining({
          readyTimeout: 5000,
        })
      );
    });
  });

  describe('disconnect', () => {
    test('test_disconnect_WHEN_connected_THEN_callsClientEnd', async () => {
      await SFTPWrapper.connect();

      await SFTPWrapper.disconnect();

      expect(mockClient.end).toHaveBeenCalledTimes(1);
    });

    test('test_disconnect_WHEN_notConnected_THEN_doesNotCallClientEnd', async () => {
      await SFTPWrapper.disconnect();

      expect(mockClient.end).not.toHaveBeenCalled();
    });

    test('test_disconnect_WHEN_clientEndFails_THEN_throwsSaltoolsError', async () => {
      await SFTPWrapper.connect();
      const error = new Error('Disconnect failed');
      mockClient.end.mockRejectedValue(error);

      await expect(SFTPWrapper.disconnect()).rejects.toThrow(SaltoolsError);
      await expect(SFTPWrapper.disconnect()).rejects.toThrow(
        'Erro ao desconectar do SFTP: Disconnect failed'
      );
    });

    test('test_disconnect_WHEN_ECONNRESET_THEN_doesNotThrow', async () => {
      await SFTPWrapper.connect();
      const error = new Error('Connection reset');
      error.code = 'ECONNRESET';
      mockClient.end.mockRejectedValue(error);

      await expect(SFTPWrapper.disconnect()).resolves.not.toThrow();
      expect(mockClient.end).toHaveBeenCalled();
    });

    test('test_disconnect_WHEN_ECONNRESET_THEN_setsConnectedToFalse', async () => {
      await SFTPWrapper.connect();
      const error = new Error('Connection reset');
      error.code = 'ECONNRESET';
      mockClient.end.mockRejectedValue(error);

      await SFTPWrapper.disconnect();

      await SFTPWrapper.disconnect();
      expect(mockClient.end).toHaveBeenCalledTimes(1);
    });

    test('test_disconnect_WHEN_successful_THEN_setsConnectedToFalse', async () => {
      await SFTPWrapper.connect();

      await SFTPWrapper.disconnect();

      await SFTPWrapper.disconnect();
      expect(mockClient.end).toHaveBeenCalledTimes(1);
    });
  });

  describe('testConnection', () => {
    test('test_testConnection_WHEN_called_THEN_callsConnectAndDisconnect', async () => {
      await SFTPWrapper.disconnect();
      mockClient.connect.mockClear();
      mockClient.end.mockClear();

      await SFTPWrapper.testConnection();

      expect(mockClient.connect).toHaveBeenCalledTimes(1);
      expect(mockClient.end).toHaveBeenCalledTimes(1);
    });

    test('test_testConnection_WHEN_called_THEN_logsSuccessMessage', async () => {
      await SFTPWrapper.disconnect();
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      await SFTPWrapper.testConnection();

      expect(consoleSpy).toHaveBeenCalledWith('[OK] Conexão estabelecida com SFTP');
      consoleSpy.mockRestore();
    });

    test('test_testConnection_WHEN_called_THEN_returnsTrue', async () => {
      await SFTPWrapper.disconnect();

      const result = await SFTPWrapper.testConnection();

      expect(result).toBe(true);
    });

    test('test_testConnection_WHEN_connectFails_THEN_throwsError', async () => {
      await SFTPWrapper.disconnect();
      const error = new Error('Connection failed');
      mockClient.connect.mockRejectedValue(error);

      await expect(SFTPWrapper.testConnection()).rejects.toThrow(SaltoolsError);
    });

    test('test_testConnection_WHEN_disconnectFails_THEN_throwsError', async () => {
      await SFTPWrapper.disconnect();
      const error = new Error('Disconnect failed');
      mockClient.end.mockRejectedValue(error);

      await expect(SFTPWrapper.testConnection()).rejects.toThrow(SaltoolsError);
    });
  });
});
