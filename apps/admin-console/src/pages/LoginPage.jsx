import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../hooks/useAuth'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/security/dashboard', { replace: true })
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Authentication failed. Check your credentials.'
      )
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    backgroundColor: '#0d0e12',
    border: '1px solid #1e2028',
    color: '#e4e4e7',
    outline: 'none',
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ backgroundColor: '#070709' }}
    >
      {/* Background grid texture */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(#1e2028 1px, transparent 1px), linear-gradient(90deg, #1e2028 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          opacity: 0.15,
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative w-full max-w-sm"
      >
        <div
          className="rounded-xl p-8"
          style={{
            backgroundColor: '#0d0e12',
            border: '1px solid #1e2028',
            boxShadow: '0 0 40px rgba(0,0,0,0.6)',
          }}
        >
          {/* Header */}
          <div className="flex flex-col items-center mb-8">
            <div
              className="flex items-center justify-center rounded-lg font-mono font-semibold text-lg mb-4"
              style={{
                width: '48px',
                height: '48px',
                backgroundColor: '#141519',
                border: '1px solid #1e2028',
                color: '#a1a1aa',
              }}
            >
              TA
            </div>
            <h1 className="text-lg font-semibold text-zinc-100 mb-1">Command Center</h1>
            <span
              className="text-xs font-mono px-2 py-0.5 rounded uppercase tracking-widest"
              style={{ backgroundColor: '#450a0a', color: '#f87171', border: '1px solid #7f1d1d' }}
            >
              Restricted Access
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-zinc-500 uppercase tracking-widest mb-2">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@turkiplatform.com"
                className="w-full rounded px-3 py-2.5 text-sm font-mono transition-colors duration-100"
                style={inputStyle}
                onFocus={(e) => { e.target.style.borderColor = '#3f3f46' }}
                onBlur={(e) => { e.target.style.borderColor = '#1e2028' }}
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-500 uppercase tracking-widest mb-2">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded px-3 py-2.5 text-sm font-mono transition-colors duration-100"
                style={inputStyle}
                onFocus={(e) => { e.target.style.borderColor = '#3f3f46' }}
                onBlur={(e) => { e.target.style.borderColor = '#1e2028' }}
                autoComplete="current-password"
              />
            </div>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs font-mono text-red-400 rounded px-3 py-2"
                style={{ backgroundColor: '#1c0a0a', border: '1px solid #450a0a' }}
              >
                {error}
              </motion.div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded py-2.5 text-sm font-medium transition-colors duration-150 mt-2"
              style={{
                backgroundColor: loading ? '#312e81' : '#4f46e5',
                color: '#e0e7ff',
                cursor: loading ? 'not-allowed' : 'pointer',
                border: '1px solid #4338ca',
              }}
            >
              {loading ? (
                <>
                  <span
                    className="inline-block rounded-full"
                    style={{
                      width: '14px',
                      height: '14px',
                      borderWidth: '2px',
                      borderStyle: 'solid',
                      borderColor: 'rgba(224,231,255,0.3)',
                      borderTopColor: '#e0e7ff',
                      animation: 'spin 0.7s linear infinite',
                    }}
                  />
                  Authenticating...
                </>
              ) : (
                'Authenticate'
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-xs font-mono text-zinc-700 mt-6">
          Unauthorized access is monitored and logged.
        </p>
      </motion.div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
