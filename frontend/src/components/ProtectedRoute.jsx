import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { ROLES } from '../constants'

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, isAuthenticated } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const redirectMap = {
      [ROLES.ADMIN]: '/admin/users',
      [ROLES.DONOR]: '/donor/dashboard',
      [ROLES.RECIPIENT]: '/recipient/browse',
    }
    return <Navigate to={redirectMap[user.role] || '/'} replace />
  }

  return children
}
