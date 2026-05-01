import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import TopBar from './TopBar'

const pageTitles = {
  '/security/dashboard': 'Overview',
  '/security/siem': 'SIEM Events',
  '/security/settings': 'Settings',
}

export default function DashboardLayout() {
  const location = useLocation()
  const title = pageTitles[location.pathname] || 'Command Center'

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#070709' }}>
      <Sidebar />
      <TopBar title={title} />
      <main
        className="min-h-screen"
        style={{
          marginLeft: '220px',
          paddingTop: '48px',
        }}
      >
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
