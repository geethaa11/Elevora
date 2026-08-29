import axios from 'axios';

// Create central Axios instance with environment-defined base URL
const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT Bearer Token if present in local storage
client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Uniform Success & Error formatting
client.interceptors.response.use(
  // Success callback: return the parsed JSON response body (which is our standard success envelope)
  (response) => {
    return response.data;
  },
  // Error callback: extract and normalize error responses
  (error) => {
    // Attempt to extract the custom structured error message from the response envelope
    const message = 
      error.response?.data?.error?.message || 
      error.message || 
      'Something went wrong. Please try again.';

    const code = 
      error.response?.data?.error?.code || 
      'NETWORK_ERROR';

    // Reject with a clean, standard shape for the frontend components
    return Promise.reject({
      success: false,
      error: {
        code,
        message,
      },
      raw: error,
    });
  }
);

export default client;
