import { useState, useEffect, useCallback } from 'react';
import { fetchAdminGames, closeGame } from './onlineGamesService';

export function useOnlineGames() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [closingId, setClosingId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, ok } = await fetchAdminGames(search);
    if (ok) setGames(Array.isArray(data) ? data : data.games ?? []);
    setLoading(false);
  }, [search]);

  useEffect(() => { load(); }, [load]);

  const handleClose = useCallback(async (id) => {
    if (!window.confirm('Force close this game room?')) return;
    setClosingId(id);
    const { ok } = await closeGame(id);
    if (ok) setGames((gs) => gs.filter((g) => g._id !== id));
    setClosingId(null);
  }, []);

  const handleSearchChange = useCallback((e) => setSearch(e.target.value), []);

  return { games, loading, search, closingId, handleSearchChange, handleClose };
}
