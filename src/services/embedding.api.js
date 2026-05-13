import { apiClient } from './apiClient.js';

/**
 * Store the embedding vector for an answer in Qdrant.
 * @param {{ answerId: string }} payload
 */
export async function storeEmbedding({ answerId }) {
  return apiClient.post('/embeddings/store', { answerId });
}

/**
 * Search stored embeddings by semantic query.
 * @param {{ query: string, topK?: number }} params
 */
export async function searchEmbeddings({ query, topK }) {
  return apiClient.get('/embeddings/search', { params: { query, topK } });
}

