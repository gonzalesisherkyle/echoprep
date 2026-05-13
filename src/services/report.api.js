import { apiClient } from './apiClient.js';

/**
 * Fetch the list of weekly progress reports for the authenticated user.
 */
export async function listWeeklyReports() {
  return apiClient.get('/reports/weekly');
}

