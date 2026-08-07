import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserPlus } from 'lucide-react'
import { Button, Input, Select, Card, Alert } from '../components/reusable'
import { VIETNAM_CITIES } from '../constants'
import {
  validateEmail,
  validatePassword,
  validateUsername,
  validateConfirmPassword,
} from '../utils/validation'

export default function RecipientRegisterPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '', city: '' })
  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState(false)

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  const validate = () => {
    const errs = {}
    const u = validateUsername(form.username)
    const e = validateEmail(form.email)
    const p = validatePassword(form.password)
    const c = validateConfirmPassword(form.password, form.confirmPassword)
    if (u) errs.username = u
    if (e) errs.email = e
    if (p) errs.password = p
    if (c) errs.confirmPassword = c
    if (!form.city) errs.city = 'Please select your city'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    setSuccess(true)
    setTimeout(() => navigate('/login'), 2000)
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      <Card>
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-aff-green-100 text-aff-green-600">
            <UserPlus size={24} />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Recipient Registration</h1>
          <p className="mt-1 text-sm text-slate-500">Create an account to browse and reserve food</p>
        </div>

        {success && (
          <Alert type="success" className="mb-4">
            Registration successful! Redirecting to login...
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Username"
            value={form.username}
            onChange={update('username')}
            error={errors.username}
            hint="Letters, numbers, underscore and hyphen only. Example: lan_nguyen"
            required
          />
          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={update('email')}
            error={errors.email}
            required
          />
          <Input
            label="Password"
            type="password"
            value={form.password}
            onChange={update('password')}
            error={errors.password}
            hint="Min 8 chars, 1 number, 1 special char, 1 uppercase. Example: MyPass@123"
            required
          />
          <Input
            label="Confirm Password"
            type="password"
            value={form.confirmPassword}
            onChange={update('confirmPassword')}
            error={errors.confirmPassword}
            required
          />
          <Select
            label="City"
            value={form.city}
            onChange={update('city')}
            options={VIETNAM_CITIES.map((c) => ({ value: c, label: c }))}
            error={errors.city}
            placeholder="Select city in Vietnam"
            required
          />
          <Button type="submit" className="w-full">Register</Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Are you a business donor?{' '}
          <Link to="/register/donor" className="font-medium text-aff-green-600 hover:underline">
            Register as Donor
          </Link>
        </p>
      </Card>
    </div>
  )
}
