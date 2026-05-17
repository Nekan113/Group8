import { useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { loginUser } from './loginService';

export function useLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || '/';

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const registeredMessage = location.state?.registered
    ? 'Account created successfully! Please sign in.'
    : '';

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!identifier || !password) {
      setError('Please enter your username/email and password.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const { data, ok, status } = await loginUser({ identifier, password });

      if (ok) {
        login(data.token, data.user);
        navigate(redirectTo, { replace: true });
      } else if (status === 429) {
        setError('Too many failed attempts. Account temporarily locked for 60 seconds.');
      } else if (status === 403) {
        setError('Your account has been deactivated. Please contact an administrator.');
      } else {
        setError(data?.message || 'Invalid credentials. Please try again.');
      }
    } catch {
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  }, [identifier, password, login, navigate, redirectTo]);

  return {
    identifier, setIdentifier,
    password, setPassword,
    error, loading,
    registeredMessage,
    handleSubmit,
  };
}
