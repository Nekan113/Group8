import { useState } from 'react'
import { Crown, Wallet, Bell, Plus, Check } from 'lucide-react'
import { Button, Input, Select, Card, Alert, Badge } from '../components/reusable'
import { useAuth } from '../hooks/useAuth'
import { FOOD_CATEGORIES, VIETNAM_CITIES, PREMIUM_PRICE_USD } from '../constants'

export default function PremiumPage() {
  const { user, updateUser } = useAuth()
  const [depositAmount, setDepositAmount] = useState('')
  const [depositMsg, setDepositMsg] = useState('')
  const [subscribeMsg, setSubscribeMsg] = useState('')
  const [preferences, setPreferences] = useState([
    { id: 1, categories: ['Vegetable'], vegetarian: 'yes', priceMin: 0, priceMax: 10000, city: user.city },
  ])
  const [newPref, setNewPref] = useState({ categories: [], vegetarian: 'yes', priceMin: 0, priceMax: 50000, city: user.city })

  const handleDeposit = () => {
    const amount = Number(depositAmount)
    if (amount <= 0) return
    updateUser({ walletBalance: (user.walletBalance || 0) + amount })
    setDepositMsg(`Deposited ${amount.toLocaleString('vi-VN')} VND successfully!`)
    setDepositAmount('')
    setTimeout(() => setDepositMsg(''), 3000)
  }

  const handleSubscribe = () => {
    const feeVnd = PREMIUM_PRICE_USD * 25000
    if ((user.walletBalance || 0) < feeVnd) {
      setSubscribeMsg('Insufficient wallet balance. Please deposit first.')
      return
    }
    updateUser({ walletBalance: user.walletBalance - feeVnd, isPremium: true })
    setSubscribeMsg(`Premium activated! $${PREMIUM_PRICE_USD}/month paid from wallet. Confirmation email sent.`)
  }

  const toggleCategory = (cat) => {
    setNewPref((p) => ({
      ...p,
      categories: p.categories.includes(cat)
        ? p.categories.filter((c) => c !== cat)
        : [...p.categories, cat],
    }))
  }

  const addPreference = () => {
    if (!newPref.categories.length) return
    setPreferences([...preferences, { ...newPref, id: Date.now() }])
    setNewPref({ categories: [], vegetarian: 'yes', priceMin: 0, priceMax: 50000, city: user.city })
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 text-purple-600">
          <Crown size={32} />
        </div>
        <h1 className="text-2xl font-bold text-slate-800">Premium Subscription</h1>
        <p className="text-slate-500">Get real-time notifications and priority listings</p>
        {user.isPremium && <Badge variant="premium" className="mt-2">Active Premium Member</Badge>}
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <Card>
          <div className="flex items-center gap-3">
            <Wallet className="text-aff-green-600" size={24} />
            <div>
              <p className="text-sm text-slate-500">Wallet Balance</p>
              <p className="text-xl font-bold text-slate-800">{(user.walletBalance || 0).toLocaleString('vi-VN')} VND</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <Crown className="text-purple-600" size={24} />
            <div>
              <p className="text-sm text-slate-500">Premium Fee</p>
              <p className="text-xl font-bold text-slate-800">${PREMIUM_PRICE_USD} USD / month</p>
            </div>
          </div>
        </Card>
      </div>

      {depositMsg && <Alert type="success" className="mb-4">{depositMsg}</Alert>}
      {subscribeMsg && <Alert type={subscribeMsg.includes('Insufficient') ? 'warning' : 'success'} className="mb-4">{subscribeMsg}</Alert>}

      <Card className="mb-6">
        <h3 className="mb-4 font-semibold text-slate-800">Deposit to Wallet</h3>
        <div className="flex gap-3">
          <Input
            type="number"
            placeholder="Amount (VND)"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
            className="flex-1"
          />
          <Button onClick={handleDeposit}>Deposit</Button>
        </div>
      </Card>

      {!user.isPremium && (
        <Card className="mb-6 bg-gradient-to-r from-purple-50 to-indigo-50">
          <h3 className="mb-2 font-semibold text-slate-800">Subscribe to Premium</h3>
          <ul className="mb-4 space-y-1 text-sm text-slate-600">
            <li className="flex items-center gap-2"><Check size={14} className="text-purple-600" /> Real-time food listing notifications</li>
            <li className="flex items-center gap-2"><Check size={14} className="text-purple-600" /> Custom notification preferences</li>
            <li className="flex items-center gap-2"><Check size={14} className="text-purple-600" /> Priority listing by location</li>
          </ul>
          <Button onClick={handleSubscribe} className="bg-purple-600 hover:bg-purple-700">
            Subscribe — ${PREMIUM_PRICE_USD}/month
          </Button>
        </Card>
      )}

      {user.isPremium && (
        <Card>
          <div className="mb-4 flex items-center gap-2">
            <Bell size={20} className="text-purple-600" />
            <h3 className="font-semibold text-slate-800">Notification Preferences</h3>
          </div>

          {preferences.map((pref) => (
            <div key={pref.id} className="mb-3 rounded-lg border border-slate-200 p-3 text-sm">
              <p><strong>Categories:</strong> {pref.categories.join(', ')}</p>
              <p><strong>Vegetarian:</strong> {pref.vegetarian}</p>
              <p><strong>Price:</strong> {pref.priceMin.toLocaleString()} – {pref.priceMax.toLocaleString()} VND</p>
              <p><strong>City:</strong> {pref.city}</p>
            </div>
          ))}

          <div className="mt-4 space-y-3 border-t border-slate-100 pt-4">
            <p className="text-sm font-medium text-slate-700">Add New Preference</p>
            <div className="flex flex-wrap gap-2">
              {FOOD_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => toggleCategory(cat)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${newPref.categories.includes(cat) ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Select label="Vegetarian" value={newPref.vegetarian} onChange={(e) => setNewPref({ ...newPref, vegetarian: e.target.value })} options={[
                { value: 'yes', label: 'Vegetarian' },
                { value: 'no', label: 'Non-vegetarian' },
                { value: 'na', label: 'Any' },
              ]} />
              <Select label="City" value={newPref.city} onChange={(e) => setNewPref({ ...newPref, city: e.target.value })} options={VIETNAM_CITIES.map((c) => ({ value: c, label: c }))} />
              <Input label="Min Price (VND)" type="number" value={newPref.priceMin} onChange={(e) => setNewPref({ ...newPref, priceMin: Number(e.target.value) })} />
              <Input label="Max Price (VND)" type="number" value={newPref.priceMax} onChange={(e) => setNewPref({ ...newPref, priceMax: Number(e.target.value) })} />
            </div>
            <Button variant="secondary" onClick={addPreference}><Plus size={16} /> Add Preference</Button>
          </div>
        </Card>
      )}
    </div>
  )
}
