import React from 'react';
import { Link } from 'react-router-dom';
import { usePlayerManagement } from './usePlayerManagement';
import Input from '../../../components/Input/Input';
import Button from '../../../components/Button/Button';
import './PlayerManagementPage.css';

function PlayerManagementPage() {
  const { players, loading, search, actionLoading, handleSearchChange, handleToggleStatus } = usePlayerManagement();

  return (
    <div className="player-management-page">
      <div className="player-management-page__header">
        <h1 className="player-management-page__title">Player Management</h1>
        <nav className="player-management-page__admin-nav">
          <Link to="/admin/players" className="player-management-page__nav-link player-management-page__nav-link--active">Players</Link>
          <Link to="/admin/games" className="player-management-page__nav-link">Online Games</Link>
        </nav>
      </div>

      <div className="player-management-page__search">
        <Input
          id="admin-search"
          placeholder="Search players by username or email…"
          value={search}
          onChange={handleSearchChange}
        />
      </div>

      {loading ? (
        <p className="player-management-page__status">Loading players…</p>
      ) : players.length === 0 ? (
        <p className="player-management-page__status">No players found.</p>
      ) : (
        <>
          <div className="player-management-page__table-wrapper">
            <table className="player-management-page__table">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Country</th>
                  <th>Premium</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {players.map((p) => (
                  <tr key={p._id} className={!p.isActive ? 'player-management-page__row--inactive' : ''}>
                    <td className="player-management-page__cell--username">
                      <img
                        src={p.avatarUrl || '/default-avatar.png'}
                        alt={p.username}
                        className="player-management-page__avatar"
                      />
                      {p.username}
                    </td>
                    <td>{p.email}</td>
                    <td>{p.country}</td>
                    <td>
                      {p.isPremium
                        ? <span className="player-management-page__badge player-management-page__badge--premium">PRO</span>
                        : <span className="player-management-page__badge">Free</span>
                      }
                    </td>
                    <td>
                      <span className={`player-management-page__status-pill player-management-page__status-pill--${p.isActive ? 'active' : 'inactive'}`}>
                        {p.isActive ? 'Active' : 'Deactivated'}
                      </span>
                    </td>
                    <td>
                      <Button
                        size="sm"
                        variant={p.isActive ? 'danger' : 'success'}
                        loading={actionLoading === p._id}
                        onClick={() => handleToggleStatus(p)}
                      >
                        {p.isActive ? 'Deactivate' : 'Reactivate'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="player-management-page__count">{players.length} player(s) shown</p>
        </>
      )}
    </div>
  );
}

export default PlayerManagementPage;
