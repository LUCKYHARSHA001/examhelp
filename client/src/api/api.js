// client/src/api/api.js
import axios from 'axios';

// Base Axios instance
const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

let inMemoryToken = null;

// Expose setter for the token so the AuthProvider can update it
export const setAccessToken = (token) => {
  inMemoryToken = token;
};

// Request Interceptor: Attach bearer token to headers if present in memory
api.interceptors.request.use(
  (config) => {
    if (inMemoryToken) {
      config.headers.Authorization = `Bearer ${inMemoryToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Quietly refresh token on 401 expiration
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Avoid infinite loop if auth check endpoints fail
    if (
      originalRequest.url.includes('/auth/login') ||
      originalRequest.url.includes('/auth/signup') ||
      originalRequest.url.includes('/auth/refresh')
    ) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await axios.post('/api/auth/refresh', {}, { withCredentials: true });
        const { accessToken } = response.data;
        
        setAccessToken(accessToken);
        isRefreshing = false;
        processQueue(null, accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        processQueue(refreshError, null);
        // Clear tokens if refresh fails
        setAccessToken(null);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

/* API Handlers mapping directly to backend routes */
export const authAPI = {
  login: async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    return res.data; // returns { accessToken }
  },
  signup: async (name, email, password) => {
    const res = await api.post('/auth/signup', { name, email, password });
    return res.data; // returns { accessToken }
  },
  refresh: async () => {
    const res = await api.post('/auth/refresh');
    return res.data; // returns { accessToken }
  },
  logout: async () => {
    const res = await api.post('/auth/logout');
    return res.data; // returns { message }
  },
  getGoogleOAuthUrl: () => {
    return '/api/auth/google';
  },
};

export const userAPI = {
  getMe: async () => {
    const res = await api.get('/user/me');
    return res.data; // returns { email, name, avatarUrl, createdAt, dailyRequestCount, dailyLimit }
  },
};

export const summaryAPI = {
  summarize: async (formData) => {
    const res = await api.post('/summarize', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data; // returns { summaryId, truncated, message }
  },
  list: async () => {
    const res = await api.get('/summaries');
    return res.data; // returns [{ id, fileName, examTime, summaryType, focusTopic, status, createdAt }, ...]
  },
  get: async (id) => {
    const res = await api.get(`/summary/${id}`);
    return res.data; // returns full Summary document
  },
  delete: async (id) => {
    const res = await api.delete(`/summary/${id}`);
    return res.data; // returns { message }
  },
  getStreamUrl: (summaryId) => {
    // Return SSE endpoint (requires access token appended as query parameter for EventSource authorization)
    return `/api/summary/${summaryId}/stream?token=${inMemoryToken}`;
  },
};

export default api;
