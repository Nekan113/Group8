import React from 'react';
import { Link } from 'react-router-dom';
import { useOnlineGames } from './useOnlineGames';
import Input from '../../../components/Input/Input';
import Button from '../../../components/Button/Button';
import './OnlineGamesPage.css';

function OnlineGamesPage() {
  const { games, loading, search, closingId, handleSearchChange, handleClose } = useOnlineGames();

  return (
    <div className="online-games-page">
      <div className="online-games-page__header">
        <h1 className="online-games-page__title">Online Games</h1>
        <nav className="online-games-page__admin-nav">
          <Link to="/admin/players" className="online-games-page__nav-link">Players</Link>
          <Link to="/admin/games" className="online-games-page__nav-link online-games-page__nav-link--active">Online Games</Link>
        </nav>
      </div>

      <div className="online-games-page__search">
        <Input
          id="game-search"
          placeholder="Search by room number or player name…"
          value={search}
          onChange={handleSearchChange}
        />
      </div>

      {loading ? (
        <p className="online-games-page__status">Loading games…</p>
      ) : games.length === 0 ? (
        <p className="online-games-page__status">No active game rooms found.</p>
      ) : (
        <>
          <div className="online-games-page__table-wrapper">
            <table className="online-games-page__table">
              <thead>
                <tr>
                  <th>Room #</th>
                  <th>Player 1</th>
                  <th>Player 2</th>
                  <th>Board</th>
                  <th>Start Time</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {games.map((g) => (
                  <tr key={g._id}>
                    <td className="online-games-page__room-num">
                      #{g.roomNumber ?? g._id?.slice(-6)}
                    </td>
                    <td className="online-games-page__player">{g.player1Name}</td>
                    <td className="online-games-page__player">{g.player2Name || '—'}</td>
                    <td>{g.boardSize ?? 10}×{g.boardSize ?? 10}</td>
                    <td>{g.startTime ? new Date(g.startTime).toLocaleString() : '—'}</td>
                    <td>
                      <span className={`online-games-page__status-pill online-games-page__status-pill--${g.status ?? 'active'}`}>
                        {g.status ?? 'Active'}
                      </span>
                    </td>
                    <td>
                      <Button
                        size="sm"
                        variant="danger"
                        loading={closingId === g._id}
                        onClick={() => handleClose(g._id)}
                      >
                        Close
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="online-games-page__count">{games.length} game(s) shown</p>
        </>
      )}
    </div>
  );
}

export default OnlineGamesPage;
