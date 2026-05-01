export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      colors: {
        console: {
          bg: '#070709',
          surface: '#0d0e12',
          elevated: '#141519',
          border: '#1e2028',
          hover: '#1a1b22',
        },
        severity: {
          critical: '#ef4444',
          high: '#f97316',
          medium: '#eab308',
          low: '#3b82f6',
          info: '#6b7280',
        }
      }
    }
  },
  plugins: []
}
