export default function FeatureCard({ icon, title, desc }) {
  return (
    <div className="card p-5 hover:border-violet-600/40 hover:bg-slate-700/50 transition-all duration-200">
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="text-white font-semibold mb-1">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}
