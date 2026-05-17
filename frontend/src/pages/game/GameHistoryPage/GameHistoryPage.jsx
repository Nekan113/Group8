import React from 'react';
import { Link } from 'react-router-dom';
import { useGameHistory } from './useGameHistory';
import Input from '../../../components/Input/Input';
import './GameHistoryPage.css';

function GameHistoryPage() {
  const { sessions, loading, search, filters, handleSearchChange, handleFilterChange, user } = useGameHistory();

  return (
    <div className="game-history-page">
      <h1 className="game-history-page__title">Game History</h1>

      <div className="game-history-page__filters">
        <Input
          id="hist-search"
          placeholder="Search by opponent or session #"
          value={search}
          onChange={handleSearchChange}
          className="game-history-page__search"
        />
        <select className="game-history-page__select" value={filters.result} onChange={handleFilterChange('result')}>
          <option value="">All Results</option>
          <option value="win">Win</option>
          <option value="lose">Lose</option>
          <option value="aborted">Aborted</option>
        </select>
        <select className="game-history-page__select" value={filters.gameType} onChange={handleFilterChange('gameType')}>
          <option value="">All Types</option>
          <option value="singleplayer">Single Player</option>
          <option value="twoplayer">Two Players</option>
          <option value="online">Online Match</option>
        </select>
        <input type="date" className="game-history-page__select" value={filters.dateFrom} onChange={handleFilterChange('dateFrom')} placeholder="From" />
        <input type="date" className="game-history-page__select" value={filters.dateTo} onChange={handleFilterChange('dateTo')} placeholder="To" />
        <select className="game-history-page__select" value={filters.sortDir} onChange={handleFilterChange('sortDir')}>
          <option value="desc">Newest First</option>
          <option value="asc">Oldest First</option>
        </select>
      </div>

      {loading ? (
        <p className="game-history-page__status">Loading…</p>
      ) : sessions.length === 0 ? (
        <p className="game-history-page__status">No sessions found.</p>
      ) : (
        <div className="game-history-page__table-wrapper">
          <table className="game-history-page__table">
            <thead>
              <tr>
                <th>#</th>
                <th>Type</th>
                <th>Opponent</th>
                <th>Result</th>
                <th>Start</th>
                <th>End</th>
                {user?.isPremium && <th>Replay</th>}
              </tr>
            </thead>
            <tbody>
              {sessions.map((s, i) => (
                <tr key={s._id || i}>
                  <td>{s.sessionNumber ?? i + 1}</td>
                  <td>{s.gameType}</td>
                  <td>{s.opponent}</td>
                  <td className={`game-history-page__result game-history-page__result--${s.result}`}>
                    {s.result}
                  </td>
                  <td>{s.startTime ? new Date(s.startTime).toLocaleString() : '—'}</td>
                  <td>{s.endTime ? new Date(s.endTime).toLocaleString() : '—'}</td>
                  {user?.isPremium && (
                    <td>
                      <Link to={`/game/replay/${s._id}`} className="game-history-page__replay-link">Watch</Link>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!user?.isPremium && (
        <div className="game-history-page__premium-hint">
          Upgrade to <strong>Premium</strong> to watch match replays.{' '}
          <Link to="/profile">Subscribe</Link>
        </div>
      )}
    </div>
  );
}

export default GameHistoryPage;
