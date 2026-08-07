import { createContext, useContext, useState, useCallback } from 'react'
import { findDemoUser } from '../data/mockData'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('aff_user')
    return stored ? JSON.parse(stored) : null
  })

  const login = useCallback(async (email, password) => {
    const found = findDemoUser(email)
    if (!found) {
      throw new Error('Invalid email or password. Use demo accounts shown below.')
    }
    const token = `demo-token-${found.id}`
    localStorage.setItem('aff_token', token)
    localStorage.setItem('aff_user', JSON.stringify(found))
    setUser(found)
    return found
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('aff_token')
    localStorage.removeItem('aff_user')
    setUser(null)
  }, [])

  const updateUser = useCallback((updates) => {
    setUser((prev) => {
      const updated = { ...prev, ...updates }
      localStorage.setItem('aff_user', JSON.stringify(updated))
      return updated
    })
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
