import HttpHelper from '../../../services/httpHelper';
import profileConfig from '../../../config/profileConfig';

export async function fetchHistory(params = {}) {
  const url = Object.keys(params).length
    ? profileConfig.historyFilter(params)
    : profileConfig.history;
  return HttpHelper.get(url);
}
