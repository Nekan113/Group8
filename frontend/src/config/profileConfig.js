const BASE = '/api/profile';

const profileConfig = {
  get: BASE,
  update: BASE,
  changePassword: `${BASE}/password`,
  uploadAvatar: `${BASE}/avatar`,
  history: `${BASE}/history`,
  historySearch: (query) => `${BASE}/history?search=${encodeURIComponent(query)}`,
  historyFilter: (params) => {
    const qs = new URLSearchParams(params).toString();
    return `${BASE}/history?${qs}`;
  },
  wallet: {
    deposit: `${BASE}/wallet/deposit`,
    balance: `${BASE}/wallet`,
  },
};

export default profileConfig;
