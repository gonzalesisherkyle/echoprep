import { apiClient } from './apiClient.js';

/**
 * Trigger AI question generation for a session.
 * @param {{ sessionId: string }} payload
 */
export async function generateQuestions({ sessionId }) {
  return apiClient.post('/questions/generate', { sessionId });
}

/**
 * List all questions belonging to a session.
 * @param {string} sessionId
 */
export async function listQuestions(sessionId) {
  return apiClient.get(`/questions/${sessionId}`);
}

