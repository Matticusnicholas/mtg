import { Link } from 'react-router-dom'
import TopAppBar from '../components/TopAppBar'
import BottomNav from '../components/BottomNav'

const recentCards = [
  { name: 'Shivan Dragon', time: '2m ago', img: 'https://cards.scryfall.io/art_crop/front/2/2/227cf1b5-f85b-41fe-be98-66e383571571.jpg' },
  { name: 'Island', time: '5m ago', img: 'https://cards.scryfall.io/art_crop/front/b/2/b2bcb6bd-3b44-4fae-a587-94abd183a5d4.jpg' },
]

export default function Scanner() {
  return (
    <div className="min-h-screen flex flex-col">
      <TopAppBar showSyncBadge />
      <main className="relative flex-1 flex flex-col pb-28">
        {/* Camera Viewfinder */}
        <div className="flex-1 relative m-4 rounded-xl border border-white/10 shadow-inner overflow-hidden bg-surface-container-lowest min-h-[400px]">
          {/* Simulated camera feed background */}
          <div className="absolute inset-0 bg-gradient-to-br from-surface-container-low via-surface-container to-surface-container-high opacity-80" />

          {/* Scan Focus Bounding Box */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-64 h-80 border-2 border-primary/50 rounded-lg">
              {/* Corner brackets */}
              <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-primary rounded-tl-md" />
              <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-primary rounded-tr-md" />
              <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-primary rounded-bl-md" />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-primary rounded-br-md" />
              {/* Animated scan line */}
              <div className="absolute left-0 w-full h-px bg-primary/40 shadow-[0_0_15px_rgba(173,198,255,0.8)] animate-scan-line" />
            </div>
          </div>

          {/* Detected Card Tag */}
          <div className="absolute top-10 left-10 flex flex-col gap-2">
            <Link to="/card/black-lotus" className="bg-surface-container/80 glass p-3 rounded-lg border border-white/5 flex items-center gap-3 hover:bg-surface-container-high/80 transition-colors">
              <div className="w-10 h-10 bg-surface-container-highest rounded overflow-hidden">
                <img alt="Black Lotus art" className="w-full h-full object-cover" src="https://cards.scryfall.io/art_crop/front/b/d/bd67c428-3c2d-4bca-a896-541af2753554.jpg" />
              </div>
              <div>
                <div className="text-[10px] font-label text-primary uppercase tracking-tighter">Detected</div>
                <div className="font-headline text-sm font-bold">Black Lotus</div>
              </div>
              <span className="material-symbols-outlined text-secondary ml-2">check_circle</span>
            </Link>
          </div>

          {/* Stats Overlay & Shutter */}
          <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
            <div className="space-y-2">
              <div className="bg-surface-container-lowest/60 glass px-3 py-1 rounded-md text-[10px] font-label text-on-surface-variant uppercase tracking-widest">
                Confidence: 98.4%
              </div>
              <div className="bg-surface-container-lowest/60 glass px-3 py-1 rounded-md text-[10px] font-label text-on-surface-variant uppercase tracking-widest">
                Illumination: Optimal
              </div>
            </div>
            <button className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary-container p-1 shadow-lg active:scale-95 transition-transform">
              <div className="w-full h-full rounded-full border-2 border-on-primary/20 flex items-center justify-center">
                <span className="material-symbols-outlined filled text-on-primary text-3xl">camera</span>
              </div>
            </button>
          </div>
        </div>

        {/* Recent Discovery Drawer */}
        <div className="px-6 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-headline text-lg italic">Recent Discovery</h3>
            <span className="text-xs font-label text-primary cursor-pointer">View All</span>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {recentCards.map(card => (
              <Link key={card.name} to="/card/detail" className="flex-shrink-0 w-32 bg-surface-container rounded-lg p-2 border border-white/5 hover:bg-surface-container-high transition-colors">
                <div className="aspect-[3/4] rounded-sm bg-surface-container-highest mb-2 overflow-hidden">
                  <img alt={card.name} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all" src={card.img} />
                </div>
                <div className="text-[10px] font-label truncate uppercase tracking-tighter">{card.name}</div>
                <div className="text-[9px] text-on-surface-variant font-label">Scanned {card.time}</div>
              </Link>
            ))}
            <div className="flex-shrink-0 w-32 bg-surface-container rounded-lg p-2 border border-white/5 opacity-60">
              <div className="aspect-[3/4] rounded-sm bg-surface-container-highest mb-2 flex items-center justify-center">
                <span className="material-symbols-outlined text-outline">history</span>
              </div>
              <div className="text-[10px] font-label truncate uppercase tracking-tighter">More History</div>
            </div>
          </div>
        </div>
      </main>

      {/* Flash toggle FAB */}
      <div className="fixed bottom-28 right-6 z-40">
        <button className="bg-surface-container-high text-primary p-4 rounded-full shadow-2xl border border-white/10 active:scale-90 transition-transform">
          <span className="material-symbols-outlined">flash_on</span>
        </button>
      </div>

      <BottomNav />
    </div>
  )
}
