import { useState, useMemo } from 'react'
import { Plus, Search, Pause, Play, XCircle, Copy, HandHeart } from 'lucide-react'
import {
  Button, Input, Select, Card, Badge, Modal, Alert, Textarea,
} from '../components/reusable'
import { mockListings } from '../data/mockData'
import { useAuth } from '../hooks/useAuth'
import {
  FOOD_CATEGORIES, MEASUREMENT_UNITS, VEGETARIAN_OPTIONS, LISTING_STATUS,
} from '../constants'
import { formatPrice, formatDate } from '../utils/validation'

const emptyForm = {
  name: '', description: '', unit: 'kg', category: '', vegetarian: 'na',
  totalQuantity: '', price: '0', ration: '1',
}

export default function DonorListingsPage() {
  const { user } = useAuth()
  const [listings, setListings] = useState(
    mockListings.filter((l) => l.donorId === user.id)
  )
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [sortBy, setSortBy] = useState('createdAt-desc')
  const [showCreate, setShowCreate] = useState(false)
  const [showManual, setShowManual] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [perRequestWarning, setPerRequestWarning] = useState(false)
  const [selectedListing, setSelectedListing] = useState(null)
  const [manualForm, setManualForm] = useState({ quantity: '', recipientName: '', cashReceived: '' })

  const updateForm = (field) => (e) => {
    const val = e.target.value
    setForm((f) => ({ ...f, [field]: val }))
    if (field === 'unit') setPerRequestWarning(val === 'per_request')
  }

  const filtered = useMemo(() => {
    let result = [...listings]
    if (search) {
      const q = search.toLowerCase()
      result = result.filter((l) => l.name.toLowerCase().includes(q))
    }
    if (categoryFilter) result = result.filter((l) => l.category === categoryFilter)
    const [field, dir] = sortBy.split('-')
    result.sort((a, b) => {
      const av = field === 'revenue' ? a.revenue : new Date(a.createdAt)
      const bv = field === 'revenue' ? b.revenue : new Date(b.createdAt)
      return dir === 'asc' ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1)
    })
    return result
  }, [listings, search, categoryFilter, sortBy])

  const active = filtered.filter((l) => l.status === LISTING_STATUS.ACTIVE || l.status === LISTING_STATUS.PAUSED)
  const past = filtered.filter((l) => l.status === LISTING_STATUS.SOLD_OUT || l.status === LISTING_STATUS.CANCELLED)

  const handleCreate = () => {
    const newListing = {
      id: `LST${Date.now()}`,
      donorId: user.id,
      donorName: user.companyName,
      donorCity: user.city,
      name: form.name,
      description: form.description,
      category: form.category,
      vegetarian: form.vegetarian,
      unit: form.unit,
      totalQuantity: Number(form.totalQuantity),
      remainingQuantity: Number(form.totalQuantity),
      price: Number(form.price),
      ration: Number(form.ration),
      status: 'active',
      createdAt: new Date().toISOString(),
      donations: 0,
      revenue: 0,
    }
    setListings([newListing, ...listings])
    setShowCreate(false)
    setForm(emptyForm)
    setPerRequestWarning(false)
  }

  const duplicateListing = (listing) => {
    setForm({
      name: listing.name,
      description: listing.description || '',
      unit: listing.unit,
      category: listing.category,
      vegetarian: listing.vegetarian,
      totalQuantity: String(listing.totalQuantity),
      price: String(listing.price),
      ration: String(listing.ration),
    })
    setShowCreate(true)
  }

  const changeStatus = (id, status) => {
    setListings(listings.map((l) => l.id === id ? { ...l, status, ...(status === 'cancelled' ? { closedAt: new Date().toISOString() } : {}) } : l))
  }

  const orderTotal = selectedListing ? selectedListing.price * Number(manualForm.quantity || 0) : 0
  const change = Number(manualForm.cashReceived || 0) - orderTotal

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Food Donation Management</h1>
          <p className="text-slate-500">Create and manage your food listings</p>
        </div>
        <Button onClick={() => { setForm(emptyForm); setShowCreate(true) }}>
          <Plus size={18} /> New Listing
        </Button>
      </div>

      <Card className="mb-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search by listing name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            options={[{ value: '', label: 'All Categories' }, ...FOOD_CATEGORIES.map((c) => ({ value: c, label: c }))]}
            className="sm:w-48"
          />
          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            options={[
              { value: 'createdAt-desc', label: 'Newest First' },
              { value: 'createdAt-asc', label: 'Oldest First' },
              { value: 'revenue-desc', label: 'Revenue ↓' },
              { value: 'revenue-asc', label: 'Revenue ↑' },
            ]}
            className="sm:w-48"
          />
        </div>
      </Card>

      <ListingSection title="Active Donations" listings={active} onPause={(id) => changeStatus(id, 'paused')} onResume={(id) => changeStatus(id, 'active')} onCancel={(id) => changeStatus(id, 'cancelled')} onDuplicate={duplicateListing} onManual={(l) => { setSelectedListing(l); setShowManual(true) }} />
      <ListingSection title="Past Donations" listings={past} past onDuplicate={duplicateListing} />

      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Create Food Listing" size="lg"
        footer={<><Button variant="ghost" onClick={() => setShowCreate(false)}>Cancel</Button><Button onClick={handleCreate}>Create Listing</Button></>}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Donation Name" value={form.name} onChange={updateForm('name')} required className="sm:col-span-2" />
          <Textarea label="Description (optional)" value={form.description} onChange={updateForm('description')} className="sm:col-span-2" />
          <Select label="Measurement Unit" value={form.unit} onChange={updateForm('unit')} options={MEASUREMENT_UNITS} required />
          <Select label="Food Category" value={form.category} onChange={updateForm('category')} options={FOOD_CATEGORIES.map((c) => ({ value: c, label: c }))} required />
          <Select label="Vegetarian Status" value={form.vegetarian} onChange={updateForm('vegetarian')} options={VEGETARIAN_OPTIONS} />
          <Input label="Donation Limit" type="number" step="0.01" value={form.totalQuantity} onChange={updateForm('totalQuantity')} required />
          <Input label="Price (0 = Free, or ≥ 1000 VND)" type="number" value={form.price} onChange={updateForm('price')} required />
          <Input label="Ration (max per person)" type="number" step="0.01" value={form.ration} onChange={updateForm('ration')} required />
        </div>
        {perRequestWarning && (
          <Alert type="warning" className="mt-4">
            Per Request: Recipients collect at your discretion. Online reservation unavailable. Visitors may still come after distribution ends.
          </Alert>
        )}
      </Modal>

      <Modal isOpen={showManual} onClose={() => setShowManual(false)} title="Manual Donation" size="md"
        footer={<><Button variant="ghost" onClick={() => setShowManual(false)}>Cancel</Button><Button onClick={() => setShowManual(false)}>Record Donation</Button></>}>
        {selectedListing && (
          <div className="space-y-4">
            <p className="text-sm text-slate-600">Listing: <strong>{selectedListing.name}</strong></p>
            <Input label="Recipient Name" value={manualForm.recipientName} onChange={(e) => setManualForm({ ...manualForm, recipientName: e.target.value })} />
            <Input label="Quantity" type="number" value={manualForm.quantity} onChange={(e) => setManualForm({ ...manualForm, quantity: e.target.value })} />
            {selectedListing.price > 0 && (
              <>
                <p className="text-sm text-slate-600">Order total: <strong>{formatPrice(orderTotal)}</strong></p>
                <Input label="Cash Received (VND)" type="number" value={manualForm.cashReceived} onChange={(e) => setManualForm({ ...manualForm, cashReceived: e.target.value })} />
                {manualForm.cashReceived && (
                  <Alert type="info">Change: {formatPrice(Math.max(0, change))}</Alert>
                )}
              </>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}

function ListingSection({ title, listings, past, onPause, onResume, onCancel, onDuplicate, onManual }) {
  if (!listings.length) return null
  return (
    <section className="mb-8">
      <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-800">
        {title}
        <Badge>{listings.length}</Badge>
      </h2>
      <div className="grid gap-4 md:grid-cols-2">
        {listings.map((l) => (
          <Card key={l.id}>
            <div className="mb-3 flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-slate-800">{l.name}</h3>
                <p className="text-xs text-slate-500">{l.category} · {l.vegetarian === 'yes' ? 'Vegetarian' : l.vegetarian === 'no' ? 'Non-veg' : 'N/A'}</p>
              </div>
              <StatusBadge status={l.status} />
            </div>
            <div className="mb-4 grid grid-cols-2 gap-2 text-sm text-slate-600">
              <span>Limit: {l.totalQuantity} {l.unit}</span>
              <span>Remaining: {l.remainingQuantity} {l.unit}</span>
              <span>Price: {formatPrice(l.price)}</span>
              <span>Ration: {l.ration} {l.unit}</span>
              <span>Donated: {l.donations}</span>
              <span>Revenue: {formatPrice(l.revenue)}</span>
              <span className="col-span-2">Created: {formatDate(l.createdAt)}</span>
              {l.closedAt && <span className="col-span-2">Closed: {formatDate(l.closedAt)}</span>}
            </div>
            {!past && (
              <div className="flex flex-wrap gap-2">
                {l.status === 'active' && (
                  <Button size="sm" variant="ghost" onClick={() => onPause(l.id)}><Pause size={14} /> Pause</Button>
                )}
                {l.status === 'paused' && (
                  <Button size="sm" variant="ghost" onClick={() => onResume(l.id)}><Play size={14} /> Resume</Button>
                )}
                {(l.status === 'active' || l.status === 'paused') && (
                  <Button size="sm" variant="danger" onClick={() => onCancel(l.id)}><XCircle size={14} /> Cancel</Button>
                )}
                <Button size="sm" variant="secondary" onClick={() => onDuplicate(l)}><Copy size={14} /> Duplicate</Button>
                <Button size="sm" variant="orange" onClick={() => onManual(l)}><HandHeart size={14} /> Manual Give</Button>
              </div>
            )}
            {past && (
              <Button size="sm" variant="secondary" onClick={() => onDuplicate(l)}><Copy size={14} /> Reuse Config</Button>
            )}
          </Card>
        ))}
      </div>
    </section>
  )
}

function StatusBadge({ status }) {
  const map = {
    active: { label: 'Active', variant: 'success' },
    paused: { label: 'Paused', variant: 'warning' },
    cancelled: { label: 'Cancelled', variant: 'danger' },
    sold_out: { label: 'Sold Out', variant: 'default' },
  }
  const s = map[status] || map.active
  return <Badge variant={s.variant}>{s.label}</Badge>
}
