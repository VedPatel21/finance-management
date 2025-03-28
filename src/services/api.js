import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Add a response interceptor for uniform error handling
api.interceptors.response.use(
  response => response,
  error => {
    console.error("API Error:", error.response ? error.response.data : error.message);
    return Promise.reject(error);
  }
);

export default api;
