import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Button from '../ui/Button'

export default function ContactSection() {
  return (
    <section className="py-24 px-6 bg-[#0d0d0d]">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="border border-zinc-800 rounded-sm p-10 md:p-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 bg-[#111111]"
        >
          <div>
            <p className="text-xs font-mono text-zinc-600 uppercase tracking-widest mb-3">
              // Get in touch
            </p>
            <h2 className="text-3xl md:text-4xl font-semibold text-white tracking-tight mb-4">
              Let's work together.
            </h2>
            <p className="text-zinc-500 text-base max-w-md leading-relaxed">
              I'm open to graduate and entry-level cybersecurity roles, security operations positions, and relevant project conversations.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
            <Link to="/contact">
              <Button variant="primary" size="lg">
                Get in Touch
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 7h12M7.5 1.5L13 7l-5.5 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Button>
            </Link>
            <Link to="/cv">
              <Button variant="ghost" size="lg">
                View CV
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
