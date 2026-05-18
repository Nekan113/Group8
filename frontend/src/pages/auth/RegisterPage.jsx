import { Link } from 'react-router-dom';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';
import Select from '../../components/ui/Select';
import { useRegisterForm } from './RegisterPage.hooks';
import PasswordStrengthIndicator from './PasswordStrengthIndicator';
import './RegisterPage.css';

const COUNTRIES = [
  'Afghanistan','Albania','Algeria','Argentina','Australia','Austria','Bangladesh','Belgium',
  'Brazil','Cambodia','Canada','Chile','China','Colombia','Croatia','Czech Republic','Denmark',
  'Egypt','Ethiopia','Finland','France','Germany','Ghana','Greece','Hungary','India','Indonesia',
  'Iran','Iraq','Ireland','Israel','Italy','Japan','Jordan','Kenya','Malaysia','Mexico',
  'Morocco','Myanmar','Netherlands','New Zealand','Nigeria','Norway','Pakistan','Peru',
  'Philippines','Poland','Portugal','Romania','Russia','Saudi Arabia','Singapore','South Africa',
  'South Korea','Spain','Sri Lanka','Sweden','Switzerland','Thailand','Turkey','Ukraine',
  'United Kingdom','United States','Venezuela','Vietnam','Other'
];

export default function RegisterPage() {
  const { form, errors, serverError, loading, showPass, setShowPass, handleChange, handleSubmit } = useRegisterForm();
  const countryOptions = [{ value: '', label: 'Select your country' }, ...COUNTRIES.map(c => ({ value: c, label: c }))];

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-slide-up">
        <div className="text-center mb-8">
          <img src="/tictactoe-logo.png" alt="TicTacToang" className="w-14 h-14 object-contain mx-auto mb-4 drop-shadow-xl" />
          <h1 className="text-3xl font-black text-white">Create account</h1>
          <p className="text-slate-400 mt-1">Join TicTacToang and start playing</p>
        </div>

        <div className="card p-7">
          <Alert type="error" message={serverError} className="mb-5" />

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <Input
              label="Username"
              name="username"
              value={form.username}
              onChange={handleChange}
              error={errors.username}
              placeholder="e.g. player_one"
              autoComplete="username"
            />
            <Input
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="you@example.com"
              autoComplete="email"
            />
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input
                  name="password"
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange}
                  className={`input-field pr-10 ${errors.password ? 'input-error' : ''}`}
                  placeholder="Create a strong password"
                  autoComplete="new-password"
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200">
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
              {errors.password && <p className="mt-1.5 text-xs text-red-400">{errors.password}</p>}
              <PasswordStrengthIndicator password={form.password} />
            </div>
            <Input
              label="Confirm Password"
              name="confirmPassword"
              type={showPass ? 'text' : 'password'}
              value={form.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              placeholder="Repeat your password"
              autoComplete="new-password"
            />
            <Select
              label="Country"
              name="country"
              value={form.country}
              onChange={handleChange}
              error={errors.country}
              options={countryOptions}
            />

            <Button type="submit" className="w-full mt-2" loading={loading} size="lg">
              Create Account
            </Button>
          </form>

          <p className="text-center text-sm text-slate-400 mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-violet-400 hover:text-violet-300 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
