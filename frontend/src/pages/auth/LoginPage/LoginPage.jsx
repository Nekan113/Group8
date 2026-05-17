import React from 'react';
import { Link } from 'react-router-dom';
import { useLogin } from './useLogin';
import Input from '../../../components/Input/Input';
import Button from '../../../components/Button/Button';
import './LoginPage.css';

function LoginPage() {
  const {
    identifier, setIdentifier,
    password, setPassword,
    error, loading,
    registeredMessage,
    handleSubmit,
  } = useLogin();

  return (
    <div className="login-page">
      <div className="login-page__card">
        <div className="login-page__header">
          <h1 className="login-page__title">Welcome Back</h1>
          <p className="login-page__subtitle">Sign in to TicTacToang</p>
        </div>

        {registeredMessage && (
          <div className="login-page__success" role="status">{registeredMessage}</div>
        )}

        {error && (
          <div className="login-page__error" role="alert">{error}</div>
        )}

        <form className="login-page__form" onSubmit={handleSubmit} noValidate>
          <Input
            id="identifier"
            label="Username or Email"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="Enter username or email"
            autoComplete="username"
            required
          />

          <Input
            id="password"
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            autoComplete="current-password"
            required
          />

          <Button type="submit" fullWidth loading={loading} size="lg">
            Sign In
          </Button>
        </form>

        <p className="login-page__register-link">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
