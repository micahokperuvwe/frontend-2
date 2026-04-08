import axios from "axios";

export const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL || "https://backend-2-ewjs.onrender.com/api"
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("chat_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
