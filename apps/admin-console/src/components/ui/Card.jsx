export default function Card({ title, children, className = '', padding = 'p-5' }) {
  return (
    <div
      className={`rounded-lg ${padding} ${className}`}
      style={{
        backgroundColor: '#141519',
        border: '1px solid #1e2028',
      }}
    >
      {title && (
        <h2 className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-4">
          {title}
        </h2>
      )}
      {children}
    </div>
  )
}
