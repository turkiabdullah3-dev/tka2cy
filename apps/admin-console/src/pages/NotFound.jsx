import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function NotFound() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center min-h-64 py-20"
    >
      <div
        className="text-6xl font-mono font-medium mb-4"
        style={{ color: '#27272a' }}
      >
        404
      </div>
      <h1 className="text-lg font-medium text-zinc-400 mb-2">Page Not Found</h1>
      <p className="text-sm text-zinc-600 mb-8 text-center max-w-sm">
        The page you're looking for doesn't exist in this command center.
      </p>
      <Link
        to="/security/dashboard"
        className="text-sm font-mono text-indigo-400 hover:text-indigo-300 transition-colors duration-100 px-4 py-2 rounded"
        style={{ backgroundColor: '#1e1b4b', border: '1px solid #312e81' }}
      >
        ← Back to Dashboard
      </Link>
    </motion.div>
  )
}
