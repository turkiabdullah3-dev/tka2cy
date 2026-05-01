import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Button from '../ui/Button'
import { trackCVDownload } from '../../lib/api'

const titles = [
  'Cybersecurity Graduate',
  'Security Operations Learner',
  'SIEM Project Builder',
  'Detection Engineering Student',
]

const GRID_LINES = 12

export default function Hero() {
  const [titleIndex, setTitleIndex] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setTitleIndex((i) => (i + 1) % titles.length)
        setVisible(true)
      }, 400)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const handleCVClick = () => {
    trackCVDownload()
    window.open('/cv', '_self')
  }

  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.12 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
  }

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-surface">
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Radial gradient fade center */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% 50%, rgba(255,255,255,0.03) 0%, transparent 70%)',
        }}
      />

      {/* Content */}
      <motion.div
        className="relative z-10 max-w-4xl mx-auto px-6 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Status badge */}
        <motion.div variants={itemVariants} className="mb-8 flex justify-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-zinc-900 border border-zinc-800 rounded-full text-xs text-zinc-400 font-mono">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
            </span>
            Available for opportunities
          </div>
        </motion.div>

        {/* Main name */}
        <motion.h1
          variants={itemVariants}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white mb-6"
          style={{ letterSpacing: '-0.03em' }}
        >
          TURKI
          <br />
          <span className="text-gradient">ABDULLAH</span>
        </motion.h1>

        {/* Animated subtitle */}
        <motion.div variants={itemVariants} className="h-8 mb-6 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {visible && (
              <motion.p
                key={titleIndex}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
                className="text-base sm:text-lg font-mono text-zinc-400 tracking-wide"
              >
                {titles[titleIndex]}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Description */}
        <motion.p
          variants={itemVariants}
          className="text-zinc-500 text-base sm:text-lg max-w-xl mx-auto mb-10 leading-relaxed"
        >
          I build dashboards, security monitoring projects, and small AI-assisted tools while growing my practical experience in cybersecurity.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <Link to="/projects">
            <Button variant="primary" size="lg">
              View Projects
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 7h12M7.5 1.5L13 7l-5.5 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Button>
          </Link>
          <Button variant="outline" size="lg" onClick={handleCVClick}>
            Download CV
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 1v8M3 9l4 4 4-4M1 13h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Button>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
      >
        <span className="text-zinc-700 text-xs font-mono tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 3v10M3 9l5 5 5-5" stroke="#3f3f46" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  )
}
