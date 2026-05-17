import HttpHelper from '../../../services/httpHelper';
import gameConfig from '../../../config/gameConfig';

export async function fetchRooms() {
  return HttpHelper.get(gameConfig.arena.rooms);
}

export async function createRoom(payload) {
  return HttpHelper.post(gameConfig.arena.create, payload);
}

export async function joinRoom(id) {
  return HttpHelper.post(gameConfig.arena.join(id));
}
