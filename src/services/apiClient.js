import axios from 'axios';

class ApiError extends Error {
  constructor({ code, message, status }) {
    super(message);
    this.code = code;
    this.status = status;
    this.name = 'ApiError';
  }
}

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('echoprep_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    if (response.data && response.data.success) {
      return response.data.data;
    }
    return response.data;
  },
  (error) => {
    if (error.response && error.response.data && error.response.data.error) {
      const { code, message } = error.response.data.error;
      throw new ApiError({ code, message, status: error.response.status });
    }
    throw new ApiError({ code: 'NETWORK_ERROR', message: error.message, status: 0 });
  }
);

export { apiClient, ApiError };
export default apiClient;

