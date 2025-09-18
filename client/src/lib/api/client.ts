import axios from "axios";

const client = axios.create({
  baseURL: "http://localhost:4000/api/v1",
});

client.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// global response error handler
client.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    //401 handled with HOC Unauthorized

    // let the caller handle the error (and decide if they want to toast)
    return Promise.reject(error);
  }
);

export default client;