import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import SectionTitle from '../ui/SectionTitle'
import Badge from '../ui/Badge'
import { getProjects } from '../../lib/api'

const STATIC_PROJECTS = [
  {
    id: 1,
    number: '01',
    title: 'Personal SIEM Dashboard',
    description:
      'A personal monitoring project for tracking events, reviewing severity, and practicing alerting workflows.',
    tags: ['Node.js', 'PostgreSQL', 'React', 'Security'],
    status: 'Active',
  },
  {
    id: 2,
    number: '02',
    title: 'AI Job Intelligence Dashboard',
    description:
      'A career research tool that collects job posts and experiments with simple matching and summary workflows.',
    tags: ['AI', 'React', 'Python'],
    status: 'In Development',
  },
  {
    id: 3,
    number: '03',
    title: 'MoE Performance Dashboard',
    description:
      'A dashboard concept for education data visualization and reporting practice.',
    tags: ['React', 'Data Viz', 'Analytics'],
    status: 'Concept',
  },
  {
    id: 4,
    number: '04',
    title: 'Security Analyst Console',
    description:
      'A concept for organizing investigation notes, event review, and analyst workflow practice.',
    tags: ['Security', 'React', 'Node.js'],
    status: 'Concept',
  },
  {
    id: 5,
    number: '05',
    title: 'Turki Map',
    description:
      'An interactive mapping project exploring data overlays and simple geospatial views.',
    tags: ['Maps', 'JavaScript', 'APIs'],
    status: 'In Development',
  },
]

const statusVariant = {
  Active: 'active',
  'In Development': 'development',
  Concept: 'concept',
}

function ProjectCard({ project, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ borderColor: 'rgba(161,161,170,0.3)', y: -2 }}
      className="group bg-[#111111] border border-zinc-800 rounded-sm p-6 flex flex-col gap-4 transition-all duration-200"
    >
      {/* Top row: number + status */}
      <div className="flex items-center justify-between">
        <span className="text-zinc-600 text-xs font-mono">{project.number}</span>
        <Badge variant={statusVariant[project.status] || 'default'}>{project.status}</Badge>
      </div>

      {/* Title */}
      <h3 className="text-white font-semibold text-lg leading-snug group-hover:text-zinc-100 transition-colors duration-200">
        {project.title}
      </h3>

      {/* Description */}
      <p className="text-zinc-500 text-sm leading-relaxed flex-1">{project.description}</p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5">
        {project.tags.map((tag) => (
          <Badge key={tag} variant="default">{tag}</Badge>
        ))}
      </div>

      {/* Footer link */}
      <div className="pt-2 border-t border-zinc-800">
        <span className="text-xs font-mono text-zinc-700">Coming Soon —</span>
        <span className="text-xs font-mono text-zinc-600 ml-1">Details not yet published</span>
      </div>
    </motion.div>
  )
}

export default function Projects({ limit }) {
  const [projects, setProjects] = useState(STATIC_PROJECTS)

  useEffect(() => {
    getProjects()
      .then((res) => {
        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          setProjects(res.data)
        }
      })
      .catch(() => {
        // Keep static data on API failure
      })
  }, [])

  const displayProjects = limit ? projects.slice(0, limit) : projects

  return (
    <section className="py-24 px-6 bg-surface">
      <div className="max-w-6xl mx-auto">
        <SectionTitle
          eyebrow="// Selected Work"
          title="Projects"
          subtitle="A selection of personal projects, prototypes, and learning-focused builds."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayProjects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
