export default function EmptyState({ title = 'No data', description = 'Nothing to display here.' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div
        className="flex items-center justify-center rounded-lg mb-4"
        style={{
          width: '52px',
          height: '52px',
          backgroundColor: '#141519',
          border: '1px solid #1e2028',
        }}
      >
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="11" cy="11" r="9" stroke="#3f3f46" strokeWidth="1.5"/>
          <path d="M11 7v4M11 14.5v.5" stroke="#3f3f46" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </div>
      <h3 className="text-sm font-medium text-zinc-400 mb-1">{title}</h3>
      <p className="text-xs text-zinc-600 text-center max-w-48">{description}</p>
    </div>
  )
}
