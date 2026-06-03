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

/**
 * Confirm the password reset verification code.
 * @param {{ email: string, code: string }} payload
 */
export async function verifyResetCode({ email, code }) {
  return apiClient.post('/auth/verify-reset-code', { email, code });
}

/**
 * Reset a password after the verification code has been confirmed.
 * @param {{ email: string, resetToken: string, password: string }} payload
 */
export async function resetPassword({ email, resetToken, password }) {
  return apiClient.post('/auth/reset-password', { email, resetToken, password });
}

