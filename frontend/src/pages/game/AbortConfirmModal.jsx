import Button from '../../components/ui/Button';

export default function AbortConfirmModal({ isOnline, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="card p-7 text-center max-w-sm w-full border-red-500/20">
        <div className="text-5xl mb-4">⚠️</div>
        <h2 className="text-xl font-black text-white mb-2">
          {isOnline ? 'Leave Game?' : 'Abort Game?'}
        </h2>
        <p className="text-slate-400 text-sm mb-6">
          {isOnline
            ? 'Your opponent will be notified and the game will be recorded as aborted.'
            : 'No winner will be recorded. This cannot be undone.'}
        </p>
        <div className="flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={onCancel}>Stay</Button>
          <Button variant="danger" className="flex-1" onClick={onConfirm}>
            {isOnline ? 'Leave Game' : 'Abort Game'}
          </Button>
        </div>
      </div>
    </div>
  );
}
