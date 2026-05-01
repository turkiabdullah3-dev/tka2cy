import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import SectionTitle from '../ui/SectionTitle'
import Badge from '../ui/Badge'
import { getCyberLabs } from '../../lib/api'

const STATIC_LABS = [
  {
    id: 1,
    name: 'Failed Login Detection',
    description:
      'Practice detecting repeated failed logins and simple brute-force patterns across authentication endpoints.',
    severity: 'critical',
    status: 'Active',
  },
  {
    id: 2,
    name: 'Sensitive Path Scanning',
    description:
      'Track reconnaissance-style requests against admin and config endpoints in a controlled project environment.',
    severity: 'high',
    status: 'Active',
  },
  {
    id: 3,
    name: 'Rate-Limit Alerts',
    description:
      'Review rate-limit events to study automation patterns and basic abuse detection.',
    severity: 'medium',
    status: 'Active',
  },
  {
    id: 4,
    name: 'Suspicious IP Analysis',
    description:
      'Compare IP activity with simple reputation signals and request behavior for classification practice.',
    severity: 'high',
    status: 'Research',
  },
  {
    id: 5,
    name: 'Security Headers Review',
    description:
      'Review HTTP security headers against common OWASP recommendations.',
    severity: 'low',
    status: 'Active',
  },
  {
    id: 6,
    name: 'CSP Violation Logging',
    description:
      'Capture and review Content Security Policy violations to study injection-related signals.',
    severity: 'medium',
    status: 'Active',
  },
]

const severityDot = {
  critical: 'bg-red-500',
  high: 'bg-orange-500',
  medium: 'bg-yellow-500',
  low: 'bg-blue-400',
}

const severityLabel = {
  critical: 'CRITICAL',
  high: 'HIGH',
  medium: 'MEDIUM',
  low: 'LOW',
}

const severityBadge = {
  critical: 'danger',
  high: 'warning',
  medium: 'warning',
  low: 'info',
}

function LabCard({ lab, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -3 }}
      className="bg-zinc-900/60 border border-zinc-800 rounded-sm p-5 flex flex-col gap-3 transition-all duration-200 hover:border-zinc-700 hover:bg-zinc-900/80"
    >
      {/* Top: severity dot + label */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${severityDot[lab.severity]}`} />
          <span className="text-xs font-mono text-zinc-600 tracking-widest">
            {severityLabel[lab.severity]}
          </span>
        </div>
        <Badge variant={lab.status === 'Active' ? 'active' : 'research'}>
          {lab.status}
        </Badge>
      </div>

      {/* Lab name */}
      <h3 className="text-white font-medium text-sm leading-snug">{lab.name}</h3>

      {/* Description */}
      <p className="text-zinc-500 text-xs leading-relaxed flex-1">{lab.description}</p>
    </motion.div>
  )
}

export default function CyberLabs() {
  const [labs, setLabs] = useState(STATIC_LABS)

  useEffect(() => {
    getCyberLabs()
      .then((res) => {
        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          setLabs(res.data)
        }
      })
      .catch(() => {
        // Keep static data on API failure
      })
  }, [])

  return (
    <section className="py-24 px-6 bg-[#0d0d0d]">
      <div className="max-w-6xl mx-auto">
        <SectionTitle
          eyebrow="// Research"
          title="Cyber Labs"
          subtitle="Hands-on lab exercises for security monitoring, detection practice, and research."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {labs.map((lab, i) => (
            <LabCard key={lab.id} lab={lab} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
