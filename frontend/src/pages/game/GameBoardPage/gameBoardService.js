import HttpHelper from '../../../services/httpHelper';
import gameConfig from '../../../config/gameConfig';

export async function createSession(payload) {
  return HttpHelper.post(gameConfig.create, payload);
}

export async function abortSession(id) {
  return HttpHelper.post(gameConfig.abort(id));
}

export async function completeSession(id, payload) {
  return HttpHelper.post(gameConfig.complete(id), payload);
}
