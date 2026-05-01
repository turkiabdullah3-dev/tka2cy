import { NavLink } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

const IconGrid = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="1" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/>
    <rect x="9" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/>
    <rect x="1" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/>
    <rect x="9" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
)

const IconShield = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 1.5L2 4v4c0 3.3 2.5 5.8 6 6.5C11.5 13.8 14 11.3 14 8V4L8 1.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M5.5 8l2 2 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const IconGear = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M8 1v2M8 13v2M1 8h2M13 8h2M2.93 2.93l1.41 1.41M11.66 11.66l1.41 1.41M2.93 13.07l1.41-1.41M11.66 4.34l1.41-1.41" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)

const IconChart = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <polyline points="1,12 5,7 9,9 15,3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="1" y1="14" x2="15" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)

const IconTask = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="2" width="12" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
    <line x1="5" y1="6" x2="11" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="5" y1="8.5" x2="9" y2="8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="5" y1="11" x2="10" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)

const IconApp = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="1.5" y="1.5" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5"/>
    <rect x="9.5" y="1.5" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5"/>
    <rect x="1.5" y="9.5" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M9.5 12H14.5M12 9.5V14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)

const IconBriefcase = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="1" y="5" width="14" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M5 5V3.5C5 2.67 5.67 2 6.5 2h3C10.33 2 11 2.67 11 3.5V5" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
)

const IconRobot = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="5" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="5.5" cy="9" r="1" fill="currentColor"/>
    <circle cx="10.5" cy="9" r="1" fill="currentColor"/>
    <path d="M6 12h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M8 5V2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="8" cy="2" r="1" fill="currentColor"/>
  </svg>
)

const IconMail = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="1" y="3" width="14" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
    <polyline points="1,4 8,9 15,4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const IconLogout = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 2H2.5C1.67 2 1 2.67 1 3.5v7C1 11.33 1.67 12 2.5 12H5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M9 9.5l3-2.5-3-2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="13" y1="7" x2="5" y2="7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)

const navItems = [
  { to: '/security/dashboard', label: 'Overview', icon: <IconGrid /> },
  { to: '/security/siem', label: 'SIEM Events', icon: <IconShield /> },
  { to: '/security/analytics', label: 'Analytics', icon: <IconChart /> },
  { to: '/security/tasks', label: 'Tasks', icon: <IconTask /> },
  { to: '/security/settings', label: 'Settings', icon: <IconGear /> },
]

const disabledItems = [
  { label: 'Applications', icon: <IconApp /> },
  { label: 'Job Intelligence', icon: <IconBriefcase /> },
  { label: 'AI Cyber Analyst', icon: <IconRobot /> },
  { label: 'Email Assistant', icon: <IconMail /> },
]

export default function Sidebar() {
  const { user, logout } = useAuth()

  return (
    <aside
      className="fixed left-0 top-0 h-full flex flex-col z-30"
      style={{
        width: '220px',
        backgroundColor: '#0d0e12',
        borderRight: '1px solid #1e2028',
      }}
    >
      {/* Logo area */}
      <div className="flex items-center gap-3 px-4 py-5" style={{ borderBottom: '1px solid #1e2028' }}>
        <div
          className="flex items-center justify-center rounded font-mono font-medium text-sm flex-shrink-0"
          style={{
            width: '32px',
            height: '32px',
            backgroundColor: '#1e2028',
            color: '#a1a1aa',
            letterSpacing: '0.05em',
          }}
        >
          TC
        </div>
        <div>
          <div className="text-xs font-medium text-zinc-300 leading-tight">Command Center</div>
          <div className="text-xs text-zinc-600 leading-tight mt-0.5">Turki Platform</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3">
        <div className="px-2 space-y-0.5">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded text-sm transition-colors duration-100 group ${
                  isActive
                    ? 'text-zinc-100 border-l-2 border-white rounded-l-none pl-[10px]'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-console-hover'
                }`
              }
              style={({ isActive }) =>
                isActive ? { backgroundColor: '#1a1b22' } : {}
              }
            >
              <span className="flex-shrink-0">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>

        {/* Divider */}
        <div className="mx-4 my-3" style={{ borderTop: '1px solid #1e2028' }} />

        {/* Disabled items */}
        <div className="px-2 space-y-0.5">
          {disabledItems.map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-3 px-3 py-2 rounded text-sm cursor-not-allowed select-none"
            >
              <span className="flex-shrink-0 text-zinc-700">{item.icon}</span>
              <span className="text-zinc-600 flex-1">{item.label}</span>
              <span
                className="text-xs font-mono px-1.5 py-0.5 rounded"
                style={{ backgroundColor: '#1a1b22', color: '#52525b', fontSize: '10px' }}
              >
                Soon
              </span>
            </div>
          ))}
        </div>
      </nav>

      {/* User info + logout */}
      <div className="px-4 py-4" style={{ borderTop: '1px solid #1e2028' }}>
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <div className="text-xs text-zinc-500 truncate font-mono" title={user?.email}>
              {user?.email || 'admin'}
            </div>
            <div className="flex items-center gap-1.5 mt-1">
              <span
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: '#22c55e' }}
              />
              <span className="text-xs text-zinc-600">Active session</span>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center justify-center text-zinc-600 hover:text-red-400 transition-colors duration-150 flex-shrink-0 p-1.5 rounded hover:bg-red-950"
            title="Sign out"
          >
            <IconLogout />
          </button>
        </div>
      </div>
    </aside>
  )
}
