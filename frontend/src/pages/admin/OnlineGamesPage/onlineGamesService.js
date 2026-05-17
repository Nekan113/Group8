import HttpHelper from '../../../services/httpHelper';
import adminConfig from '../../../config/adminConfig';

export async function fetchAdminGames(search = '') {
  const url = search ? adminConfig.games.search(search) : adminConfig.games.list;
  return HttpHelper.get(url);
}

export async function closeGame(id) {
  return HttpHelper.post(adminConfig.games.close(id));
}
