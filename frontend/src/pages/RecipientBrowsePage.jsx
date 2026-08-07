import { useState, useMemo } from 'react'
import { Search, MapPin, Filter, ShoppingBag } from 'lucide-react'
import {
  Button, Input, Select, Card, Badge, Modal, Alert, EmptyState,
} from '../components/reusable'
import { mockListings } from '../data/mockData'
import { useAuth } from '../hooks/useAuth'
import { FOOD_CATEGORIES, VIETNAM_CITIES, PAYMENT_METHODS } from '../constants'
import { formatPrice, formatDate } from '../utils/validation'

export default function RecipientBrowsePage() {
  const { user } = useAuth()
  const [search, setSearch] = useState('')
  const [cityFilter, setCityFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [priceMin, setPriceMin] = useState('')
  const [priceMax, setPriceMax] = useState('')
  const [sortPrice, setSortPrice] = useState('')
  const [reserveListing, setReserveListing] = useState(null)
  const [quantity, setQuantity] = useState('1')
  const [paymentMethod, setPaymentMethod] = useState('cash')
  const [reserved, setReserved] = useState(false)

  const activeListings = mockListings.filter(
    (l) => l.status === 'active' && l.remainingQuantity >= 1 && l.unit !== 'per_request'
  )

  const filtered = useMemo(() => {
    let result = [...activeListings]
    if (search) {
      const q = search.toLowerCase()
      result = result.filter((l) => l.name.toLowerCase().includes(q))
    }
    if (cityFilter) result = result.filter((l) => l.donorCity === cityFilter)
    if (categoryFilter) result = result.filter((l) => l.category === categoryFilter)
    if (priceMin) result = result.filter((l) => l.price >= Number(priceMin))
    if (priceMax) result = result.filter((l) => l.price <= Number(priceMax))
    if (sortPrice === 'asc') result.sort((a, b) => a.price - b.price)
    if (sortPrice === 'desc') result.sort((a, b) => b.price - a.price)
    if (user.isPremium) {
      result.sort((a, b) => (a.donorCity === user.city ? -1 : 1))
    }
    return result
  }, [activeListings, search, cityFilter, categoryFilter, priceMin, priceMax, sortPrice, user])

  const orderTotal = reserveListing ? reserveListing.price * Number(quantity || 0) : 0

  const handleReserve = () => {
    setReserved(true)
    setTimeout(() => {
      setReserveListing(null)
      setReserved(false)
      setQuantity('1')
    }, 2000)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Browse Food Listings</h1>
        <p className="text-slate-500">Discover free and affordable food near you</p>
        {user.isPremium && (
          <Alert type="info" className="mt-3">
            Premium: Listings in {user.city} are prioritized. Real-time notifications enabled.
          </Alert>
        )}
      </div>

      <Card className="mb-6">
        <div className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-600">
          <Filter size={16} /> Filters
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="relative lg:col-span-2">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input placeholder="Search by name (e.g. co → Coconut)..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Select value={cityFilter} onChange={(e) => setCityFilter(e.target.value)} options={[{ value: '', label: 'All Cities' }, ...VIETNAM_CITIES.map((c) => ({ value: c, label: c }))]} />
          <Select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} options={[{ value: '', label: 'All Categories' }, ...FOOD_CATEGORIES.map((c) => ({ value: c, label: c }))]} />
          <Input placeholder="Min price (VND)" type="number" value={priceMin} onChange={(e) => setPriceMin(e.target.value)} />
          <Input placeholder="Max price (VND)" type="number" value={priceMax} onChange={(e) => setPriceMax(e.target.value)} />
          <Select value={sortPrice} onChange={(e) => setSortPrice(e.target.value)} options={[
            { value: '', label: 'Default Sort' },
            { value: 'asc', label: 'Price: Low to High' },
            { value: 'desc', label: 'Price: High to Low' },
          ]} />
        </div>
      </Card>

      {filtered.length === 0 ? (
        <EmptyState icon={ShoppingBag} title="No listings found" description="Try adjusting your filters or check back later." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((l) => (
            <Card key={l.id} className="flex flex-col">
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-slate-800">{l.name}</h3>
                  <p className="text-xs text-slate-500">{l.donorName}</p>
                </div>
                <Badge variant={l.price === 0 ? 'success' : 'info'}>{formatPrice(l.price)}</Badge>
              </div>
              {l.description && <p className="mb-3 text-sm text-slate-500 line-clamp-2">{l.description}</p>}
              <div className="mb-4 space-y-1 text-sm text-slate-600">
                <p>Category: {l.category}</p>
                <p>Available: {l.remainingQuantity} {l.unit}</p>
                <p>Ration: {l.ration} {l.unit}/person</p>
                <p className="flex items-center gap-1"><MapPin size={14} /> {l.donorCity}</p>
                <p className="text-xs text-slate-400">Posted: {formatDate(l.createdAt)}</p>
              </div>
              <div className="mt-auto flex gap-2">
                <a
                  href={`https://www.openstreetmap.org/search?query=${encodeURIComponent(l.donorCity + ', Vietnam')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1"
                >
                  <Button variant="ghost" size="sm" className="w-full"><MapPin size={14} /> Map</Button>
                </a>
                <Button size="sm" className="flex-1" onClick={() => setReserveListing(l)}>
                  Reserve
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        isOpen={!!reserveListing}
        onClose={() => setReserveListing(null)}
        title="Reserve Food"
        footer={
          reserved ? null : (
            <>
              <Button variant="ghost" onClick={() => setReserveListing(null)}>Cancel</Button>
              <Button onClick={handleReserve}>Confirm Reservation</Button>
            </>
          )
        }
      >
        {reserved ? (
          <Alert type="success">Reservation confirmed! Check your collection history.</Alert>
        ) : reserveListing && (
          <div className="space-y-4">
            <p className="font-medium text-slate-800">{reserveListing.name}</p>
            <p className="text-sm text-slate-500">Max ration: {reserveListing.ration} {reserveListing.unit}</p>
            <Input
              label={`Quantity (${reserveListing.unit})`}
              type="number"
              step="0.01"
              min="1"
              max={Math.min(reserveListing.remainingQuantity, reserveListing.ration)}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
            {reserveListing.price > 0 && (
              <>
                <p className="text-sm">Total: <strong>{formatPrice(orderTotal)}</strong></p>
                <Select
                  label="Payment Method"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  options={PAYMENT_METHODS.filter((m) => m.value !== 'card' || user.isPremium)}
                />
                {paymentMethod === 'wallet' && (
                  <Alert type={user.walletBalance >= orderTotal ? 'info' : 'warning'}>
                    Wallet balance: {formatPrice(user.walletBalance)}
                    {user.walletBalance < orderTotal && ' — Insufficient funds'}
                  </Alert>
                )}
              </>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}
