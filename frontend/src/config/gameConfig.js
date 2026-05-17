const BASE = '/api/game';

const gameConfig = {
  create: BASE,
  abort: (id) => `${BASE}/${id}/abort`,
  complete: (id) => `${BASE}/${id}/complete`,
  replay: (id) => `${BASE}/${id}/replay`,
  arena: {
    rooms: '/api/arena/rooms',
    create: '/api/arena/rooms',
    join: (id) => `/api/arena/rooms/${id}/join`,
    close: (id) => `/api/arena/rooms/${id}/close`,
  },
};

export default gameConfig;
