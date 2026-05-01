import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'

export default function SectionTitle({ eyebrow, title, subtitle, className, align = 'left' }) {
  const alignClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }[align]

  return (
    <div className={cn('mb-12', alignClass, className)}>
      {eyebrow && (
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-3"
        >
          {eyebrow}
        </motion.p>
      )}
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.5, delay: 0.08 }}
        className="text-3xl md:text-4xl font-semibold text-white tracking-tight"
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, delay: 0.16 }}
          className="mt-4 text-zinc-400 text-base max-w-2xl leading-relaxed"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  )
}
