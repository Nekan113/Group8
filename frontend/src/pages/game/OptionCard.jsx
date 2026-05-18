export default function OptionCard({ selected, onClick, children, className = '' }) {
  return (
    <button
      onClick={onClick}
      className={`border-2 rounded-xl p-4 text-center transition-all duration-150 w-full ${
        selected
          ? 'border-violet-500 bg-violet-600/15 text-white shadow-lg shadow-violet-500/20'
          : 'border-slate-700 bg-slate-800/50 text-slate-300 hover:border-slate-500 hover:bg-slate-800'
      } ${className}`}
    >
      {children}
    </button>
  );
}
