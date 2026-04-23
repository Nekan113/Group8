import { API_ROUTES } from "../config/api";
import { http } from "./http";

export const adminService = {
  getPlayers: () => http.get(API_ROUTES.admin.players),
  getRooms: () => http.get(API_ROUTES.admin.rooms),
};