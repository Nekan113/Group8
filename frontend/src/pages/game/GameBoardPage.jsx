import { useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ChatBox from '../../components/chat/ChatBox';
import { PageLoader } from '../../components/ui/LoadingSpinner';
import Button from '../../components/ui/Button';
import { useGameBoard, useOnlineGameSocket, usePlayerAvatars } from './GameBoardPage.hooks';
import WinnerOverlay from './WinnerOverlay';
import WaitingOverlay from './WaitingOverlay';
import AbortConfirmModal from './AbortConfirmModal';
import AdminClosedModal from './AdminClosedModal';
import AlgebraicLabel from './AlgebraicLabel';
import './GameBoardPage.css';

const BOARD_STYLES = [
  { id: 'classic', label: 'Classic', cellBg: 'bg-slate-100', cellBorder: 'border-slate-400', winCellBg: 'bg-amber-400' },
  { id: 'dark',    label: 'Dark',    cellBg: 'bg-slate-800', cellBorder: 'border-slate-600', winCellBg: 'bg-violet-600' },
  { id: 'neon',    label: 'Neon',    cellBg: 'bg-slate-900', cellBorder: 'border-cyan-700',  winCellBg: 'bg-cyan-500'   },
];

export default function GameBoardPage() {
  const { id } = useParams();
  const { state } = useLocation();
  const { user } = useAuth();
  const [boardStyle, setBoardStyle] = useState(BOARD_STYLES[1]);

  const isOnline = state?.online === true;
  const isHost = state?.isHost === true;

  const {
    game, setGame, loading, aiThinking,
    showOverlay, setShowOverlay,
    showAbortModal, setShowAbortModal,
    moveError, isWinCell, handleCellClick,
    handleAbort, handleAbortConfirm, navigate,
  } = useGameBoard(
    id,
    state?.game ? { ...state.game, firstAiMove: state?.firstAiMove } : null,
    user,
    isOnline
  );

  const { adminClosed } = useOnlineGameSocket(id, isOnline, setGame, setShowOverlay);
  const avatars = usePlayerAvatars(game, user);

  if (loading) return <PageLoader />;
  if (!game) return (
    <div className="page-container flex items-center justify-center">
      <div className="text-center">
        <p className="text-slate-400 text-lg">Game not found.</p>
        <Button onClick={() => navigate('/game/setup')} className="mt-4">New Game</Button>
      </div>
    </div>
  );

  const size = game.boardSize;
  const isSP = game.gameType === 'SINGLE_PLAYER';
  const currentPlayer = game.currentTurn === 'player1' ? game.player1 : game.player2;

  const isMyTurn = isOnline
    ? (game.currentTurn === 'player1'
        ? game.player1?.username === user?.username
        : game.player2?.username === user?.username)
    : true;

  const isWaiting = isOnline && isHost && game.status === 'WAITING';

  return (
    <div className="page-container">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-4">
        <div className="flex flex-col xl:flex-row gap-4">
          {/* BOARD */}
          <div className="flex-1 flex flex-col items-center">
            <div className="flex gap-2 mb-4">
              {BOARD_STYLES.map(s => (
                <button
                  key={s.id}
                  onClick={() => setBoardStyle(s)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all border ${
                    boardStyle.id === s.id
                      ? 'bg-violet-600/20 border-violet-500 text-violet-300'
                      : 'bg-slate-800/50 border-slate-700 text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            <div
              className={`rounded-xl overflow-hidden border-2 ${
                boardStyle.id === 'neon' ? 'border-cyan-700 shadow-2xl shadow-cyan-500/20' :
                boardStyle.id === 'dark' ? 'border-slate-600 shadow-2xl shadow-slate-900/50' :
                'border-slate-300 shadow-xl'
              }`}
              style={{ maxWidth: '100%', overflow: 'auto' }}
            >
              <div className={`flex ${boardStyle.id === 'classic' ? 'bg-slate-200' : 'bg-slate-800'}`}>
                <div className="w-5 flex-shrink-0" />
                {Array.from({ length: size }, (_, c) => (
                  <AlgebraicLabel key={c} index={c} axis="col" size={size}
                    style={{ width: `${Math.max(28, Math.floor(560 / size))}px`, height: '18px' }} />
                ))}
              </div>

              {game.board.map((row, r) => (
                <div key={r} className="flex">
                  <div
                    className={`w-5 flex-shrink-0 flex items-center justify-center text-xs text-slate-500 font-mono ${boardStyle.id === 'classic' ? 'bg-slate-200' : 'bg-slate-800'}`}
                    style={{ height: `${Math.max(28, Math.floor(560 / size))}px` }}
                  >
                    {size - r}
                  </div>
                  {row.map((cell, c) => {
                    const winning = isWinCell(r, c);
                    const cellSize = `${Math.max(28, Math.floor(560 / size))}px`;
                    const isClickable = game.status === 'ACTIVE' && !cell && !aiThinking && isMyTurn
                      && (isSP ? game.currentTurn === 'player1' : true);
                    return (
                      <button
                        key={c}
                        onClick={() => handleCellClick(r, c)}
                        disabled={!isClickable || !!cell}
                        style={{ width: cellSize, height: cellSize, fontSize: `${Math.max(11, Math.floor(380 / size))}px` }}
                        className={`border flex items-center justify-center font-black transition-all duration-100 select-none
                          ${boardStyle.cellBorder} ${boardStyle.cellBg}
                          ${winning ? `${boardStyle.winCellBg} animate-win-pulse scale-105 z-10` : ''}
                          ${isClickable && !cell ? 'cursor-pointer hover:brightness-110 hover:scale-105 active:scale-95' : 'cursor-default'}
                          ${cell === game.player1.marker ? 'text-violet-400' : cell ? 'text-cyan-400' : ''}
                        `}
                      >
                        {cell || ''}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>

            {moveError && <p className="text-red-400 text-sm mt-2">{moveError}</p>}
          </div>

          {/* SIDEBAR */}
          <div className="xl:w-64 flex flex-row xl:flex-col gap-3 flex-wrap">
            {/* Status */}
            <div className="card p-4 flex-1 xl:flex-none">
              <p className="text-xs text-slate-500 uppercase font-semibold mb-3">Game Status</p>
              {game.status === 'ACTIVE' ? (
                <div>
                  {aiThinking ? (
                    <div className="flex items-center gap-2 text-yellow-400">
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                      </svg>
                      <span className="text-sm font-medium">AI thinking…</span>
                    </div>
                  ) : (
                    <div>
                      <p className="text-white font-semibold text-sm">{currentPlayer.username}'s turn</p>
                      <span className="text-2xl">{currentPlayer.marker}</span>
                      {isOnline && (
                        <p className={`text-xs mt-1 ${isMyTurn ? 'text-emerald-400' : 'text-slate-500'}`}>
                          {isMyTurn ? 'Your turn' : "Opponent's turn"}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <span className={`text-sm font-semibold ${game.status === 'FINISHED' ? 'text-violet-400' : 'text-red-400'}`}>
                  {game.status}
                </span>
              )}
            </div>

            {/* Players */}
            <div className="card p-4 flex-1 xl:flex-none">
              <p className="text-xs text-slate-500 uppercase font-semibold mb-3">Players</p>
              <div className="space-y-3">
                {[game.player1, game.player2].map((p, i) => {
                  const avatarUrl = i === 0 ? avatars.p1 : avatars.p2;
                  const accentBg = i === 0 ? 'bg-violet-600/30' : 'bg-cyan-600/30';
                  const accentText = i === 0 ? 'text-violet-400' : 'text-cyan-400';
                  const badgeBg = i === 0 ? 'bg-violet-600' : 'bg-cyan-600';
                  return (
                    <div key={i} className={`flex items-center gap-2.5 rounded-lg p-2 transition-all ${
                      game.currentTurn === (i === 0 ? 'player1' : 'player2') && game.status === 'ACTIVE'
                        ? 'bg-violet-600/15 border border-violet-600/30'
                        : 'opacity-60'
                    }`}>
                      {/* Avatar with marker badge */}
                      <div className="relative flex-shrink-0">
                        <div className={`w-10 h-10 rounded-full overflow-hidden ${accentBg}`}>
                          {avatarUrl ? (
                            <img src={avatarUrl} alt={p.username} className="w-full h-full object-cover" />
                          ) : (
                            <div className={`w-full h-full flex items-center justify-center text-sm font-black ${accentText}`}>
                              {p.isAI ? '🤖' : p.username?.[0]?.toUpperCase() || '?'}
                            </div>
                          )}
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-black border-2 border-slate-800 ${badgeBg} text-white`}>
                          {p.marker}
                        </div>
                      </div>
                      <div>
                        <p className="text-white text-xs font-semibold">{p.username}</p>
                        <p className="text-slate-500 text-xs">
                          {p.isAI ? 'AI' : isOnline ? (p.username === user?.username ? 'You' : 'Opponent') : 'Human'}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Moves */}
            <div className="card p-4 flex-1 xl:flex-none">
              <p className="text-xs text-slate-500 uppercase font-semibold mb-2">Moves: {game.moves?.length || 0}</p>
              <div className="max-h-28 overflow-y-auto space-y-0.5">
                {(game.moves || []).slice(-10).map((m, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-xs text-slate-400 py-0.5">
                    <span className={m.player === 'player1' ? 'text-violet-400' : 'text-cyan-400'}>
                      {m.player === 'player1' ? game.player1.marker : game.player2.marker}
                    </span>
                    <span className="font-mono">{String.fromCharCode(97 + m.col)}{size - m.row}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            {game.status === 'ACTIVE' && (
              <Button variant="danger" size="sm" className="xl:w-full" onClick={handleAbort}>
                🚫 {isOnline ? 'Leave Game' : 'Abort Game'}
              </Button>
            )}
            {(game.status === 'FINISHED' || game.status === 'ABORTED') && (
              <Button className="xl:w-full" onClick={() => navigate(isOnline ? '/arena' : '/game/setup')}>
                {isOnline ? '🏟️ Back to Arena' : '🎮 New Game'}
              </Button>
            )}

            {/* Chat (online games only) */}
            {isOnline && (
              <div className="xl:w-full w-full">
                <ChatBox gameId={id} currentUsername={user?.username} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Waiting overlay — host waits for opponent, non-dismissible */}
      {isWaiting && (
        <WaitingOverlay
          game={game}
          onCancel={handleAbort}
        />
      )}

      {/* Abort / Leave confirmation modal */}
      {showAbortModal && (
        <AbortConfirmModal
          isOnline={isOnline}
          onConfirm={handleAbortConfirm}
          onCancel={() => setShowAbortModal(false)}
        />
      )}

      {/* Admin closed this room */}
      {adminClosed && (
        <AdminClosedModal onBack={() => navigate('/arena')} />
      )}

      {/* Winner / aborted result overlay */}
      {showOverlay && !isWaiting && (
        <WinnerOverlay
          game={game}
          user={user}
          isOnline={isOnline}
          onNewGame={() => navigate(isOnline ? '/arena' : '/game/setup')}
          onClose={() => setShowOverlay(false)}
        />
      )}
    </div>
  );
}
