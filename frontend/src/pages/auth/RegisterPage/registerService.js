import HttpHelper from '../../../services/httpHelper';
import authConfig from '../../../config/authConfig';

export async function registerUser(payload) {
  return HttpHelper.post(authConfig.register, payload);
}
