import { Link, useLocation } from 'react-router-dom'

const navItems = [
  { label: 'Scanner', path: '/' },
  { label: 'Archive', path: '/archive' },
  { label: 'Tabletop', path: '/tabletop' },
  { label: 'Setup', path: '/setup' },
]

export default function TopAppBar({ showBackButton, showDesktopNav = false, showSyncBadge = false }) {
  const location = useLocation()

  return (
    <header className="bg-surface flex justify-between items-center px-6 py-4 w-full sticky top-0 z-50">
      <div className="flex items-center gap-3">
        {showBackButton ? (
          <Link to="/">
            <span className="material-symbols-outlined text-primary cursor-pointer">arrow_back</span>
          </Link>
        ) : (
          <span className="material-symbols-outlined text-primary">menu</span>
        )}
        <h1 className="font-headline italic text-2xl tracking-tight text-primary font-bold">The Archive</h1>
      </div>
      <div className="flex items-center gap-4">
        {showSyncBadge && (
          <div className="flex items-center gap-2 bg-surface-container-high px-3 py-1 rounded-full border border-primary/20">
            <span className="material-symbols-outlined filled text-secondary text-sm">cast_connected</span>
            <span className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant">Sync Active</span>
          </div>
        )}
        {showDesktopNav && (
          <nav className="hidden md:flex gap-8 items-center">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`font-label text-xs uppercase tracking-widest transition-colors duration-300 ${
                  location.pathname === item.path
                    ? 'text-primary font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}
        <span className="material-symbols-outlined text-primary cursor-pointer">account_circle</span>
      </div>
    </header>
  )
}
