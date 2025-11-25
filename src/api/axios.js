import axios from "axios";

const API = axios.create({
  baseURL: "https://flexisaf-edulink360-backend.onrender.com",
});

// Attach token automatically to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
