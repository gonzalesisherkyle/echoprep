import { apiClient } from './apiClient.js';

/**
 * Create a new interview session.
 * @param {{ jobDescription: string }} payload
 */
export async function createSession({ jobDescription }) {
  return apiClient.post('/sessions', { jobDescription });
}

/**
 * List all sessions for the authenticated user.
 */
export async function listSessions() {
  return apiClient.get('/sessions');
}

/**
 * Get a single session by ID.
 * @param {string} id
 */
export async function getSession(id) {
  return apiClient.get(`/sessions/${id}`);
}

