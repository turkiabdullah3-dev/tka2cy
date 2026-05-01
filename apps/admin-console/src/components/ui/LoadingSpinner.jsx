const sizes = {
  sm:  { width: '14px', height: '14px', borderWidth: '2px' },
  md:  { width: '24px', height: '24px', borderWidth: '2px' },
  lg:  { width: '40px', height: '40px', borderWidth: '3px' },
}

export default function LoadingSpinner({ size = 'md', center = false }) {
  const s = sizes[size] || sizes.md

  const spinner = (
    <div
      style={{
        width: s.width,
        height: s.height,
        borderWidth: s.borderWidth,
        borderStyle: 'solid',
        borderColor: '#3f3f46',
        borderTopColor: '#6366f1',
        borderRadius: '50%',
        animation: 'spin 0.7s linear infinite',
      }}
    />
  )

  return (
    <>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      {center ? (
        <div className="flex items-center justify-center w-full py-12">
          {spinner}
        </div>
      ) : spinner}
    </>
  )
}
