import { Link } from 'react-router-dom'
import TopAppBar from '../components/TopAppBar'
import BottomNav from '../components/BottomNav'

const creatures = [
  {
    name: 'Stormbreath Dragon',
    type: 'Creature — Dragon',
    pt: '4/4',
    tags: ['Haste', 'Flying'],
    mana: [{ color: 'bg-red-500', glow: 'shadow-red-500/50' }, { color: 'bg-red-500', glow: 'shadow-red-500/50' }],
    img: 'https://cards.scryfall.io/art_crop/front/4/7/471979de-f569-444a-8651-12d7e726949a.jpg',
  },
  {
    name: 'Llanowar Elves',
    type: 'Creature — Elf Druid',
    pt: '1/1',
    tags: ['Tap for G'],
    mana: [{ color: 'bg-green-500', glow: 'shadow-green-500/50' }],
    img: 'https://cards.scryfall.io/art_crop/front/8/b/8bbcfb77-daa1-4ce5-b5f9-48d0a8c4c2f5.jpg',
    hasAbility: true,
  },
  {
    name: 'Traxos, Scourge',
    type: 'Artifact Creature — Construct',
    pt: '7/7',
    ptClass: 'text-error',
    tags: ['Trample'],
    mana: [{ color: 'bg-slate-400' }, { color: 'bg-slate-400' }],
    img: 'https://cards.scryfall.io/art_crop/front/d/a/dab80216-3df7-4e4f-8571-69b91a064f51.jpg',
  },
]

const lands = [
  { name: 'Forest', type: 'Basic Land', icon: 'park', iconColor: 'text-secondary', img: 'https://cards.scryfall.io/art_crop/front/5/8/58fe058d-7796-4233-8d74-2a12f9bd0023.jpg' },
  { name: 'Mountain', type: 'Basic Land', icon: 'terrain', iconColor: 'text-tertiary-container', img: 'https://cards.scryfall.io/art_crop/front/4/2/42232ea6-e31d-46a6-9f94-b2ad2416d79b.jpg' },
]

const stackCards = [
  { name: 'Counterspell', type: 'Instant • Blue', img: 'https://cards.scryfall.io/art_crop/front/1/9/1920c827-e923-4f5d-b1e1-bc0d3728e596.jpg', active: true },
  { name: 'Lightning Bolt', type: 'Instant • Red', img: 'https://cards.scryfall.io/art_crop/front/f/2/f29ba16f-c8fb-42fe-aabf-87089cb214a7.jpg' },
  { name: 'Dark Ritual', type: 'Instant • Black', img: 'https://cards.scryfall.io/art_crop/front/9/5/95f27eeb-6f14-4db3-adb9-9be5ed76b34b.jpg' },
]

