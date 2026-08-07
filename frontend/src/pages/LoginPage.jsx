import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { LogIn } from 'lucide-react'
import { Button, Input, Card, Alert } from '../components/reusable'
import { useAuth } from '../hooks/useAuth'
import { demoCredentials } from '../data/mockData'
import { ROLES } from '../constants'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname

  const redirectByRole = (role) => {
    if (from) return from
    const map = {
      [ROLES.ADMIN]: '/admin/users',
      [ROLES.DONOR]: '/donor/dashboard',
      [ROLES.RECIPIENT]: '/recipient/browse',
    }
    return map[role] || '/'
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = await login(email, password)
      navigate(redirectByRole(user.role))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const fillDemo = (cred) => {
    setEmail(cred.email)
    setPassword(cred.password)
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-lg items-center px-4 py-12">
      <Card className="w-full">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-aff-green-100 text-aff-green-600">
            <LogIn size={24} />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Welcome back</h1>
          <p className="mt-1 text-sm text-slate-500">Sign in to your AFF account</p>
        </div>

        {error && <Alert type="error" className="mb-4">{error}</Alert>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email or Username"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="user@example.com"
            required
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <div className="mt-6 border-t border-slate-100 pt-6">
          <p className="mb-3 text-xs font-medium uppercase tracking-wide text-slate-400">Demo Accounts (Milestone 2)</p>
          <div className="space-y-2">
            {demoCredentials.map((cred) => (
              <button
                key={cred.email}
                type="button"
                onClick={() => fillDemo(cred)}
                className="flex w-full items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-left text-sm hover:border-aff-green-300 hover:bg-aff-green-50"
              >
                <span className="font-medium text-slate-700">{cred.label}</span>
                <span className="text-xs text-slate-400">{cred.email}</span>
              </button>
            ))}
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-slate-500">
          Don&apos;t have an account?{' '}
          <Link to="/register/recipient" className="font-medium text-aff-green-600 hover:underline">
            Register as Recipient
          </Link>
          {' '}or{' '}
          <Link to="/register/donor" className="font-medium text-aff-green-600 hover:underline">
            Donor
          </Link>
        </p>
      </Card>
    </div>
  )
}
