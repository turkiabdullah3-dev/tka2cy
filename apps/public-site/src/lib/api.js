import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
})

export const trackEvent = (event_type, path = window.location.pathname, metadata = {}) => {
  api.post('/public/telemetry', { event_type, path, metadata }).catch(() => {})
}

export const trackCVDownload = () => {
  api.get('/public/cv-download').catch(() => {})
}

export const submitContact = (data) => api.post('/public/contact', data)

export const getProjects = () => api.get('/public/projects')
export const getCyberLabs = () => api.get('/public/cyber-labs')
export const getSkills = () => api.get('/public/skills')
