import HttpHelper from '../../../services/httpHelper';
import adminConfig from '../../../config/adminConfig';

export async function fetchPlayers(search = '') {
  const url = search ? adminConfig.players.search(search) : adminConfig.players.list;
  return HttpHelper.get(url);
}

export async function setPlayerStatus(id, isActive) {
  return HttpHelper.patch(adminConfig.players.setStatus(id), { isActive });
}
