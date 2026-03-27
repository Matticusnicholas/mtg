import { Link } from 'react-router-dom'
import TopAppBar from '../components/TopAppBar'
import BottomNav from '../components/BottomNav'

const cards = [
  { name: 'Black Lotus', set: 'Alpha', type: 'Artifact', img: 'https://cards.scryfall.io/art_crop/front/b/d/bd67c428-3c2d-4bca-a896-541af2753554.jpg' },
  { name: 'Teferi, Master of Time', set: 'M21', type: 'Planeswalker', img: 'https://cards.scryfall.io/art_crop/front/7/5/75c23e3b-94f0-4e5a-a3e4-e3dc8a3f4631.jpg' },
  { name: 'Stormbreath Dragon', set: 'Theros', type: 'Creature', img: 'https://cards.scryfall.io/art_crop/front/4/7/471979de-f569-444a-8651-12d7e726949a.jpg' },
  { name: 'Counterspell', set: 'A25', type: 'Instant', img: 'https://cards.scryfall.io/art_crop/front/1/9/1920c827-e923-4f5d-b1e1-bc0d3728e596.jpg' },
  { name: 'Lightning Bolt', set: 'A25', type: 'Instant', img: 'https://cards.scryfall.io/art_crop/front/f/2/f29ba16f-c8fb-42fe-aabf-87089cb214a7.jpg' },
  { name: 'Llanowar Elves', set: 'M19', type: 'Creature', img: 'https://cards.scryfall.io/art_crop/front/8/b/8bbcfb77-daa1-4ce5-b5f9-48d0a8c4c2f5.jpg' },
]

export default function Archive() {
  return (
    <div className="bg-surface text-on-surface font-body min-h-screen">
      <TopAppBar showDesktopNav />
      <div className="bg-surface-container h-px w-full" />

      <main className="max-w-7xl mx-auto p-6 pb-32">
        <div className="mb-10">
          <h2 className="font-headline text-4xl font-bold tracking-tight mb-2">Your Collection</h2>
          <p className="font-body text-on-surface-variant flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">library_books</span>
            {cards.length} cards scanned this session
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {cards.map(card => (
            <Link to="/card/detail" key={card.name} className="group relative aspect-[3/4] rounded-xl bg-surface-container-low overflow-hidden shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] cursor-pointer ring-1 ring-white/5">
              <img className="absolute inset-0 w-full h-full object-cover" alt={card.name} src={card.img} />
              <div className="absolute inset-0 card-art-gradient" />
              <div className="absolute inset-x-0 bottom-0 p-4">
                <h4 className="font-headline text-base leading-tight group-hover:text-primary transition-colors">{card.name}</h4>
                <p className="font-body text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mt-1">{card.type} &middot; {card.set}</p>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <BottomNav />
    </div>
  )
}
