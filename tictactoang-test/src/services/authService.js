import { API_ROUTES } from "../config/api";
import { http } from "./http";

export const authService = {
  register: (payload) => http.post(API_ROUTES.auth.register, payload),
  login: (payload) => http.post(API_ROUTES.auth.login, payload),
  logout: () => http.post(API_ROUTES.auth.logout, {}),
};