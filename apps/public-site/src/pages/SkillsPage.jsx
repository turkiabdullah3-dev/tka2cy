import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import SectionTitle from '../components/ui/SectionTitle'
import Divider from '../components/ui/Divider'
import { trackEvent } from '../lib/api'

const skillSections = [
  {
    category: 'Security',
    color: 'text-red-400',
    dotColor: 'bg-red-500',
    groups: [
      {
        title: 'Security Operations',
        skills: [
          { name: 'SIEM Development (practical)', level: 65 },
          { name: 'Log Analysis & Correlation', level: 62 },
          { name: 'Security Monitoring Concepts', level: 65 },
          { name: 'Threat Detection (learning)', level: 55 },
          { name: 'Incident Response (academic)', level: 50 },
        ],
      },
      {
        title: 'Offensive / Research',
        skills: [
          { name: 'OWASP Top 10 (familiar)', level: 62 },
          { name: 'Network Security Fundamentals', level: 58 },
          { name: 'Vulnerability Assessment (labs)', level: 52 },
          { name: 'Burp Suite (learning)', level: 48 },
          { name: 'Threat Intelligence (foundational)', level: 45 },
        ],
      },
    ],
  },
  {
    category: 'Development',
    color: 'text-blue-400',
    dotColor: 'bg-blue-500',
    groups: [
      {
        title: 'Frontend',
        skills: [
          { name: 'HTML / CSS / JavaScript', level: 78 },
          { name: 'React & React Router', level: 75 },
          { name: 'Tailwind CSS', level: 72 },
          { name: 'Vite & modern tooling', level: 65 },
          { name: 'Framer Motion', level: 58 },
        ],
      },
      {
        title: 'Backend & Data',
        skills: [
          { name: 'Node.js & Express', level: 68 },
          { name: 'REST API Design', level: 65 },
          { name: 'PostgreSQL', label: 'practical', level: 60 },
          { name: 'Python (scripting)', level: 55 },
          { name: 'Docker (basics)', level: 40 },
        ],
      },
    ],
  },
  {
    category: 'Tools & Platforms',
    color: 'text-zinc-400',
    dotColor: 'bg-zinc-500',
    groups: [
      {
        title: 'Security Tools',
        skills: [
          { name: 'Linux (Ubuntu, Kali)', level: 65 },
          { name: 'MITRE ATT&CK (learning)', level: 58 },
          { name: 'Wireshark & tcpdump (labs)', level: 55 },
          { name: 'Nmap (familiar)', level: 52 },
          { name: 'Elastic Stack (introductory)', level: 45 },
        ],
      },
      {
        title: 'Developer Tools',
        skills: [
          { name: 'Git & Version Control', level: 75 },
          { name: 'VS Code', level: 80 },
          { name: 'Postman & API testing', level: 68 },
          { name: 'Linux CLI', level: 65 },
          { name: 'GitHub Actions (learning)', level: 42 },
        ],
      },
    ],
  },
]

const studying = [
  {
    title: 'OSCP Preparation',
    desc: 'Practice in lab-based exploitation, privilege escalation, and note-taking workflows.',
    icon: '🛡',
  },
  {
    title: 'Cloud Security (AWS)',
    desc: 'Foundational AWS security topics including IAM, monitoring, and cloud-native controls.',
    icon: '☁',
  },
  {
    title: 'Threat Hunting Practice',
    desc: 'Hypothesis-driven hunting, ATT&CK mapping, and behavioral review in lab scenarios.',
    icon: '🔍',
  },
  {
    title: 'Malware Analysis',
    desc: 'Introductory static and dynamic analysis practice in isolated lab environments.',
    icon: '⚗',
  },
]

function SkillBar({ name, level, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay }}
      className="mb-3"
    >
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-sm text-zinc-400">{name}</span>
        <span className="text-xs font-mono text-zinc-600">{level}%</span>
      </div>
      <div className="h-px bg-zinc-800 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${level}%` }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.8, delay: delay + 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="h-full bg-zinc-600 rounded-full"
        />
      </div>
    </motion.div>
  )
}

export default function SkillsPage() {
  useEffect(() => {
    trackEvent('page_view')
  }, [])

  return (
    <div className="min-h-screen pt-24 pb-24 px-6 bg-surface">
      <div className="max-w-6xl mx-auto">
        <SectionTitle
          eyebrow="// Capabilities"
          title="Skills & Experience"
          subtitle="Practical competencies built through academic coursework, personal projects, and hands-on labs. Bars reflect honest self-assessment — actively growing in all areas."
        />

        {/* Skill sections */}
        <div className="flex flex-col gap-16">
          {skillSections.map((section, si) => (
            <motion.div
              key={section.category}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, delay: si * 0.1 }}
            >
              {/* Category header */}
              <div className="flex items-center gap-3 mb-8">
                <span className={`w-2 h-2 rounded-full ${section.dotColor}`} />
                <h2 className={`text-sm font-mono uppercase tracking-widest ${section.color}`}>
                  {section.category}
                </h2>
                <div className="flex-1 h-px bg-zinc-800" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {section.groups.map((group, gi) => (
                  <div key={group.title}>
                    <h3 className="text-white font-medium text-sm mb-5">{group.title}</h3>
                    {group.skills.map((skill, ski) => (
                      <SkillBar
                        key={skill.name}
                        name={skill.name}
                        level={skill.level}
                        delay={gi * 0.1 + ski * 0.04}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <Divider className="my-16" />

        {/* Currently studying */}
        <div>
          <div className="flex items-center gap-2 mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
            </span>
            <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest">Currently Studying</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {studying.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="bg-[#111111] border border-zinc-800 rounded-sm p-5"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-lg" aria-hidden="true">{item.icon}</span>
                  <h3 className="text-white font-medium text-sm">{item.title}</h3>
                </div>
                <p className="text-zinc-500 text-xs leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
