import axios from "axios";

const client = axios.create({
  baseURL: "http://localhost:4000/api/v1",
});

// attach auth token if available
client.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default client;
