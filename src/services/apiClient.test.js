import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import axios from 'axios';

// We need to mock import.meta.env before importing apiClient
vi.stubEnv('VITE_API_BASE_URL', 'http://localhost:3000/api');

const { apiClient, ApiError } = await import('./apiClient.js');

describe('apiClient', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('ApiError', () => {
    it('should create an error with code, message, and status', () => {
      const err = new ApiError({ code: 'TEST_ERROR', message: 'Something went wrong', status: 400 });
      expect(err).toBeInstanceOf(Error);
      expect(err.name).toBe('ApiError');
      expect(err.code).toBe('TEST_ERROR');
      expect(err.message).toBe('Something went wrong');
      expect(err.status).toBe(400);
    });
  });

  describe('request interceptor', () => {
    it('should attach Authorization header when token exists in localStorage', async () => {
      localStorage.setItem('echoprep_token', 'test-jwt-token');

      const adapter = vi.fn().mockResolvedValue({
        data: { success: true, data: { id: 1 } },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      });

      const result = await apiClient.get('/test', { adapter });

      expect(adapter).toHaveBeenCalledWith(
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer test-jwt-token',
          }),
        })
      );
    });

    it('should not attach Authorization header when no token in localStorage', async () => {
      const adapter = vi.fn().mockResolvedValue({
        data: { success: true, data: { id: 1 } },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      });

      await apiClient.get('/test', { adapter });

      const calledConfig = adapter.mock.calls[0][0];
      expect(calledConfig.headers.Authorization).toBeUndefined();
    });
  });

  describe('response interceptor - success', () => {
    it('should unwrap { success: true, data } envelope', async () => {
      const payload = { id: 1, name: 'Test' };
      const adapter = vi.fn().mockResolvedValue({
        data: { success: true, data: payload },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      });

      const result = await apiClient.get('/test', { adapter });
      expect(result).toEqual(payload);
    });

    it('should return raw data when response does not have success envelope', async () => {
      const rawData = { something: 'else' };
      const adapter = vi.fn().mockResolvedValue({
        data: rawData,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      });

      const result = await apiClient.get('/test', { adapter });
      expect(result).toEqual(rawData);
    });
  });

  describe('response interceptor - error', () => {
    it('should throw ApiError with code, message, status from error envelope', async () => {
      const adapter = vi.fn().mockRejectedValue({
        response: {
          status: 401,
          data: { success: false, error: { code: 'UNAUTHENTICATED', message: 'Token expired' } },
          headers: {},
          statusText: 'Unauthorized',
        },
        config: {},
        isAxiosError: true,
      });

      await expect(apiClient.get('/test', { adapter })).rejects.toMatchObject({
        name: 'ApiError',
        code: 'UNAUTHENTICATED',
        message: 'Token expired',
        status: 401,
      });
    });

    it('should throw ApiError with NETWORK_ERROR when no response data', async () => {
      const adapter = vi.fn().mockRejectedValue({
        message: 'Network Error',
        config: {},
        isAxiosError: true,
      });

      await expect(apiClient.get('/test', { adapter })).rejects.toMatchObject({
        name: 'ApiError',
        code: 'NETWORK_ERROR',
        message: 'Network Error',
        status: 0,
      });
    });
  });
});

