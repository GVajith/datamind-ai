import axios from "axios";

import { baseUrls } from "./Endpoints";

const apiClient = axios.create({
  baseURL: baseUrls.api,
  timeout: 30000,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use((config) => {
  const auth = JSON.parse(sessionStorage.getItem("datamind.auth") || "null");
  if (auth?.access_token) {
    config.headers.Authorization = `Bearer ${auth.access_token}`;
  }
  return config;
});

export const GETAPI = (endpoint, params = {}) => apiClient.get(endpoint, { params });
export const POSTAPI = (endpoint, payload = {}) => apiClient.post(endpoint, payload);
export const PATCHAPI = (endpoint, payload = {}) => apiClient.patch(endpoint, payload);
export const DELETEAPI = (endpoint, params = {}) => apiClient.delete(endpoint, { params });

export const getApiError = (error) => {
  if (error?.code === "ERR_NETWORK") {
    return "We couldn't reach DataMind. Check that the backend is running, then try again.";
  }
  const validation = error?.response?.data?.data;
  if (Array.isArray(validation) && validation[0]?.message) {
    return validation[0].message.replace(/^Value error, /, "");
  }
  return error?.response?.data?.msg || error?.message || "Something went wrong. Please try again.";
};
