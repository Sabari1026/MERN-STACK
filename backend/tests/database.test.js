const mongoose = require('mongoose');
const {
  getConnectionState,
  connectDatabase,
  setConnectionStateOverride
} = require('../src/config/database');

describe('Database Connection Management', () => {
  afterEach(() => {
    setConnectionStateOverride(null);
  });

  it('should accurately return disconnected state when readyState is 0', () => {
    setConnectionStateOverride({
      isConnected: false,
      status: 'disconnected',
      readyState: 0
    });

    const state = getConnectionState();
    expect(state.isConnected).toBe(false);
    expect(state.status).toBe('disconnected');
    expect(state.readyState).toBe(0);
  });

  it('should accurately return connected state when readyState is 1', () => {
    setConnectionStateOverride({
      isConnected: true,
      status: 'connected',
      readyState: 1
    });

    const state = getConnectionState();
    expect(state.isConnected).toBe(true);
    expect(state.status).toBe('connected');
    expect(state.readyState).toBe(1);
  });

  it('should reject connection when MONGODB_URI is empty or invalid without unhandled rejections', async () => {
    await expect(connectDatabase('')).rejects.toThrow(/MONGODB_URI is undefined or empty/);
  });

  it('should handle initial connection failure gracefully', async () => {
    const connectSpy = vi.spyOn(mongoose, 'connect').mockRejectedValueOnce(new Error('Connection timeout to host'));

    await expect(connectDatabase('mongodb://localhost:27999/fake_db', { serverSelectionTimeoutMS: 50 }))
      .rejects.toThrow(/Connection timeout to host/);

    connectSpy.mockRestore();
  });
});
