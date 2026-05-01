import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import SectionTitle from '../components/ui/SectionTitle'
import Badge from '../components/ui/Badge'
import { trackEvent, getProjects } from '../lib/api'

const STATIC_PROJECTS = [
  {
    id: 1,
    number: '01',
    title: 'Personal SIEM Dashboard',
    description:
      'A personal SIEM-style project for event tracking, severity filtering, and alert review practice.',
    tags: ['Node.js', 'PostgreSQL', 'React', 'Security'],
    status: 'Active',
  },
  {
    id: 2,
    number: '02',
    title: 'AI Job Intelligence Dashboard',
    description:
      'A career research tool that aggregates job postings and experiments with simple requirement matching and summaries.',
    tags: ['AI', 'React', 'Python'],
    status: 'In Development',
  },
  {
    id: 3,
    number: '03',
    title: 'MoE Performance Dashboard',
    description:
      'An analytics dashboard concept for education data visualization and KPI tracking practice.',
    tags: ['React', 'Data Viz', 'Analytics'],
    status: 'Concept',
  },
  {
    id: 4,
    number: '04',
    title: 'Security Analyst Console',
    description:
      'A concept for investigation workflow, documentation, and structured event review.',
    tags: ['Security', 'React', 'Node.js'],
    status: 'Concept',
  },
  {
    id: 5,
    number: '05',
    title: 'Turki Map',
    description:
      'An interactive mapping project exploring real-time overlays, geofencing ideas, and map-based visualization.',
    tags: ['Maps', 'JavaScript', 'APIs'],
    status: 'In Development',
  },
]

const STATUS_FILTERS = ['All', 'Active', 'In Development', 'Concept']

const statusVariant = {
  Active: 'active',
  'In Development': 'development',
  Concept: 'concept',
}

function ProjectCard({ project, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -2 }}
      className="group bg-[#111111] border border-zinc-800 rounded-sm p-6 flex flex-col gap-4 transition-all duration-200 hover:border-zinc-700"
    >
      <div className="flex items-center justify-between">
        <span className="text-zinc-600 text-xs font-mono">{project.number}</span>
        <Badge variant={statusVariant[project.status] || 'default'}>{project.status}</Badge>
      </div>
      <h3 className="text-white font-semibold text-lg leading-snug">{project.title}</h3>
      <p className="text-zinc-500 text-sm leading-relaxed flex-1">{project.description}</p>
      <div className="flex flex-wrap gap-1.5">
        {project.tags.map((tag) => (
          <Badge key={tag} variant="default">{tag}</Badge>
        ))}
      </div>
      <div className="pt-2 border-t border-zinc-800">
        <span className="text-xs font-mono text-zinc-700">
          Details coming soon
        </span>
      </div>
    </motion.div>
  )
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState(STATIC_PROJECTS)
  const [filter, setFilter] = useState('All')

  useEffect(() => {
    trackEvent('page_view')
    getProjects()
      .then((res) => {
        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          setProjects(res.data)
        }
      })
      .catch(() => {})
  }, [])

  const filtered = filter === 'All' ? projects : projects.filter((p) => p.status === filter)

  return (
    <div className="min-h-screen pt-24 pb-24 px-6 bg-surface">
      <div className="max-w-6xl mx-auto">
        <SectionTitle
          eyebrow="// Selected Work"
          title="Projects"
          subtitle="Personal projects and prototypes built to practice security, data, and full-stack development."
        />

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2 mb-10">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={[
                'px-4 py-1.5 text-xs font-mono rounded-sm border transition-all duration-200',
                filter === f
                  ? 'border-zinc-500 text-white bg-zinc-800'
                  : 'border-zinc-800 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300',
              ].join(' ')}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-zinc-600 font-mono text-sm">
            No projects match the selected filter.
          </div>
        )}
      </div>
    </div>
  )
}
