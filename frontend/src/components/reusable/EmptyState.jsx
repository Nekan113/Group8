export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {Icon && (
        <div className="mb-4 rounded-full bg-slate-100 p-4 text-slate-400">
          <Icon size={32} />
        </div>
      )}
      <h3 className="mb-2 text-lg font-semibold text-slate-700">{title}</h3>
      {description && <p className="mb-6 max-w-sm text-sm text-slate-500">{description}</p>}
      {action}
    </div>
  )
}