export default function Tabletop() {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <TopAppBar showDesktopNav />
      <div className="bg-surface-container h-px w-full" />

      <main className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-80 h-full bg-surface-container hidden md:flex flex-col border-r border-white/5 shadow-2xl z-30">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-headline text-lg italic text-primary">Active Stack</h2>
              <span className="bg-primary-container text-on-primary-container text-[10px] font-bold px-2 py-0.5 rounded-full">3 SPELLS</span>
            </div>
            <div className="space-y-4">
              {stackCards.map((card, i) => (
                <div key={card.name} className={`flex items-center gap-3 p-3 rounded-xl transition-all hover:bg-surface-bright ${
                  card.active ? 'bg-surface-container-high border-l-4 border-primary' : 'bg-surface-container-low'
                }`} style={{ opacity: 1 - i * 0.2 }}>
                  <div className="w-12 h-12 rounded-lg bg-surface-dim overflow-hidden flex-shrink-0">
                    <img className="w-full h-full object-cover" alt={card.name} src={card.img} />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="font-headline text-sm truncate">{card.name}</p>
                    <p className="font-body text-[10px] text-on-surface-variant uppercase tracking-tighter">{card.type}</p>
                  </div>
                  {card.active && <span className="material-symbols-outlined text-primary text-sm">arrow_upward</span>}
                </div>
              ))}
            </div>

            <div className="mt-12">
              <h2 className="font-headline text-lg italic text-on-surface-variant mb-6">Recent Scans</h2>
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="aspect-[3/4] rounded bg-surface-container-highest overflow-hidden cursor-pointer hover:ring-2 ring-primary transition-all">
                    <div className="w-full h-full bg-gradient-to-br from-surface-container-high to-surface-container-highest" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-auto p-6 space-y-4">
            <div className="flex items-center gap-4 py-3 text-slate-400 hover:text-white transition-all cursor-pointer">
              <span className="material-symbols-outlined">style</span>
              <span className="font-body text-sm">My Decks</span>
            </div>
            <div className="flex items-center gap-4 py-3 text-slate-400 hover:text-white transition-all cursor-pointer border-t border-white/5">
              <span className="material-symbols-outlined">gavel</span>
              <span className="font-body text-sm">Rules Engine</span>
            </div>
          </div>
        </aside>

        {/* Main Battlefield */}
        <section className="flex-1 overflow-y-auto bg-surface p-8 pb-32">
          <header className="mb-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
            <div>
              <h2 className="font-headline text-4xl font-bold tracking-tight mb-2">Battlefield</h2>
              <p className="font-body text-on-surface-variant flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">sensors</span>
                Real-time Scanner Active &bull; 14 Cards Detected
              </p>
            </div>
            <div className="flex gap-4">
              <button className="flex items-center gap-2 px-4 py-2 bg-surface-container-highest rounded-xl text-sm font-medium hover:bg-surface-bright transition-all">
                <span className="material-symbols-outlined text-sm">filter_list</span>
                Sort by Mana
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-surface-container-highest rounded-xl text-sm font-medium hover:bg-surface-bright transition-all text-primary">
                <span className="material-symbols-outlined filled text-sm">grid_view</span>
                Type Grouping
              </button>
            </div>
          </header>

          {/* Creatures */}
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <h3 className="font-headline text-xl italic text-primary">Creatures</h3>
              <div className="h-px flex-1 bg-white/5" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {creatures.map(card => (
                <Link to="/card/detail" key={card.name} className="group relative aspect-[3/4.2] rounded-xl bg-surface-container-low overflow-hidden shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] cursor-pointer ring-1 ring-white/5">
                  <img className="absolute inset-0 w-full h-full object-cover" alt={card.name} src={card.img} />
                  <div className="absolute inset-0 card-art-gradient" />
                  <div className="absolute inset-x-0 bottom-0 p-5 flex flex-col justify-end h-full">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-headline text-lg leading-tight group-hover:text-primary transition-colors">{card.name}</h4>
                      <div className="flex gap-0.5 mt-1">
                        {card.mana.map((m, i) => (
                          <span key={i} className={`w-3 h-3 rounded-full ${m.color} shadow-sm ${m.glow || ''}`} />
                        ))}
                      </div>
                    </div>
                    <p className="font-body text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-3">{card.type}</p>
                    <div className="flex justify-between items-center pt-3 border-t border-white/10">
                      <div className="flex gap-2">
                        {card.hasAbility && <span className="material-symbols-outlined text-secondary text-lg">add_circle</span>}
                        {card.tags.map(tag => (
                          <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-surface-container-highest rounded border border-white/10">{tag}</span>
                        ))}
                      </div>
                      <span className={`font-headline text-xl italic font-bold ${card.ptClass || ''}`}>{card.pt}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Lands */}
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <h3 className="font-headline text-xl italic text-primary">Lands</h3>
              <div className="h-px flex-1 bg-white/5" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {lands.map(land => (
                <div key={land.name} className="group relative h-40 rounded-xl bg-surface-container-low overflow-hidden shadow-lg transition-all duration-300 hover:bg-surface-bright cursor-pointer ring-1 ring-white/5">
                  <img className="absolute inset-0 w-full h-full object-cover opacity-40" alt={land.name} src={land.img} />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent" />
                  <div className="absolute inset-0 p-5 flex flex-col justify-end">
                    <h4 className="font-headline text-lg italic group-hover:text-primary transition-colors">{land.name}</h4>
                    <p className="font-body text-[10px] uppercase tracking-widest text-on-surface-variant">{land.type}</p>
                    <div className={`absolute top-4 right-4 ${land.iconColor} opacity-50`}>
                      <span className="material-symbols-outlined text-4xl">{land.icon}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* FAB */}
      <button className="fixed bottom-8 right-8 w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary-container text-on-primary shadow-2xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 z-40">
        <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'wght' 600" }}>add</span>
      </button>

      <BottomNav className="md:hidden" />
    </div>
  )
}
