const BASE = '/api/admin';

const adminConfig = {
  players: {
    list: `${BASE}/players`,
    search: (query) => `${BASE}/players?search=${encodeURIComponent(query)}`,
    setStatus: (id) => `${BASE}/players/${id}/status`,
  },
  games: {
    list: `${BASE}/games`,
    search: (query) => `${BASE}/games?search=${encodeURIComponent(query)}`,
    close: (id) => `${BASE}/games/${id}/close`,
  },
};

export default adminConfig;
