export const API_BASE_URL = "http://localhost:5000/api";

export const API_ROUTES = {
  auth: {
    register: `${API_BASE_URL}/auth/register`,
    login: `${API_BASE_URL}/auth/login`,
    logout: `${API_BASE_URL}/auth/logout`,
  },
  profile: {
    me: `${API_BASE_URL}/profile/me`,
    sessions: `${API_BASE_URL}/profile/sessions`,
    avatar: `${API_BASE_URL}/profile/avatar`,
  },
  game: {
    create: `${API_BASE_URL}/games`,
    history: `${API_BASE_URL}/games/history`,
    rooms: `${API_BASE_URL}/rooms`,
  },
  premium: {
    walletDeposit: `${API_BASE_URL}/premium/wallet/deposit`,
    subscribe: `${API_BASE_URL}/premium/subscribe`,
  },
  admin: {
    players: `${API_BASE_URL}/admin/players`,
    rooms: `${API_BASE_URL}/admin/rooms`,
  },
};