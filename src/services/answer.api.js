import { apiClient } from './apiClient.js';

/**
 * Upload an audio/video answer (multipart form data).
 * @param {FormData} formData  Must include the file and any required fields.
 */
export async function uploadAnswer(formData) {
  return apiClient.post('/answers/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}

/**
 * List all answers for a session.
 * @param {string} sessionId
 */
export async function listAnswers(sessionId) {
  return apiClient.get(`/answers/${sessionId}`);
}

