import HttpHelper from '../../../services/httpHelper';
import gameConfig from '../../../config/gameConfig';

export async function createGameSession(payload) {
  return HttpHelper.post(gameConfig.create, payload);
}
