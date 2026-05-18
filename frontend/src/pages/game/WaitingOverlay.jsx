import Button from '../../components/ui/Button';

export default function WaitingOverlay({ game, onCancel }) {
  const p2Joined = game?.player2?.username && game.player2.username !== 'Waiting...';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="card p-8 text-center max-w-sm w-full border-violet-500/30">
        <div className="flex justify-center mb-5">
          <span className="relative flex h-14 w-14">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-40" />
            <span className="relative inline-flex rounded-full h-14 w-14 bg-violet-600 items-center justify-center text-2xl">
              {p2Joined ? '🎯' : '⏳'}
            </span>
          </span>
        </div>
        <h2 className="text-2xl font-black text-white mb-2">
          {p2Joined ? 'Opponent Joined!' : 'Waiting for Opponent'}
        </h2>
        <p className="text-slate-400 text-sm mb-1">
          {p2Joined
            ? `${game.player2.username} is choosing their marker…`
            : 'Your room is ready. Share the Arena with a friend!'}
        </p>
        <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-700/50 my-4 text-left space-y-1.5">
          <p className="text-xs text-slate-500">
            Board: <span className="text-slate-300 font-medium">{game?.boardSize}×{game?.boardSize}</span>
          </p>
          <p className="text-xs text-slate-500">
            Your marker: <span className="text-violet-400 font-bold text-base">{game?.player1?.marker}</span>
          </p>
          {p2Joined && (
            <p className="text-xs text-slate-500">
              Opponent: <span className="text-white font-medium">{game.player2.username}</span>
            </p>
          )}
        </div>
        {!p2Joined && (
          <Button variant="danger" size="sm" className="w-full mt-1" onClick={onCancel}>
            Cancel Room
          </Button>
        )}
      </div>
    </div>
  );
}
