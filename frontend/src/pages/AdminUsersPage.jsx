import { useState } from 'react'
import { Users, UserX, UserCheck, Search } from 'lucide-react'
import { Button, Input, Card, Badge, Alert } from '../components/reusable'
import { mockAdminUsers } from '../data/mockData'

export default function AdminUsersPage() {
  const [users, setUsers] = useState(mockAdminUsers)
  const [search, setSearch] = useState('')
  const [actionMsg, setActionMsg] = useState('')

  const filtered = users.filter((u) => {
    const q = search.toLowerCase()
    return u.username.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.id.toLowerCase().includes(q)
  })

  const toggleStatus = (id) => {
    setUsers(users.map((u) => {
      if (u.id !== id) return u
      const newStatus = u.status === 'active' ? 'inactive' : 'active'
      setActionMsg(`Account ${u.username} ${newStatus === 'active' ? 'reactivated' : 'deactivated'}`)
      setTimeout(() => setActionMsg(''), 3000)
      return { ...u, status: newStatus }
    }))
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">User Management</h1>
          <p className="text-slate-500">Manage Recipients and Donors</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Users size={16} /> {users.length} accounts
        </div>
      </div>

      {actionMsg && <Alert type="info" className="mb-4">{actionMsg}</Alert>}

      <Card className="mb-6">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input placeholder="Search by ID, username, or email..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
      </Card>

      <Card padding={false}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-500">
                <th className="px-6 py-3 font-medium">Account ID</th>
                <th className="px-6 py-3 font-medium">Username</th>
                <th className="px-6 py-3 font-medium">Email</th>
                <th className="px-6 py-3 font-medium">Role</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id} className="border-b border-slate-50 hover:bg-slate-50">
                  <td className="px-6 py-4 font-mono text-xs text-slate-500">{u.id}</td>
                  <td className="px-6 py-4 font-medium text-slate-700">{u.username}</td>
                  <td className="px-6 py-4 text-slate-600">{u.email}</td>
                  <td className="px-6 py-4"><Badge variant={u.role === 'Donor' ? 'warning' : 'info'}>{u.role}</Badge></td>
                  <td className="px-6 py-4">
                    <Badge variant={u.status === 'active' ? 'success' : 'danger'}>{u.status}</Badge>
                  </td>
                  <td className="px-6 py-4">
                    <Button
                      size="sm"
                      variant={u.status === 'active' ? 'danger' : 'primary'}
                      onClick={() => toggleStatus(u.id)}
                    >
                      {u.status === 'active' ? <><UserX size={14} /> Deactivate</> : <><UserCheck size={14} /> Reactivate</>}
                    </Button>
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
