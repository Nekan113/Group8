import { useAuthContext } from '../context/AuthContext';

export function useAuth() {
  return useAuthContext();
}

export function useIsAuthenticated() {
  const { user } = useAuthContext();
  return !!user;
}

export function useIsAdmin() {
  const { user } = useAuthContext();
  return user?.role === 'ADMIN';
}

export function useIsPremium() {
  const { user } = useAuthContext();
  return user?.isPremium === true;
}
