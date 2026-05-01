import { motion } from 'framer-motion'
import { useAuth } from '../hooks/useAuth'
import Card from '../components/ui/Card'

function SettingRow({ label, value, disabled = false, description }) {
  return (
    <div
      className="flex items-center justify-between py-3.5"
      style={{ borderBottom: '1px solid #1e2028' }}
    >
      <div>
        <div className="text-sm text-zinc-300">{label}</div>
        {description && <div className="text-xs text-zinc-600 mt-0.5">{description}</div>}
      </div>
      <div className="flex items-center gap-3">
        {value && (
          <span className="text-sm font-mono text-zinc-400">{value}</span>
        )}
        {disabled && (
          <span
            className="text-xs font-mono px-2 py-0.5 rounded"
            style={{ backgroundColor: '#1a1b22', color: '#52525b', border: '1px solid #1e2028' }}
          >
            Coming soon
          </span>
        )}
      </div>
    </div>
  )
}

const comingSoonFeatures = [
  { label: 'User Management', description: 'Add and manage operator accounts with role-based access.' },
  { label: 'Alert Rules', description: 'Configure automated alert thresholds and notification channels.' },
  { label: 'Webhook Integrations', description: 'Push event notifications to Slack, PagerDuty, or custom endpoints.' },
  { label: 'API Key Management', description: 'Issue and revoke scoped API keys for service authentication.' },
  { label: 'Audit Log Export', description: 'Export full audit trails to CSV or send to SIEM integrations.' },
  { label: 'Two-Factor Authentication', description: 'Enforce TOTP-based 2FA for all admin sessions.' },
  { label: 'IP Allowlisting', description: 'Restrict console access to specified IP ranges.' },
  { label: 'Event Retention Policy', description: 'Configure automated event archival and deletion schedules.' },
]

const ENV_LABEL = import.meta.env.MODE === 'production' ? 'Production' : 'Development'

export default function SettingsPage() {
  const { user, logout } = useAuth()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 max-w-2xl"
    >
      {/* Account section */}
      <Card title="Account">
        <div className="divide-y divide-console-border -mt-1">
          <SettingRow
            label="Email Address"
            value={user?.email || 'Not available'}
          />
          <SettingRow
            label="Role"
            value="Super Admin"
          />
          <SettingRow
            label="Change Password"
            description="Update your admin console password."
            disabled
          />
          <SettingRow
            label="Active Sessions"
            description="View and invalidate active login sessions."
            disabled
          />
        </div>
      </Card>

      {/* System section */}
      <Card title="System">
        <div className="divide-y divide-console-border -mt-1">
          <SettingRow
            label="Platform Version"
            value="1.0.0"
          />
          <SettingRow
            label="Admin Console Version"
            value="1.0.0"
          />
          <SettingRow
            label="Environment"
            value={ENV_LABEL}
          />
          <SettingRow
            label="API Base"
            value="/api"
          />
          <SettingRow
            label="Session Mode"
            value="HTTP-only cookie"
          />
        </div>
      </Card>

      {/* Coming Soon section */}
      <Card title="Coming Soon — Phase 2+">
        <div className="space-y-1 -mt-1">
          {comingSoonFeatures.map((feature) => (
            <div
              key={feature.label}
              className="flex items-start gap-3 py-3.5"
              style={{ borderBottom: '1px solid #1e2028' }}
            >
              <div
                className="flex-shrink-0 w-1.5 h-1.5 rounded-full mt-1.5"
                style={{ backgroundColor: '#27272a' }}
              />
              <div>
                <div className="text-sm text-zinc-500">{feature.label}</div>
                <div className="text-xs text-zinc-700 mt-0.5">{feature.description}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Danger zone */}
      <Card title="Session">
        <div
          className="flex items-center justify-between py-2"
        >
          <div>
            <div className="text-sm text-zinc-300">Sign Out</div>
            <div className="text-xs text-zinc-600 mt-0.5">End your current admin session.</div>
          </div>
          <button
            onClick={async () => {
              if (window.confirm('Sign out of Command Center?')) {
                await logout()
              }
            }}
            className="text-xs font-mono text-red-400 hover:text-red-300 px-3 py-1.5 rounded transition-colors duration-100"
            style={{ backgroundColor: '#1c0a0a', border: '1px solid #450a0a' }}
          >
            Sign Out
          </button>
        </div>
      </Card>
    </motion.div>
  )
}
