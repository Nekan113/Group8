import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { fetchHistory } from './gameHistoryService';

export function useGameHistory() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ result: '', gameType: '', sortDir: 'desc', dateFrom: '', dateTo: '' });

  const load = useCallback(async () => {
    setLoading(true);
    const params = {};
    if (search) params.search = search;
    if (filters.result) params.result = filters.result;
    if (filters.gameType) params.gameType = filters.gameType;
    if (filters.sortDir) params.sortDir = filters.sortDir;
    if (filters.dateFrom) params.dateFrom = filters.dateFrom;
    if (filters.dateTo) params.dateTo = filters.dateTo;

    const { data, ok } = await fetchHistory(params);
    if (ok) setSessions(Array.isArray(data) ? data : data.sessions ?? []);
    setLoading(false);
  }, [search, filters]);

  useEffect(() => { load(); }, [load]);

  const handleSearchChange = useCallback((e) => setSearch(e.target.value), []);
  const handleFilterChange = useCallback((key) => (e) => {
    setFilters((f) => ({ ...f, [key]: e.target.value }));
  }, []);

  return { sessions, loading, search, filters, handleSearchChange, handleFilterChange, user };
}
