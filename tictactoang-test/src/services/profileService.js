import { API_ROUTES } from "../config/api";
import { http } from "./http";

export const profileService = {
  getMe: () => http.get(API_ROUTES.profile.me),
  getSessions: () => http.get(API_ROUTES.profile.sessions),
};