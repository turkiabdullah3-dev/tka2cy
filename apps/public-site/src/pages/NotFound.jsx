import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Button from '../components/ui/Button'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-surface">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="text-center max-w-md"
      >
        {/* Large 404 */}
        <div className="relative mb-8">
          <p
            className="text-[120px] font-bold leading-none select-none"
            style={{
              background: 'linear-gradient(135deg, #242424 0%, #111111 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            404
          </p>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 border border-zinc-800 rounded-sm flex items-center justify-center bg-[#0a0a0a]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 9v4M12 17v.5" stroke="#3f3f46" strokeWidth="1.8" strokeLinecap="round" />
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="#3f3f46" strokeWidth="1.4" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>

        <h1 className="text-2xl font-semibold text-white mb-3 tracking-tight">Page not found</h1>
        <p className="text-zinc-500 text-sm mb-8 leading-relaxed">
          The page you're looking for doesn't exist or has been moved. Let's get you back on track.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/">
            <Button variant="primary" size="md">
              Back to Home
            </Button>
          </Link>
          <Link to="/contact">
            <Button variant="ghost" size="md">
              Contact
            </Button>
          </Link>
        </div>

        <p className="mt-8 text-xs font-mono text-zinc-800">
          ERR_ROUTE_NOT_FOUND :: 0x404
        </p>
      </motion.div>
    </div>
  )
}
