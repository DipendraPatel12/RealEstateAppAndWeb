import axios from 'axios';
import { API_ENDPOINTS } from '@/constants/apiEndpoints';
import { APP_ROUTES } from '@/constants/routes';

let accessToken = null;

export const setAccessToken = (token) => {
  accessToken = token;
};

export const getAccessToken = () => accessToken;

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request Interceptor: Attach Bearer Access Token if present
api.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Seamless Automatic Refresh Token Rotation
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Avoid infinite loop on auth endpoints
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes(API_ENDPOINTS.AUTH.LOGIN) &&
      !originalRequest.url?.includes(API_ENDPOINTS.AUTH.REFRESH_TOKEN)
    ) {
      originalRequest._retry = true;
      try {
        const refreshResponse = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'}${API_ENDPOINTS.AUTH.REFRESH_TOKEN}`,
          {},
          { withCredentials: true }
        );

        const newAccessToken = refreshResponse.data?.data?.accessToken;
        if (newAccessToken) {
          setAccessToken(newAccessToken);
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        setAccessToken(null);
        if (typeof window !== 'undefined') {
          window.location.href = APP_ROUTES.AUTH.LOGIN;
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
