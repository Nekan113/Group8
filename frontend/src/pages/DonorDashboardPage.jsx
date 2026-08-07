import { Package, TrendingUp, DollarSign, Users } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts'
import { StatCard, Card, Badge } from '../components/reusable'
import { mockListings } from '../data/mockData'
import { useAuth } from '../hooks/useAuth'
import { formatPrice } from '../utils/validation'

const CHART_COLORS = ['#16a34a', '#f97316', '#3b82f6', '#8b5cf6', '#ef4444', '#06b6d4']

export default function DonorDashboardPage() {
  const { user } = useAuth()
  const myListings = mockListings.filter((l) => l.donorId === user.id)

  const activeCount = myListings.filter((l) => l.status === 'active' || l.status === 'paused').length
  const totalDonated = myListings.reduce((sum, l) => sum + l.donations, 0)
  const totalRevenue = myListings.reduce((sum, l) => sum + l.revenue, 0)

  const byCategory = FOOD_CATEGORIES.map((cat) => ({
    name: cat,
    quantity: myListings.filter((l) => l.category === cat).reduce((s, l) => s + l.donations, 0),
    revenue: myListings.filter((l) => l.category === cat).reduce((s, l) => s + l.revenue, 0),
  })).filter((c) => c.quantity > 0)

  const byUnit = ['kg', 'g', 'L', 'ml', 'unit'].map((u) => ({
    name: u,
    value: myListings.filter((l) => l.unit === u).reduce((s, l) => s + l.donations, 0),
  })).filter((c) => c.value > 0)

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Donor Dashboard</h1>
        <p className="text-slate-500">Welcome back, {user.companyName}</p>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Active Listings" value={activeCount} icon={Package} color="green" />
        <StatCard label="Total Donations" value={totalDonated} icon={Users} color="blue" />
        <StatCard label="Total Revenue" value={formatPrice(totalRevenue)} icon={DollarSign} color="orange" />
        <StatCard label="Categories" value={byCategory.length} icon={TrendingUp} color="purple" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h3 className="mb-4 font-semibold text-slate-800">Donations by Category</h3>
          {byCategory.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={byCategory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="quantity" fill="#16a34a" name="Quantity" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="py-12 text-center text-sm text-slate-400">No donation data yet</p>
          )}
        </Card>

        <Card>
          <h3 className="mb-4 font-semibold text-slate-800">Revenue by Category</h3>
          {byCategory.some((c) => c.revenue > 0) ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={byCategory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(v) => formatPrice(v)} />
                <Bar dataKey="revenue" fill="#f97316" name="Revenue" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="py-12 text-center text-sm text-slate-400">No revenue data yet</p>
          )}
        </Card>

        {byUnit.length > 0 && (
          <Card className="lg:col-span-2">
            <h3 className="mb-4 font-semibold text-slate-800">Donations by Measurement Unit</h3>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={byUnit} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                  {byUnit.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        )}
      </div>

      <Card className="mt-6">
        <h3 className="mb-4 font-semibold text-slate-800">Recent Listings</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="pb-3 pr-4 font-medium">Name</th>
                <th className="pb-3 pr-4 font-medium">Category</th>
                <th className="pb-3 pr-4 font-medium">Remaining</th>
                <th className="pb-3 pr-4 font-medium">Price</th>
                <th className="pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {myListings.slice(0, 5).map((l) => (
                <tr key={l.id} className="border-b border-slate-50">
                  <td className="py-3 pr-4 font-medium text-slate-700">{l.name}</td>
                  <td className="py-3 pr-4 text-slate-600">{l.category}</td>
                  <td className="py-3 pr-4 text-slate-600">{l.remainingQuantity} {l.unit}</td>
                  <td className="py-3 pr-4 text-slate-600">{formatPrice(l.price)}</td>
                  <td className="py-3"><StatusBadge status={l.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

const FOOD_CATEGORIES = ['Fruit', 'Vegetable', 'Meat', 'Cooked Dish', 'Baked Goods', 'Drink']

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
