import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from './registerService';

const INITIAL = { username: '', email: '', password: '', confirmPassword: '', country: '' };

function validateUsername(v) {
  if (!v) return 'Username is required.';
  if (!/^[a-zA-Z0-9_-]+$/.test(v))
    return 'Username may only contain letters, numbers, underscore (_) and hyphen (-).';
  return '';
}

function validateEmail(v) {
  if (!v) return 'Email is required.';
  if (v.length >= 255) return 'Email must be less than 255 characters.';
  if ((v.match(/@/g) || []).length !== 1) return 'Email must contain exactly one @ symbol.';
  if (!/[^@]+@[^@]+\.[^@]+/.test(v)) return 'Email must contain a dot after @.';
  if (/[ ();:]/.test(v)) return 'Email must not contain spaces or prohibited characters ( ) ; :';
  return '';
}

function validatePassword(v) {
  if (!v) return 'Password is required.';
  if (v.length < 8) return 'Password must be at least 8 characters. E.g., Secret@1';
  if (!/[0-9]/.test(v)) return 'Password must contain at least 1 number. E.g., Secret@1';
  if (!/[$#@!]/.test(v)) return 'Password must contain at least one special character ($#@!). E.g., Secret@1';
  if (!/[A-Z]/.test(v)) return 'Password must contain at least 1 uppercase letter. E.g., Secret@1';
  return '';
}

export function useRegister() {
  const navigate = useNavigate();
  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = useCallback((field) => (e) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
    setServerError('');
  }, []);

  const validate = useCallback(() => {
    const e = {
      username: validateUsername(form.username),
      email: validateEmail(form.email),
      password: validatePassword(form.password),
      confirmPassword: form.confirmPassword !== form.password ? 'Passwords do not match.' : '',
      country: form.country ? '' : 'Please select your country.',
    };
    setErrors(e);
    return Object.values(e).every((v) => !v);
  }, [form]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const { data, ok } = await registerUser({
        username: form.username,
        email: form.email,
        password: form.password,
        country: form.country,
      });

      if (ok) {
        navigate('/login', { state: { registered: true } });
      } else {
        setServerError(data?.message || 'Registration failed. Please try again.');
      }
    } catch {
      setServerError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  }, [form, validate, navigate]);

  return { form, errors, serverError, loading, handleChange, handleSubmit };
}
