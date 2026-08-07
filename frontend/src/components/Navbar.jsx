import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Leaf, Menu, X, Bell, LogOut, User } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { Avatar, Badge, Button } from './reusable'
import { mockNotifications } from '../data/mockData'

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const unreadCount = mockNotifications.filter((n) => !n.read).length

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const navLinkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors ${isActive ? 'text-aff-green-600' : 'text-slate-600 hover:text-aff-green-600'}`

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="rounded-lg bg-aff-green-600 p-1.5 text-white">
            <Leaf size={20} />
          </div>
          <div>
            <span className="text-lg font-bold text-aff-green-800">AFF</span>
            <span className="hidden text-xs text-slate-500 sm:inline"> · Affordable Food Federation</span>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <NavLink to="/" className={navLinkClass} end>Home</NavLink>
          {!isAuthenticated && (
            <>
              <NavLink to="/register/recipient" className={navLinkClass}>Register as Recipient</NavLink>
              <NavLink to="/register/donor" className={navLinkClass}>Register as Donor</NavLink>
            </>
          )}
          {isAuthenticated && user?.role === 'recipient' && (
            <>
              <NavLink to="/recipient/browse" className={navLinkClass}>Browse Food</NavLink>
              <NavLink to="/recipient/history" className={navLinkClass}>My Collections</NavLink>
              <NavLink to="/premium" className={navLinkClass}>Premium</NavLink>
            </>
          )}
          {isAuthenticated && user?.role === 'donor' && (
            <>
              <NavLink to="/donor/dashboard" className={navLinkClass}>Dashboard</NavLink>
              <NavLink to="/donor/listings" className={navLinkClass}>My Listings</NavLink>
            </>
          )}
          {isAuthenticated && user?.role === 'admin' && (
            <>
              <NavLink to="/admin/users" className={navLinkClass}>Users</NavLink>
              <NavLink to="/admin/listings" className={navLinkClass}>Listings</NavLink>
            </>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <button className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100">
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                    {unreadCount}
                  </span>
                )}
              </button>
              <Link to="/profile" className="hidden items-center gap-2 sm:flex">
                <Avatar name={user.username || user.companyName} size="sm" />
                <div className="text-left">
                  <p className="text-sm font-medium text-slate-700">{user.username || user.companyName}</p>
                  {user.isPremium && <Badge variant="premium">Premium</Badge>}
                </div>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut size={16} />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </>
          ) : (
            <Link to="/login">
              <Button size="sm">Login</Button>
            </Link>
          )}
          <button
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-3">
            <NavLink to="/" className={navLinkClass} onClick={() => setMobileOpen(false)} end>Home</NavLink>
            {!isAuthenticated ? (
              <>
                <NavLink to="/login" className={navLinkClass} onClick={() => setMobileOpen(false)}>Login</NavLink>
                <NavLink to="/register/recipient" className={navLinkClass} onClick={() => setMobileOpen(false)}>Register Recipient</NavLink>
                <NavLink to="/register/donor" className={navLinkClass} onClick={() => setMobileOpen(false)}>Register Donor</NavLink>
              </>
            ) : (
              <>
                <Link to="/profile" className="flex items-center gap-2 text-sm text-slate-600" onClick={() => setMobileOpen(false)}>
                  <User size={16} /> Profile
                </Link>
                <button onClick={() => { handleLogout(); setMobileOpen(false) }} className="text-left text-sm text-red-600">
                  Logout
                </button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
