import axios from "axios";

// One shared axios instance. Every API call in the app goes through it.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// Runs BEFORE every request: attach the token if we have one
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = "Bearer " + token;
  }
  return config;
});

// Runs AFTER every response: if the server rejects our token
// (for example it expired), clear it and send the user to the login page
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const hadToken = localStorage.getItem("token");
    if (
      axios.isAxiosError(error) &&
      error.response?.status === 401 &&
      hadToken
    ) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

// Turns any error into a message we can show on screen
export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      // The server answered with an error, e.g. {"message": "No copies available"}
      return error.response.data?.message || "Something went wrong";
    }
    // No response at all: server is off, or CORS blocked it
    return "Cannot reach the server. Is it running?";
  }
  return "Something went wrong";
}

export default api;
