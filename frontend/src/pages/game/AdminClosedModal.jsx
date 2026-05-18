import Button from '../../components/ui/Button';

export default function AdminClosedModal({ onBack }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="card p-8 text-center max-w-sm w-full border-red-500/30">
        <div className="text-6xl mb-4">🛑</div>
        <h2 className="text-2xl font-black text-white mb-2">Room Closed</h2>
        <p className="text-slate-400 text-sm mb-6">
          This room has been closed by an administrator.
        </p>
        <Button className="w-full" onClick={onBack}>Back to Arena</Button>
      </div>
    </div>
  );
}
