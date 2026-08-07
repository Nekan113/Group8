import { useState, useRef } from 'react'
import { Camera, Crown, Wallet } from 'lucide-react'
import { Button, Input, Select, Card, Alert, Avatar, Badge } from '../components/reusable'
import { useAuth } from '../hooks/useAuth'
import { VIETNAM_CITIES } from '../constants'
import { validateEmail, validatePassword, validateUsername } from '../utils/validation'
import { ROLES } from '../constants'

export default function ProfilePage() {
  const { user, updateUser } = useAuth()
  const fileRef = useRef(null)
  const isDonor = user.role === ROLES.DONOR
  const displayName = isDonor ? user.companyName : user.username

  const [form, setForm] = useState({
    email: user.email || '',
    username: user.username || user.companyName || '',
    password: '',
    city: user.city || '',
  })
  const [errors, setErrors] = useState({})
  const [saved, setSaved] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState(user.avatar)

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setAvatarPreview(reader.result)
      updateUser({ avatar: reader.result })
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = {}
    const emailErr = validateEmail(form.email)
    if (emailErr) errs.email = emailErr
    if (!isDonor) {
      const userErr = validateUsername(form.username)
      if (userErr) errs.username = userErr
    }
    if (form.password) {
      const passErr = validatePassword(form.password)
      if (passErr) errs.password = passErr
    }
    if (!form.city) errs.city = 'Please select your city'
    setErrors(errs)
    if (Object.keys(errs).length) return

    updateUser({
      email: form.email,
      ...(isDonor ? {} : { username: form.username }),
      city: form.city,
      avatar: avatarPreview,
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold text-slate-800">Profile Management</h1>

      {saved && <Alert type="success" className="mb-4">Profile updated successfully!</Alert>}

      <Card className="mb-6">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
          <div className="relative">
            <Avatar name={displayName} src={avatarPreview} size="xl" />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="absolute -bottom-1 -right-1 rounded-full bg-aff-green-600 p-2 text-white shadow-lg hover:bg-aff-green-700"
            >
              <Camera size={16} />
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-xl font-semibold text-slate-800">{displayName}</h2>
            <p className="text-sm text-slate-500">{user.email}</p>
            <div className="mt-2 flex flex-wrap justify-center gap-2 sm:justify-start">
              <Badge variant="info">{isDonor ? 'Donor' : 'Recipient'}</Badge>
              {user.isPremium && <Badge variant="premium"><Crown size={12} className="mr-1" />Premium</Badge>}
            </div>
            {!isDonor && (
              <p className="mt-2 flex items-center justify-center gap-1 text-sm text-slate-600 sm:justify-start">
                <Wallet size={14} /> Wallet: {(user.walletBalance || 0).toLocaleString('vi-VN')} VND
              </p>
            )}
          </div>
        </div>
      </Card>

      <Card>
        <h3 className="mb-4 font-semibold text-slate-800">Edit Contact Information</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={update('email')}
            error={errors.email}
            required
          />
          {!isDonor && (
            <Input
              label="Username"
              value={form.username}
              onChange={update('username')}
              error={errors.username}
              required
            />
          )}
          <Input
            label="New Password (leave blank to keep current)"
            type="password"
            value={form.password}
            onChange={update('password')}
            error={errors.password}
          />
          <Select
            label="City"
            value={form.city}
            onChange={update('city')}
            options={VIETNAM_CITIES.map((c) => ({ value: c, label: c }))}
            error={errors.city}
            required
          />
          <Button type="submit">Save Changes</Button>
        </form>
      </Card>
    </div>
  )
}
