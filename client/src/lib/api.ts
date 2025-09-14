import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000/api/v1",
});

// attach token from Redux if present
api.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;