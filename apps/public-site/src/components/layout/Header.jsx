import React, { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Projects', to: '/projects' },
  { label: 'Cyber Labs', to: '/cyber-labs' },
  { label: 'Skills', to: '/skills' },
  { label: 'Contact', to: '/contact' },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <>
      <header
        className={[
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled
            ? 'bg-[#0a0a0a]/90 backdrop-blur-sm border-b border-zinc-900'
            : 'bg-transparent',
        ].join(' ')}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 bg-zinc-800 border border-zinc-700 flex items-center justify-center rounded-sm group-hover:bg-zinc-700 transition-colors duration-200">
              <span className="text-white text-xs font-bold tracking-wider font-mono">TA</span>
            </div>
            <span className="text-zinc-300 text-sm font-medium tracking-wide group-hover:text-white transition-colors duration-200">
              Turki Abdullah
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  [
                    'px-4 py-2 text-sm rounded-sm transition-colors duration-200',
                    isActive
                      ? 'text-white'
                      : 'text-zinc-500 hover:text-white',
                  ].join(' ')
                }
              >
                {link.label}
              </NavLink>
            ))}
            <Link
              to="/cv"
              className="ml-2 px-4 py-1.5 text-sm border border-zinc-700 text-zinc-300 rounded-sm hover:border-zinc-500 hover:text-white transition-all duration-200"
            >
              CV
            </Link>
          </nav>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5 group"
            aria-label="Toggle navigation menu"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span
              className={[
                'block w-5 h-px bg-zinc-400 transition-all duration-300 origin-center',
                menuOpen ? 'rotate-45 translate-y-[3.5px]' : '',
              ].join(' ')}
            />
            <span
              className={[
                'block w-5 h-px bg-zinc-400 transition-all duration-300',
                menuOpen ? 'opacity-0 scale-x-0' : '',
              ].join(' ')}
            />
            <span
              className={[
                'block w-5 h-px bg-zinc-400 transition-all duration-300 origin-center',
                menuOpen ? '-rotate-45 -translate-y-[3.5px]' : '',
              ].join(' ')}
            />
          </button>
        </div>
      </header>

      {/* Mobile full-screen nav */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-[#0a0a0a] flex flex-col md:hidden"
          >
            <div className="h-16" /> {/* spacer for header */}
            <nav className="flex flex-col items-center justify-center flex-1 gap-2 px-8">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.to}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.25, delay: i * 0.06 }}
                  className="w-full"
                >
                  <NavLink
                    to={link.to}
                    end={link.to === '/'}
                    className={({ isActive }) =>
                      [
                        'block w-full text-center py-4 text-2xl font-medium tracking-tight transition-colors duration-200',
                        isActive ? 'text-white' : 'text-zinc-500 hover:text-white',
                      ].join(' ')
                    }
                  >
                    {link.label}
                  </NavLink>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.25, delay: navLinks.length * 0.06 }}
              >
                <Link
                  to="/cv"
                  className="block text-center py-4 text-2xl font-medium text-zinc-500 hover:text-white transition-colors duration-200"
                >
                  CV
                </Link>
              </motion.div>
            </nav>
            <div className="pb-12 text-center text-zinc-700 text-xs font-mono">
              Contact form available below
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
