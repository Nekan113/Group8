import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Building2 } from 'lucide-react'
import { Button, Input, Select, Card, Alert } from '../components/reusable'
import { VIETNAM_CITIES } from '../constants'
import {
  validateEmail,
  validatePassword,
  validateCompanyName,
  validateTaxCode,
  validateConfirmPassword,
} from '../utils/validation'

export default function DonorRegisterPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    companyName: '',
    email: '',
    password: '',
    confirmPassword: '',
    taxCode: '',
    city: '',
  })
  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState(false)

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  const validate = () => {
    const errs = {}
    const cn = validateCompanyName(form.companyName)
    const e = validateEmail(form.email)
    const p = validatePassword(form.password)
    const c = validateConfirmPassword(form.password, form.confirmPassword)
    const t = validateTaxCode(form.taxCode)
    if (cn) errs.companyName = cn
    if (e) errs.email = e
    if (p) errs.password = p
    if (c) errs.confirmPassword = c
    if (t) errs.taxCode = t
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
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-aff-orange-400/20 text-aff-orange-500">
            <Building2 size={24} />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Donor Registration</h1>
          <p className="mt-1 text-sm text-slate-500">Register your business to donate or sell affordable food</p>
        </div>

        {success && (
          <Alert type="success" className="mb-4">
            Registration successful! Redirecting to login...
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Company Name"
            value={form.companyName}
            onChange={update('companyName')}
            error={errors.companyName}
            hint="Vietnamese alphabets, numbers, space and hyphen. Example: Công ty ABC"
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
            label="Tax Code"
            value={form.taxCode}
            onChange={update('taxCode')}
            error={errors.taxCode}
            hint="10 to 13 digits. Example: 0123456789"
            required
          />
          <Input
            label="Password"
            type="password"
            value={form.password}
            onChange={update('password')}
            error={errors.password}
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
            required
          />
          <Button type="submit" className="w-full" variant="orange">Register as Donor</Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Looking for food?{' '}
          <Link to="/register/recipient" className="font-medium text-aff-green-600 hover:underline">
            Register as Recipient
          </Link>
        </p>
      </Card>
    </div>
  )
}
