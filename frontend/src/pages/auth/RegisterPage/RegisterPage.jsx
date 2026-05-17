import React from 'react';
import { Link } from 'react-router-dom';
import { useRegister } from './useRegister';
import Input from '../../../components/Input/Input';
import Button from '../../../components/Button/Button';
import CountrySelect from '../../../components/CountrySelect/CountrySelect';
import './RegisterPage.css';

function RegisterPage() {
  const { form, errors, serverError, loading, handleChange, handleSubmit } = useRegister();

  return (
    <div className="register-page">
      <div className="register-page__card">
        <div className="register-page__header">
          <h1 className="register-page__title">Create Account</h1>
          <p className="register-page__subtitle">Join TicTacToang and start playing</p>
        </div>

        {serverError && (
          <div className="register-page__server-error" role="alert">{serverError}</div>
        )}

        <form className="register-page__form" onSubmit={handleSubmit} noValidate>
          <Input
            id="username"
            label="Username"
            value={form.username}
            onChange={handleChange('username')}
            placeholder="e.g., player_123"
            error={errors.username}
            hint="Letters, numbers, _ and - only"
            required
          />

          <Input
            id="email"
            label="Email"
            type="email"
            value={form.email}
            onChange={handleChange('email')}
            placeholder="e.g., player@example.com"
            error={errors.email}
            required
          />

          <Input
            id="password"
            label="Password"
            type="password"
            value={form.password}
            onChange={handleChange('password')}
            placeholder="Min 8 chars, number, special char, uppercase"
            error={errors.password}
            autoComplete="new-password"
            required
          />

          <Input
            id="confirmPassword"
            label="Confirm Password"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange('confirmPassword')}
            placeholder="Repeat your password"
            error={errors.confirmPassword}
            autoComplete="new-password"
            required
          />

          <div className="register-page__field-group">
            <label className="register-page__label" htmlFor="country">
              Country <span className="register-page__required">*</span>
            </label>
            <CountrySelect
              id="country"
              value={form.country}
              onChange={handleChange('country')}
              error={errors.country}
              required
            />
          </div>

          <Button type="submit" fullWidth loading={loading} size="lg">
            Create Account
          </Button>
        </form>

        <p className="register-page__login-link">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
