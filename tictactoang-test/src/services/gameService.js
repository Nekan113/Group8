import { API_ROUTES } from "../config/api";
import { http } from "./http";

export const gameService = {
  createGame: (payload) => http.post(API_ROUTES.game.create, payload),
  getHistory: () => http.get(API_ROUTES.game.history),
  getRooms: () => http.get(API_ROUTES.game.rooms),
};