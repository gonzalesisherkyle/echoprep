import { apiClient } from './apiClient.js';

/**
 * Trigger AI evaluation for a recorded answer.
 * @param {{ answerId: string }} payload
 */
export async function evaluateAnswer({ answerId }) {
  return apiClient.post('/scoring/evaluate', { answerId });
}

