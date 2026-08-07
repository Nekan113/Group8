import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react'

const config = {
  error: { icon: AlertCircle, bg: 'bg-red-50 border-red-200 text-red-800' },
  success: { icon: CheckCircle, bg: 'bg-green-50 border-green-200 text-green-800' },
  warning: { icon: AlertTriangle, bg: 'bg-amber-50 border-amber-200 text-amber-800' },
  info: { icon: Info, bg: 'bg-blue-50 border-blue-200 text-blue-800' },
}

export default function Alert({ type = 'info', title, children, className = '' }) {
  const { icon: Icon, bg } = config[type]

  return (
    <div className={`flex gap-3 rounded-lg border p-4 ${bg} ${className}`}>
      <Icon className="mt-0.5 shrink-0" size={20} />
      <div>
        {title && <p className="mb-1 font-medium">{title}</p>}
        <div className="text-sm opacity-90">{children}</div>
      </div>
    </div>
  )
}
