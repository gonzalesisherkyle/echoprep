import { apiClient } from './apiClient.js';

/**
 * Fetch the authenticated user's profile.
 */
export async function getProfile() {
  return apiClient.get('/users/me');
}

/**
 * Partially update the authenticated user's profile.
 * @param {object} patch  Fields to update (e.g. { name, email }).
 */
export async function updateProfile(patch) {
  return apiClient.patch('/users/me', patch);
}

