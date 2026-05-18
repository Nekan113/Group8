export default function AlgebraicLabel({ index, axis, size, style }) {
  const label = axis === 'col' ? String.fromCharCode(97 + index) : String(size - index);
  return (
    <div
      className="text-xs text-slate-500 flex items-center justify-center font-mono"
      style={style}
    >
      {label}
    </div>
  );
}
