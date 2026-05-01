import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { trackCVDownload } from '../lib/api'
import Button from '../components/ui/Button'

export default function CVPage() {
  useEffect(() => {
    trackCVDownload()
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-surface">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-md w-full text-center"
      >
        {/* Icon */}
        <div className="w-16 h-16 mx-auto mb-8 bg-zinc-900 border border-zinc-800 rounded-sm flex items-center justify-center">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="2" width="16" height="22" rx="2" stroke="#3f3f46" strokeWidth="1.4" />
            <path d="M8 8h8M8 12h8M8 16h5" stroke="#3f3f46" strokeWidth="1.4" strokeLinecap="round" />
            <path d="M21 18v7M18 22l3 3 3-3" stroke="#71717a" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <div className="mb-2">
          <span className="text-xs font-mono text-zinc-600 uppercase tracking-widest">// CV</span>
        </div>

        <h1 className="text-3xl font-semibold text-white tracking-tight mb-4">
          CV Placeholder
        </h1>

        <p className="text-zinc-500 text-sm leading-relaxed mb-8">
          A public PDF is not published in this local Phase 1 build yet. This page acts as a clean placeholder until a reviewed CV file is ready to upload.
        </p>

        <div className="bg-[#111111] border border-zinc-800 rounded-sm p-5 text-left mb-4">
          <p className="text-xs font-mono text-zinc-600 uppercase tracking-widest mb-4">What Will Be Added</p>
          <ul className="flex flex-col gap-2.5">
            {[
              'Cybersecurity Graduate',
              'Security operations and SIEM project work',
              'Full-stack React & Node.js',
              'Labs, coursework, and selected projects',
              'Role interests and contact details',
            ].map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm text-zinc-400">
                <span className="w-1 h-1 rounded-full bg-zinc-600 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-[#111111] border border-zinc-800 rounded-sm p-5 text-left mb-8">
          <p className="text-xs font-mono text-zinc-600 uppercase tracking-widest mb-2">Current Status</p>
          <p className="text-zinc-500 text-sm leading-relaxed">
            No PDF is bundled with this repository. Use the contact page during manual review if you want to simulate a CV request flow.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/contact">
            <Button variant="primary" size="md">
              Go to Contact Form
            </Button>
          </Link>
          <Link to="/">
            <Button variant="ghost" size="md">
              Back to Home
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
