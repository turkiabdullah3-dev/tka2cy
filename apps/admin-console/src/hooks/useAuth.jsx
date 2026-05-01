import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import * as authLib from '../lib/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    authLib.getMe()
      .then((res) => setUser(res.data.user ?? null))
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [])

  const login = useCallback(async (email, password) => {
    const res = await authLib.login(email, password)
    const nextUser = res.data.user ?? null
    setUser(nextUser)
    return nextUser
  }, [])

  const logout = useCallback(async () => {
    try {
      await authLib.logout()
    } catch (_) {
      // swallow errors on logout
    }
    setUser(null)
    window.location.href = '/security/login'
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
