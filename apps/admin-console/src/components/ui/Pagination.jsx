export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null

  const getPages = () => {
    const pages = []
    const maxShown = 5
    let start = Math.max(1, currentPage - Math.floor(maxShown / 2))
    let end = Math.min(totalPages, start + maxShown - 1)
    if (end - start < maxShown - 1) {
      start = Math.max(1, end - maxShown + 1)
    }
    for (let i = start; i <= end; i++) pages.push(i)
    return pages
  }

  const pages = getPages()

  const btnBase = `
    inline-flex items-center justify-center w-8 h-8 rounded text-xs font-mono
    transition-colors duration-100 border cursor-pointer
  `

  return (
    <div className="flex items-center justify-center gap-1 pt-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className={`${btnBase} text-zinc-400 border-zinc-800 hover:bg-zinc-800 hover:text-zinc-200 disabled:opacity-30 disabled:cursor-not-allowed`}
      >
        ‹
      </button>

      {pages[0] > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className={`${btnBase} text-zinc-400 border-zinc-800 hover:bg-zinc-800 hover:text-zinc-200`}
          >
            1
          </button>
          {pages[0] > 2 && (
            <span className="text-zinc-600 text-xs px-1">…</span>
          )}
        </>
      )}

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`${btnBase} ${
            page === currentPage
              ? 'bg-indigo-600 border-indigo-500 text-white'
              : 'text-zinc-400 border-zinc-800 hover:bg-zinc-800 hover:text-zinc-200'
          }`}
        >
          {page}
        </button>
      ))}

      {pages[pages.length - 1] < totalPages && (
        <>
          {pages[pages.length - 1] < totalPages - 1 && (
            <span className="text-zinc-600 text-xs px-1">…</span>
          )}
          <button
            onClick={() => onPageChange(totalPages)}
            className={`${btnBase} text-zinc-400 border-zinc-800 hover:bg-zinc-800 hover:text-zinc-200`}
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className={`${btnBase} text-zinc-400 border-zinc-800 hover:bg-zinc-800 hover:text-zinc-200 disabled:opacity-30 disabled:cursor-not-allowed`}
      >
        ›
      </button>
    </div>
  )
}
