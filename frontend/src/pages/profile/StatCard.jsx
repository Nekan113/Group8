export default function StatCard({ label, value, color = 'text-violet-400' }) {
  return (
    <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-700/50">
      <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">{label}</p>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
  );
}
