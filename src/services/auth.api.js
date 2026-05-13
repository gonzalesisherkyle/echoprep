import { apiClient } from './apiClient.js';

/**
 * Register a new user account.
 * @param {{ name: string, email: string, password: string }} payload
 */
export async function register({ name, email, password }) {
  return apiClient.post('/auth/register', { name, email, password });
}

/**
 * Log in with email and password.
 * @param {{ email: string, password: string }} payload
 */
export async function login({ email, password }) {
  return apiClient.post('/auth/login', { email, password });
}

/**
 * Request a password-reset email.
 * @param {{ email: string }} payload
 */
export async function forgotPassword({ email }) {
  return apiClient.post('/auth/forgot-password', { email });
}

