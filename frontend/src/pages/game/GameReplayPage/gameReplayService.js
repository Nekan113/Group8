import HttpHelper from '../../../services/httpHelper';
import gameConfig from '../../../config/gameConfig';

export async function fetchReplay(id) {
  return HttpHelper.get(gameConfig.replay(id));
}
