import React from 'react'
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import Home from './pages/Home'
import ProjectsPage from './pages/ProjectsPage'
import CyberLabsPage from './pages/CyberLabsPage'
import SkillsPage from './pages/SkillsPage'
import ContactPage from './pages/ContactPage'
import CVPage from './pages/CVPage'
import NotFound from './pages/NotFound'

function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/cyber-labs" element={<CyberLabsPage />} />
          <Route path="/skills" element={<SkillsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/cv" element={<CVPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
