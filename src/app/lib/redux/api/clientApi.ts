import axios from "axios";

const BASE_URL = "https://a2sv-application-platform-backend-team2.onrender.com";

// --- This variable will store the logout function from useAuth ---
let logoutCallback: (() => void) | null = null;
export const setLogoutCallback = (callback: () => void) => {
  logoutCallback = callback;
};

const getStoredToken = () => {
  const access = localStorage.getItem("access_token") || sessionStorage.getItem("access_token");
  const refresh = localStorage.getItem("refresh_token") || sessionStorage.getItem("refresh_token");
  return { access, refresh };
};

const storeTokens = (access: string, refresh: string) => {
  if (localStorage.getItem("refresh_token")) {
    localStorage.setItem("access_token", access);
    localStorage.setItem("refresh_token", refresh);
  } else {
    sessionStorage.setItem("access_token", access);
    sessionStorage.setItem("refresh_token", refresh);
  }
};

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const { access } = getStoredToken();
    if (access) {
      config.headers.Authorization = `Bearer ${access}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const { refresh } = getStoredToken();

    if (error.response?.status === 401 && refresh && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const res = await axios.post(`${BASE_URL}/auth/token/refresh/`, { refresh });
        const { access } = res.data;
        storeTokens(access, refresh);

        originalRequest.headers.Authorization = `Bearer ${access}`;
        return apiClient(originalRequest);
      } catch (err) {
        if (logoutCallback) {
          logoutCallback(); // Smooth Next.js navigation
        } else {
          window.location.href = "/auth/signin"; // Fallback
        }
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

// Exported API functions
export const apiPost = (endpoint: string, data: any) => apiClient.post(endpoint, data);
export const apiGet = (endpoint: string) => apiClient.get(endpoint);
export const apiPut = (endpoint: string, data: any) => apiClient.put(endpoint, data);
export const apiDelete = (endpoint: string) => apiClient.delete(endpoint);
