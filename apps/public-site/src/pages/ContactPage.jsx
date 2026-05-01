import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import SectionTitle from '../components/ui/SectionTitle'
import Button from '../components/ui/Button'
import { trackEvent, submitContact } from '../lib/api'

const socialLinks = [
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com/in/turki-abdullah',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="1" y="1" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.2" />
        <path d="M4 6.5v5M4 4.5v.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M7.5 11.5V9a1.5 1.5 0 013 0v2.5M7.5 6.5v5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: 'GitHub',
    href: 'https://github.com/turki-abdullah',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 1C4.13 1 1 4.13 1 8c0 3.09 2 5.71 4.79 6.64.35.06.48-.15.48-.34v-1.18c-1.95.42-2.36-.94-2.36-.94-.32-.81-.78-1.02-.78-1.02-.64-.44.05-.43.05-.43.7.05 1.07.72 1.07.72.62 1.07 1.64.76 2.04.58.06-.45.24-.76.44-.93-1.56-.18-3.2-.78-3.2-3.47 0-.77.27-1.39.72-1.88-.07-.18-.31-.89.07-1.85 0 0 .59-.19 1.93.72A6.7 6.7 0 018 4.95c.6 0 1.2.08 1.76.24 1.34-.91 1.93-.72 1.93-.72.38.96.14 1.67.07 1.85.45.49.72 1.11.72 1.88 0 2.7-1.64 3.29-3.21 3.46.25.22.48.65.48 1.31v1.94c0 .19.12.41.48.34A7.002 7.002 0 0015 8c0-3.87-3.13-7-7-7z" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: 'Email',
    href: '/contact',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="1" y="3" width="14" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
        <path d="M1.5 4l6.5 5 6.5-5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
]

