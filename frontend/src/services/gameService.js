import { API_ROUTES } from "../config/api";
import { http } from "./http";

export const gameService = {
  // Create session
  createGame: () => http.post(API_ROUTES.game.create),

  // Get session by ID
  getGameById: (id) => http.get(API_ROUTES.game.getById(id)),

  getHistory: () => http.get(API_ROUTES.game.history),
  getRooms: () => http.get(API_ROUTES.game.rooms),
};