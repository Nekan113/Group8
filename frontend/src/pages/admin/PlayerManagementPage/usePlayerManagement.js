import { useState, useEffect, useCallback } from 'react';
import { fetchPlayers, setPlayerStatus } from './playerManagementService';

export function usePlayerManagement() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, ok } = await fetchPlayers(search);
    if (ok) setPlayers(Array.isArray(data) ? data : data.players ?? []);
    setLoading(false);
  }, [search]);

  useEffect(() => { load(); }, [load]);

  const handleToggleStatus = useCallback(async (player) => {
    setActionLoading(player._id);
    const { data, ok } = await setPlayerStatus(player._id, !player.isActive);
    if (ok) {
      setPlayers((ps) =>
        ps.map((p) => p._id === player._id ? { ...p, isActive: !player.isActive } : p)
      );
    }
    setActionLoading(null);
  }, []);

  const handleSearchChange = useCallback((e) => setSearch(e.target.value), []);

  return { players, loading, search, actionLoading, handleSearchChange, handleToggleStatus };
}
