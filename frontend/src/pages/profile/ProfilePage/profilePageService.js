import HttpHelper from '../../../services/httpHelper';
import profileConfig from '../../../config/profileConfig';
import subscriptionConfig from '../../../config/subscriptionConfig';

export async function fetchProfile() {
  return HttpHelper.get(profileConfig.get);
}

export async function updateProfile(payload) {
  return HttpHelper.put(profileConfig.update, payload);
}

export async function changePassword(payload) {
  return HttpHelper.put(profileConfig.changePassword, payload);
}

export async function uploadAvatar(file) {
  const form = new FormData();
  form.append('avatar', file);
  return HttpHelper.postFormData(profileConfig.uploadAvatar, form);
}

export async function fetchHistory(params = {}) {
  const url = Object.keys(params).length
    ? profileConfig.historyFilter(params)
    : profileConfig.history;
  return HttpHelper.get(url);
}

export async function depositWallet(amount) {
  return HttpHelper.post(profileConfig.wallet.deposit, { amount });
}

export async function subscribeLocal() {
  return HttpHelper.post(subscriptionConfig.subscribe);
}

export async function createStripeCheckout() {
  return HttpHelper.post(subscriptionConfig.stripeCheckout);
}