function validateForm({ name, email, message }) {
  const errors = {}
  if (!name.trim()) errors.name = 'Name is required'
  if (!email.trim()) {
    errors.email = 'Email is required'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Enter a valid email address'
  }
  if (!message.trim()) {
    errors.message = 'Message is required'
  } else if (message.trim().length < 10) {
    errors.message = 'Message must be at least 10 characters'
  }
  return errors
}

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [serverError, setServerError] = useState('')

  useEffect(() => {
    trackEvent('page_view')
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (touched[name]) {
      const newErrors = validateForm({ ...form, [name]: value })
      setErrors((prev) => ({ ...prev, [name]: newErrors[name] }))
    }
  }

  const handleBlur = (e) => {
    const { name } = e.target
    setTouched((prev) => ({ ...prev, [name]: true }))
    const newErrors = validateForm(form)
    setErrors((prev) => ({ ...prev, [name]: newErrors[name] }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const allTouched = { name: true, email: true, message: true }
    setTouched(allTouched)
    const validationErrors = validateForm(form)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    setStatus('loading')
    setServerError('')
    try {
      await submitContact(form)
      setStatus('success')
      trackEvent('contact_form_submit')
      setForm({ name: '', email: '', message: '' })
      setTouched({})
      setErrors({})
    } catch {
      setStatus('error')
      setServerError('Failed to send message. Please try again shortly.')
    }
  }

  const inputClass = (field) =>
    [
      'w-full bg-zinc-900 border rounded-sm px-4 py-3 text-sm text-white placeholder-zinc-600',
      'focus:outline-none focus:ring-1 transition-all duration-200',
      errors[field] && touched[field]
        ? 'border-red-800 focus:border-red-600 focus:ring-red-600/30'
        : 'border-zinc-800 focus:border-zinc-600 focus:ring-white/10',
    ].join(' ')

  return (
    <div className="min-h-screen pt-24 pb-24 px-6 bg-surface">
      <div className="max-w-6xl mx-auto">
        <SectionTitle
          eyebrow="// Get in touch"
          title="Contact"
          subtitle="Have an opportunity, a project, or just want to connect? I'd love to hear from you."
        />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16">
          {/* Left: Contact info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-2 flex flex-col gap-8"
          >
            {/* Availability */}
            <div className="p-5 bg-[#111111] border border-zinc-800 rounded-sm">
              <div className="flex items-center gap-2 mb-3">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="text-sm text-zinc-300 font-medium">Available for opportunities</span>
              </div>
              <p className="text-zinc-500 text-xs leading-relaxed">
                Open to graduate and entry-level cybersecurity roles, security operations positions, and relevant project conversations.
              </p>
            </div>

            {/* Contact details */}
            <div>
              <p className="text-xs font-mono text-zinc-600 uppercase tracking-widest mb-4">
                Contact Info
              </p>
              <div className="flex flex-col gap-3">
                <div>
                  <p className="text-xs text-zinc-600 mb-0.5">Email</p>
                  <p className="text-sm text-zinc-300">Use the contact form below</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-600 mb-0.5">Location</p>
                  <p className="text-sm text-zinc-300">Saudi Arabia</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-600 mb-0.5">Response time</p>
                  <p className="text-sm text-zinc-300">Within 24 hours</p>
                </div>
              </div>
            </div>

            {/* Social links */}
            <div>
              <p className="text-xs font-mono text-zinc-600 uppercase tracking-widest mb-4">
                Connect
              </p>
              <div className="flex flex-col gap-2">
                {socialLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target={link.href.startsWith('http') ? '_blank' : undefined}
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm text-zinc-500 hover:text-zinc-200 transition-colors duration-200 group"
                  >
                    <span className="text-zinc-700 group-hover:text-zinc-400 transition-colors duration-200">
                      {link.icon}
                    </span>
                    {link.label}
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <path d="M2 8L8 2M8 2H3M8 2v5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right: Contact form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-3"
          >
            {status === 'success' ? (
              <div className="bg-[#111111] border border-zinc-800 rounded-sm p-10 flex flex-col items-center justify-center text-center gap-4 min-h-[400px]">
                <div className="w-12 h-12 rounded-full bg-emerald-950 border border-emerald-900 flex items-center justify-center mb-2">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 10l5 5 7-8" stroke="#34d399" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h3 className="text-white font-semibold text-xl">Message sent</h3>
                <p className="text-zinc-500 text-sm max-w-sm">
                  Thanks for reaching out. I'll get back to you within 24 hours.
                </p>
                <button
                  onClick={() => setStatus('idle')}
                  className="mt-4 text-xs font-mono text-zinc-600 hover:text-zinc-400 transition-colors duration-200"
                >
                  Send another message →
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
                {/* Name */}
                <div>
                  <label className="block text-xs font-mono text-zinc-500 mb-2">
                    Name <span className="text-zinc-700">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Your name"
                    className={inputClass('name')}
                  />
                  {errors.name && touched.name && (
                    <p className="mt-1.5 text-xs text-red-500">{errors.name}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-mono text-zinc-500 mb-2">
                    Email <span className="text-zinc-700">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="your@email.com"
                    className={inputClass('email')}
                  />
                  {errors.email && touched.email && (
                    <p className="mt-1.5 text-xs text-red-500">{errors.email}</p>
                  )}
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-mono text-zinc-500 mb-2">
                    Message <span className="text-zinc-700">*</span>
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Tell me about the opportunity or project..."
                    rows={6}
                    className={`${inputClass('message')} resize-none`}
                  />
                  <div className="flex justify-between mt-1.5">
                    {errors.message && touched.message ? (
                      <p className="text-xs text-red-500">{errors.message}</p>
                    ) : (
                      <span />
                    )}
                    <span className="text-xs text-zinc-700 font-mono">
                      {form.message.length} chars
                    </span>
                  </div>
                </div>

                {/* Server error */}
                {status === 'error' && serverError && (
                  <div className="p-3 bg-red-950/50 border border-red-900/50 rounded-sm">
                    <p className="text-xs text-red-400">{serverError}</p>
                  </div>
                )}

                {/* Submit */}
                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={status === 'loading'}
                    className="w-full sm:w-auto"
                  >
                    {status === 'loading' ? (
                      <>
                        <svg className="animate-spin" width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5" strokeDasharray="28" strokeDashoffset="10" />
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <path d="M1 7h12M7.5 1.5L13 7l-5.5 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </>
                    )}
                  </Button>
                </div>

                <p className="text-xs text-zinc-700">
                  By submitting this form, you agree that your message will be stored for response purposes.
                </p>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
