import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import SectionTitle from '../components/ui/SectionTitle'
import Badge from '../components/ui/Badge'
import { trackEvent, getCyberLabs } from '../lib/api'

const STATIC_LABS = [
  {
    id: 1,
    name: 'Failed Login Detection',
    description:
      'Practice detecting repeated failed logins and simple brute-force patterns across authentication endpoints.',
    longDescription:
      'This lab focuses on identifying repeated failed authentication attempts from a single source or across several accounts. The goal is to practice threshold tuning, review noisy patterns, and understand how simple detections behave in a small environment.',
    severity: 'critical',
    status: 'Active',
    techniques: ['Threshold-based alerting', 'IP velocity analysis', 'Account lockout correlation'],
  },
  {
    id: 2,
    name: 'Sensitive Path Scanning',
    description:
      'Track reconnaissance-style requests against admin and config endpoints in a controlled project environment.',
    longDescription:
      'This lab monitors requests that match known sensitive paths and common scan patterns. It is intended to practice visibility into reconnaissance behavior and document how the application responds.',
    severity: 'high',
    status: 'Active',
    techniques: ['Path pattern matching', '404 rate monitoring', 'User-agent anomaly detection'],
  },
  {
    id: 3,
    name: 'Rate-Limit Alerts',
    description:
      'Review rate-limit events to study automation patterns and basic abuse detection.',
    longDescription:
      'This lab reviews 429 responses across endpoints to understand how repeated requests appear in logs. It is used for learning request-velocity patterns and simple abuse detection, not for production-scale traffic analysis.',
    severity: 'medium',
    status: 'Active',
    techniques: ['Event aggregation', 'Velocity analysis', 'IP reputation correlation'],
  },
  {
    id: 4,
    name: 'Suspicious IP Analysis',
    description:
      'Compare IP activity with simple reputation signals and request behavior for classification practice.',
    longDescription:
      'IPs interacting with the platform are compared with basic reputation sources such as VPN exits, Tor nodes, datacenter ranges, and previously flagged addresses. The purpose is to practice enrichment workflows on a small personal dataset.',
    severity: 'high',
    status: 'Research',
    techniques: ['Threat intel integration', 'Geolocation analysis', 'Behavioral scoring'],
  },
  {
    id: 5,
    name: 'Security Headers Review',
    description:
      'Review HTTP security headers against common OWASP recommendations.',
    longDescription:
      'This review checks for missing or misconfigured headers such as Content-Security-Policy, X-Frame-Options, HSTS, X-Content-Type-Options, and Referrer-Policy. It is meant to support secure defaults in this project and reinforce best practices.',
    severity: 'low',
    status: 'Active',
    techniques: ['Header enumeration', 'OWASP benchmarking', 'Configuration drift detection'],
  },
  {
    id: 6,
    name: 'CSP Violation Logging',
    description:
      'Capture and review Content Security Policy violations to study injection-related signals.',
    longDescription:
      'CSP violation reports are reviewed for patterns that may indicate XSS attempts, injected scripts, or misconfigured trusted sources. In this project, the lab is mainly a learning tool for understanding browser-side security signals.',
    severity: 'medium',
    status: 'Active',
    techniques: ['CSP report ingestion', 'Violation pattern analysis', 'XSS signal correlation'],
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

function LabCard({ lab, index }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      className="bg-[#111111] border border-zinc-800 rounded-sm overflow-hidden transition-all duration-200 hover:border-zinc-700"
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${severityDot[lab.severity]}`} />
            <span className="text-xs font-mono text-zinc-600 tracking-widest">
              {severityLabel[lab.severity]}
            </span>
          </div>
          <Badge variant={lab.status === 'Active' ? 'active' : 'research'}>{lab.status}</Badge>
        </div>

        <h3 className="text-white font-semibold text-base mb-3">{lab.name}</h3>
        <p className="text-zinc-500 text-sm leading-relaxed mb-4">{lab.description}</p>

        {/* Expand button */}
        <button
          onClick={() => setExpanded((v) => !v)}
          className="text-xs font-mono text-zinc-600 hover:text-zinc-400 transition-colors duration-200 flex items-center gap-1"
        >
          {expanded ? 'Show less ↑' : 'Read more ↓'}
        </button>
      </div>

      {/* Expanded content */}
      {expanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
          className="border-t border-zinc-800 px-6 pb-6 pt-5"
        >
          <p className="text-zinc-500 text-sm leading-relaxed mb-5">{lab.longDescription}</p>
          <div>
            <p className="text-xs font-mono text-zinc-600 uppercase tracking-widest mb-3">
              Techniques
            </p>
            <ul className="flex flex-col gap-1.5">
              {lab.techniques.map((t) => (
                <li key={t} className="flex items-center gap-2 text-sm text-zinc-400">
                  <span className="w-1 h-1 rounded-full bg-zinc-600 flex-shrink-0" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

export default function CyberLabsPage() {
  const [labs, setLabs] = useState(STATIC_LABS)

  useEffect(() => {
    trackEvent('page_view')
    getCyberLabs()
      .then((res) => {
        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          setLabs(res.data)
        }
      })
      .catch(() => {})
  }, [])

  return (
    <div className="min-h-screen pt-24 pb-24 px-6 bg-surface">
      <div className="max-w-6xl mx-auto">
        <SectionTitle
          eyebrow="// Research"
          title="Cyber Labs"
          subtitle="Hands-on lab exercises for security monitoring, detection practice, and research. Click any card to expand details."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {labs.map((lab, i) => (
            <LabCard key={lab.id} lab={lab} index={i} />
          ))}
        </div>

        {/* MITRE note */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-12 p-5 border border-zinc-800 rounded-sm bg-[#111111] flex items-start gap-3"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0 mt-0.5 text-zinc-600">
            <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.2" />
            <path d="M8 7v4M8 5.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <p className="text-zinc-600 text-xs leading-relaxed">
            Detection rules in these labs are mapped to the{' '}
            <span className="text-zinc-400">MITRE ATT&amp;CK</span> framework where applicable.
            All exercises are reviewed in isolated environments on personally owned infrastructure.
          </p>
        </motion.div>
      </div>
    </div>
  )
}
