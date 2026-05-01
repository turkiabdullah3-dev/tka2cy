import React from 'react'
import { motion } from 'framer-motion'
import SectionTitle from '../ui/SectionTitle'
import Divider from '../ui/Divider'

const skillColumns = [
  {
    title: 'Security',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 1L2 4v4c0 3.3 2.5 6.4 6 7 3.5-.6 6-3.7 6-7V4L8 1z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
        <path d="M5.5 8l2 2 3-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    skills: [
      'SIEM Project Development',
      'Detection Logic Practice',
      'Log Analysis & Correlation',
      'Incident Response Fundamentals',
      'Security Monitoring',
      'Vulnerability Assessment Labs',
      'OWASP Top 10',
      'Network Security',
      'Threat Intelligence Basics',
    ],
  },
  {
    title: 'Development',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 5L1 8l3 3M12 5l3 3-3 3M9.5 3l-3 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    skills: [
      'React & React Router',
      'Node.js & Express',
      'PostgreSQL',
      'Python',
      'REST API Design',
      'Vite & modern tooling',
      'Tailwind CSS',
      'Git & Version Control',
      'Docker (basics)',
    ],
  },
  {
    title: 'Tools & Platforms',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="1" y="3" width="14" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
        <path d="M4 7h8M4 10h5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
    skills: [
      'Linux (Ubuntu, Kali)',
      'Wireshark & tcpdump',
      'Burp Suite',
      'Elastic Stack (ELK)',
      'Nmap & Nessus',
      'MITRE ATT&CK Framework',
      'VS Code & JetBrains',
      'Postman',
      'GitHub Actions',
    ],
  },
]

const studying = [
  'OSCP preparation and lab practice',
  'Cloud security fundamentals',
  'Threat hunting methodology',
  'Malware analysis fundamentals',
]

export default function Skills() {
  return (
    <section className="py-24 px-6 bg-surface">
      <div className="max-w-6xl mx-auto">
        <SectionTitle
          eyebrow="// Capabilities"
          title="Skills & Experience"
          subtitle="Practical skills developed through coursework, labs, and personal projects."
        />

        {/* Skills grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {skillColumns.map((col, colIndex) => (
            <motion.div
              key={col.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, delay: colIndex * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="bg-[#111111] border border-zinc-800 rounded-sm p-6"
            >
              {/* Column header */}
              <div className="flex items-center gap-2 mb-5 pb-4 border-b border-zinc-800">
                <span className="text-zinc-500">{col.icon}</span>
                <h3 className="text-white font-medium text-sm">{col.title}</h3>
              </div>

              {/* Skill list */}
              <ul className="flex flex-col gap-2.5">
                {col.skills.map((skill) => (
                  <li key={skill} className="flex items-center gap-2 text-sm text-zinc-400">
                    <span className="w-1 h-1 rounded-full bg-zinc-600 flex-shrink-0" />
                    {skill}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Currently studying */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="border border-zinc-800 rounded-sm p-6 bg-[#111111]"
        >
          <div className="flex items-center gap-2 mb-5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
            </span>
            <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest">Currently Studying</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {studying.map((item, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-zinc-400">
                <span className="w-1 h-1 rounded-full bg-blue-500 flex-shrink-0 mt-2" />
                {item}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
