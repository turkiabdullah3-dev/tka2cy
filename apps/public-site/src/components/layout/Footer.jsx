import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import Divider from '../ui/Divider'

const navLinks = [
  { label: 'Projects', to: '/projects' },
  { label: 'Cyber Labs', to: '/cyber-labs' },
  { label: 'Skills', to: '/skills' },
  { label: 'Contact', to: '/contact' },
  { label: 'CV', to: '/cv' },
]

export default function Footer() {
  return (
    <footer className="bg-[#111111] border-t border-zinc-800">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Main footer grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* Left: Identity */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 bg-zinc-800 border border-zinc-700 flex items-center justify-center rounded-sm">
                <span className="text-white text-xs font-bold font-mono">TA</span>
              </div>
              <span className="text-white font-medium text-sm">Turki Abdullah</span>
            </div>
            <p className="text-zinc-500 text-sm leading-relaxed">
              Cybersecurity graduate building practical security and full-stack projects
            </p>
          </div>

          {/* Center: Navigation */}
          <div className="flex flex-col gap-2">
            <p className="text-zinc-600 text-xs uppercase tracking-widest font-mono mb-1">Navigation</p>
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  [
                    'text-sm transition-colors duration-200 w-fit',
                    isActive ? 'text-zinc-300' : 'text-zinc-500 hover:text-zinc-300',
                  ].join(' ')
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Right: Status */}
          <div>
            <p className="text-zinc-600 text-xs uppercase tracking-widest font-mono mb-3">Status</p>
            <div className="flex items-center gap-2 mb-3">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-sm text-zinc-300">Currently open to opportunities</span>
            </div>
            <p className="text-zinc-600 text-xs leading-relaxed">
              Open to entry-level and graduate opportunities in cybersecurity, security operations, and related roles.
            </p>
          </div>
        </div>

        <Divider />

        {/* Bottom bar */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-zinc-600 text-xs">
            &copy; {new Date().getFullYear()} Turki Abdullah. Built with purpose.
          </p>
          <div className="flex items-center gap-4">
            <Link
              to="/contact"
              className="text-zinc-700 text-xs hover:text-zinc-500 transition-colors duration-200"
            >
              Contact
            </Link>
            <a
              href="/security/login"
              className="text-zinc-800 text-xs hover:text-zinc-600 transition-colors duration-200"
            >
              Admin
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
