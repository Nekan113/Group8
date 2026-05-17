import React from 'react';
import { Link } from 'react-router-dom';
import { useProfile } from './useProfile';
import AvatarUpload from './components/AvatarUpload/AvatarUpload';
import EditProfileForm from './components/EditProfileForm/EditProfileForm';
import Button from '../../../components/Button/Button';
import Input from '../../../components/Input/Input';
import './ProfilePage.css';

const TABS = [
  { key: 'info', label: 'Profile Info' },
  { key: 'history', label: 'Game History' },
  { key: 'wallet', label: 'Wallet & Premium' },
];

function ProfilePage() {
  const {
    profile, profileLoading,
    history, historyLoading,
    filters, setFilters,
    activeTab, setActiveTab,
    depositAmount, setDepositAmount,
    depositMsg, subscribeMsg,
    handleDeposit, handleSubscribeLocal, handleStripeCheckout,
    onProfileUpdated,
  } = useProfile();

  if (profileLoading) return <div className="profile-page__loading">Loading profile…</div>;
  if (!profile) return <div className="profile-page__loading">Could not load profile.</div>;

  return (
    <div className="profile-page">
      <aside className="profile-page__sidebar">
        <AvatarUpload
          currentAvatar={profile.avatarUrl}
          onSuccess={(d) => onProfileUpdated({ avatarUrl: d.avatarUrl })}
        />
        <div className="profile-page__identity">
          <h2 className="profile-page__name">{profile.username}</h2>
          <span className="profile-page__country">{profile.country}</span>
          {profile.isPremium ? (
            <span className="profile-page__premium-badge">PRO Member</span>
          ) : (
            <span className="profile-page__free-badge">Free Tier</span>
          )}
        </div>
        <div className="profile-page__wallet-info">
          <span className="profile-page__wallet-label">Wallet Balance</span>
          <span className="profile-page__wallet-value">${(profile.walletBalance ?? 0).toFixed(2)}</span>
        </div>
        <nav className="profile-page__tabs">
          {TABS.map((t) => (
            <button
              key={t.key}
              className={`profile-page__tab ${activeTab === t.key ? 'profile-page__tab--active' : ''}`}
              onClick={() => setActiveTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </aside>

      <main className="profile-page__content">
        {activeTab === 'info' && (
          <EditProfileForm profile={profile} onSuccess={onProfileUpdated} />
        )}

        {activeTab === 'history' && (
          <section className="profile-page__history">
            <div className="profile-page__history-filters">
              <Input
                id="hist-search"
                placeholder="Search by opponent name or session #"
                value={filters.search}
                onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
              />
              <select
                className="profile-page__select"
                value={filters.result}
                onChange={(e) => setFilters((f) => ({ ...f, result: e.target.value }))}
              >
                <option value="">All Results</option>
                <option value="win">Win</option>
                <option value="lose">Lose</option>
                <option value="aborted">Aborted</option>
              </select>
              <select
                className="profile-page__select"
                value={filters.gameType}
                onChange={(e) => setFilters((f) => ({ ...f, gameType: e.target.value }))}
              >
                <option value="">All Types</option>
                <option value="singleplayer">Single Player</option>
                <option value="twoplayer">Two Players</option>
                <option value="online">Online Match</option>
              </select>
              <select
                className="profile-page__select"
                value={filters.sortDir}
                onChange={(e) => setFilters((f) => ({ ...f, sortDir: e.target.value }))}
              >
                <option value="desc">Newest First</option>
                <option value="asc">Oldest First</option>
              </select>
            </div>

            {historyLoading ? (
              <p className="profile-page__loading">Loading history…</p>
            ) : history.length === 0 ? (
              <p className="profile-page__empty">No game sessions found.</p>
            ) : (
              <div className="profile-page__history-table-wrapper">
                <table className="profile-page__history-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Type</th>
                      <th>Opponent</th>
                      <th>Result</th>
                      <th>Start</th>
                      <th>End</th>
                      {profile.isPremium && <th>Replay</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((s, i) => (
                      <tr key={s._id || i} className={`profile-page__history-row profile-page__history-row--${s.result}`}>
                        <td>{s.sessionNumber ?? i + 1}</td>
                        <td>{s.gameType}</td>
                        <td>{s.opponent}</td>
                        <td className={`profile-page__result profile-page__result--${s.result}`}>
                          {s.result}
                        </td>
                        <td>{s.startTime ? new Date(s.startTime).toLocaleString() : '—'}</td>
                        <td>{s.endTime ? new Date(s.endTime).toLocaleString() : '—'}</td>
                        {profile.isPremium && (
                          <td>
                            <Link to={`/game/replay/${s._id}`} className="profile-page__replay-link">
                              Watch
                            </Link>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {activeTab === 'wallet' && (
          <section className="profile-page__wallet">
            <div className="profile-page__wallet-card">
              <h3 className="profile-page__wallet-card-title">Deposit Funds</h3>
              <div className="profile-page__wallet-deposit">
                <Input
                  id="deposit-amount"
                  type="number"
                  placeholder="Amount in USD"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                />
                <Button onClick={handleDeposit}>Deposit</Button>
              </div>
              {depositMsg && <p className="profile-page__wallet-msg">{depositMsg}</p>}
            </div>

            <div className="profile-page__wallet-card">
              <h3 className="profile-page__wallet-card-title">Premium Subscription</h3>
              <p className="profile-page__wallet-desc">
                Unlock match replays, custom markers, and more for <strong>$10 / month</strong>.
              </p>
              {profile.isPremium ? (
                <div className="profile-page__premium-active">
                  Premium active until {profile.premiumExpiry
                    ? new Date(profile.premiumExpiry).toLocaleDateString()
                    : 'next billing cycle'}
                </div>
              ) : (
                <div className="profile-page__subscribe-options">
                  <Button onClick={handleSubscribeLocal} variant="ghost">
                    Pay with Wallet ($10)
                  </Button>
                  <Button onClick={handleStripeCheckout} variant="success">
                    Pay with Stripe
                  </Button>
                </div>
              )}
              {subscribeMsg && <p className="profile-page__wallet-msg">{subscribeMsg}</p>}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default ProfilePage;
