import React, { useEffect } from 'react'
import Hero from '../components/sections/Hero'
import Projects from '../components/sections/Projects'
import CyberLabs from '../components/sections/CyberLabs'
import Skills from '../components/sections/Skills'
import ContactSection from '../components/sections/ContactSection'
import Divider from '../components/ui/Divider'
import { trackEvent } from '../lib/api'

export default function Home() {
  useEffect(() => {
    trackEvent('page_view')
  }, [])

  return (
    <>
      <Hero />
      <Divider />
      <Projects limit={3} />
      <Divider />
      <CyberLabs />
      <Divider />
      <Skills />
      <Divider />
      <ContactSection />
    </>
  )
}
