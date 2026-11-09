import { Constants } from "../config/constants";

export const baseUrls = {
  api: `${Constants.API_BASE_URL}/api/v1`,
};

export const authAPIRoutes = {
  register: "/auth/register",
  login: "/auth/login",
  logout: "/auth/logout",
  me: "/auth/me",
  forgotPassword: "/auth/forgot-password",
  resetPassword: "/auth/reset-password",
};
