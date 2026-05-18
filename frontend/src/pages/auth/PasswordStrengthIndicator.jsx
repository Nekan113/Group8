import { usePasswordStrength } from './RegisterPage.hooks';

export default function PasswordStrengthIndicator({ password }) {
  const { checks, score, colors, labels } = usePasswordStrength(password);
  if (!password) return null;

  return (
    <div className="mt-2 space-y-2">
      <div className="flex gap-1">
        {checks.map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all ${i < score ? colors[score - 1] : 'bg-slate-700'}`}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-3 gap-y-1">
        {checks.map(c => (
          <span
            key={c.label}
            className={`text-xs flex items-center gap-1 ${c.ok ? 'text-emerald-400' : 'text-slate-500'}`}
          >
            {c.ok ? '✓' : '○'} {c.label}
          </span>
        ))}
      </div>
      {score > 0 && (
        <p className={`text-xs font-medium ${colors[score - 1].replace('bg-', 'text-')}`}>
          {labels[score - 1]}
        </p>
      )}
    </div>
  );
}
