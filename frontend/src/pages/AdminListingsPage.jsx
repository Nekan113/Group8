import { useState } from 'react'
import { Package, Search, XCircle } from 'lucide-react'
import { Button, Input, Card, Badge, Alert } from '../components/reusable'
import { mockListings } from '../data/mockData'
import { formatPrice, formatDate } from '../utils/validation'

export default function AdminListingsPage() {
  const [listings, setListings] = useState(
    mockListings.filter((l) => l.status === 'active' || l.status === 'paused')
  )
  const [search, setSearch] = useState('')
  const [cancelMsg, setCancelMsg] = useState('')

  const filtered = listings.filter((l) => {
    const q = search.toLowerCase()
    return (
      l.name.toLowerCase().includes(q) ||
      l.donorName.toLowerCase().includes(q) ||
      l.donorId.toLowerCase().includes(q) ||
      l.id.toLowerCase().includes(q)
    )
  })

  const cancelListing = (id) => {
    setListings(listings.map((l) => l.id === id ? { ...l, status: 'cancelled', closedAt: new Date().toISOString() } : l))
    setCancelMsg('Listing cancelled. Affected recipients will receive real-time notification.')
    setTimeout(() => setCancelMsg(''), 4000)
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Food Listings Management</h1>
          <p className="text-slate-500">View and manage all active food listings</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Package size={16} /> {filtered.length} listings
        </div>
      </div>

      {cancelMsg && <Alert type="warning" className="mb-4">{cancelMsg}</Alert>}

      <Card className="mb-6">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input placeholder="Search by Donor Name, Donor ID, or Listing ID..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
      </Card>

      <Card padding={false}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-500">
                <th className="px-4 py-3 font-medium">Listing ID</th>
                <th className="px-4 py-3 font-medium">Donor</th>
                <th className="px-4 py-3 font-medium">Food Name</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Available</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Posted</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((l) => (
                <tr key={l.id} className="border-b border-slate-50 hover:bg-slate-50">
                  <td className="px-4 py-3 font-mono text-xs">{l.id}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-700">{l.donorName}</p>
                    <p className="text-xs text-slate-400">{l.donorId}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-700">{l.name}</td>
                  <td className="px-4 py-3 text-slate-600">{l.category}</td>
                  <td className="px-4 py-3 text-slate-600">{l.remainingQuantity} {l.unit}</td>
                  <td className="px-4 py-3 text-slate-600">{formatPrice(l.price)}</td>
                  <td className="px-4 py-3 text-xs text-slate-500">{formatDate(l.createdAt)}</td>
                  <td className="px-4 py-3">
                    <Badge variant={l.status === 'active' ? 'success' : l.status === 'paused' ? 'warning' : 'danger'}>
                      {l.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    {l.status !== 'cancelled' && (
                      <Button size="sm" variant="danger" onClick={() => cancelListing(l.id)}>
                        <XCircle size={14} /> Cancel
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
