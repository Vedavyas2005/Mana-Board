// src/api.js
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "/";

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  // timeout: 10000,
});

// Attach user info headers (no JWT)
client.interceptors.request.use((config) => {
  const role = localStorage.getItem("USER_ROLE") || "user";
  const email = localStorage.getItem("USER_EMAIL") || "";
  if (role) config.headers["role"] = role;
  if (email) config.headers["email"] = email;
  return config;
});

export default client;
