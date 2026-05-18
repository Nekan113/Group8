import Button from '../../components/ui/Button';

export default function WinnerOverlay({ game, user, onNewGame, onClose, isOnline }) {
  const winnerName = game.winner === 'player1' ? game.player1.username : game.player2?.username;
  const isYou = winnerName === user?.username;
  const isDraw = game.winner === 'draw';
  const isAborted = game.status === 'ABORTED';

  const emoji = isAborted ? '🚫' : isDraw ? '🤝' : isYou ? '🏆' : '💀';

  const cardBorder = isAborted
    ? 'border-slate-500/40'
    : isDraw
    ? 'border-yellow-500/50'
    : isYou
    ? 'border-yellow-400/60'
    : 'border-red-500/50';

  const cardGlow = isAborted
    ? ''
    : isDraw
    ? 'shadow-2xl shadow-yellow-500/20'
    : isYou
    ? 'shadow-2xl shadow-yellow-400/30'
    : 'shadow-2xl shadow-red-500/20';

  const emojiBg = isAborted
    ? 'bg-slate-700/40'
    : isDraw
    ? 'bg-yellow-500/15'
    : isYou
    ? 'bg-yellow-400/15'
    : 'bg-red-500/15';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className={`card p-8 text-center max-w-sm w-full animate-bounce-in border-2 ${cardBorder} ${cardGlow}`}>
        <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-4 animate-float ${emojiBg}`}>
          <span className="text-6xl">{emoji}</span>
        </div>
        <h2 className="text-3xl font-black text-white mb-2">
          {isAborted ? 'Game Aborted' : isDraw ? "It's a Draw!" : isYou ? 'You Win!' : `${winnerName} Wins!`}
        </h2>
        <p className="text-slate-400 mb-6 text-sm">
          {isAborted ? 'The game was aborted.' : isDraw ? 'No winner this time.' : `${winnerName} placed 5 in a row!`}
        </p>
        <div className="flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={onClose}>View Board</Button>
          <Button className="flex-1" onClick={onNewGame}>{isOnline ? 'Back to Arena' : 'New Game'}</Button>
        </div>
      </div>
    </div>
  );
}
