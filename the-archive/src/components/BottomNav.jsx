import { Link, useLocation } from 'react-router-dom'

const tabs = [
  { label: 'Scanner', icon: 'document_scanner', path: '/' },
  { label: 'Archive', icon: 'library_books', path: '/archive' },
  { label: 'Tabletop', icon: 'grid_view', path: '/tabletop' },
  { label: 'Setup', icon: 'settings_input_component', path: '/setup' },
]

export default function BottomNav({ className = '' }) {
  const location = useLocation()

  return (
    <nav className={`fixed bottom-0 left-0 w-full flex justify-around items-center pb-8 pt-4 px-4 bg-surface/80 glass z-50 rounded-t-xl border-t border-white/5 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] ${className}`}>
      {tabs.map(tab => {
        const active = location.pathname === tab.path
        return (
          <Link
            key={tab.path}
            to={tab.path}
            className={`flex flex-col items-center justify-center px-4 py-2 rounded-xl active:scale-90 duration-200 ${
              active
                ? 'bg-gradient-to-br from-primary to-primary-container text-on-primary'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span className={`material-symbols-outlined ${active ? 'filled' : ''}`}>{tab.icon}</span>
            <span className="font-sans text-[10px] uppercase tracking-widest font-medium mt-1">{tab.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
