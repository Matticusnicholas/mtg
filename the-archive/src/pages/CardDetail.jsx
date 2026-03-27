import TopAppBar from '../components/TopAppBar'
import BottomNav from '../components/BottomNav'

export default function CardDetail() {
  return (
    <div className="bg-surface text-on-surface font-body min-h-screen pb-24">
      <TopAppBar showBackButton />

      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Left: Card Art */}
          <div className="md:col-span-5 lg:col-span-4 flex flex-col gap-6">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-br from-primary to-primary-container rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-500" />
              <div className="relative aspect-[3/4] w-full bg-surface-container-high rounded-xl overflow-hidden shadow-2xl">
                <img
                  alt="Teferi, Master of Time"
                  className="w-full h-full object-cover transform scale-105 group-hover:scale-110 transition duration-700"
                  src="https://cards.scryfall.io/art_crop/front/7/5/75c23e3b-94f0-4e5a-a3e4-e3dc8a3f4631.jpg"
                />
              </div>
            </div>
            <div className="bg-surface-container-low p-6 rounded-xl space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-on-surface-variant font-label text-sm tracking-widest uppercase">Collector No.</span>
                <span className="font-headline text-lg">243/280 &middot; R</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-on-surface-variant font-label text-sm tracking-widest uppercase">Artist</span>
                <span className="font-headline text-lg">Magali Villeneuve</span>
              </div>
            </div>
          </div>

          {/* Right: Card Details */}
          <div className="md:col-span-7 lg:col-span-8 space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-2">
                <p className="text-primary font-label text-sm tracking-[0.2em] uppercase font-bold">Legendary Creature &mdash; Human Wizard</p>
                <h2 className="text-5xl md:text-6xl font-headline font-bold text-on-surface tracking-tight">Teferi, Master of Time</h2>
              </div>
              <div className="flex gap-2 items-center bg-surface-container-highest/50 p-4 rounded-xl inner-glow-mana border border-outline-variant/20">
                <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center font-headline text-xl text-primary font-bold shadow-lg">2</div>
                <div className="w-10 h-10 rounded-full bg-[#004493] flex items-center justify-center text-white shadow-lg">
                  <span className="material-symbols-outlined filled text-lg">water_drop</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-[#004493] flex items-center justify-center text-white shadow-lg">
                  <span className="material-symbols-outlined filled text-lg">water_drop</span>
                </div>
              </div>
            </div>

            {/* Oracle Text */}
            <div className="bg-surface-container p-8 rounded-xl space-y-8 border-l-4 border-primary">
              <div className="space-y-6">
                <h3 className="text-on-surface-variant font-label text-xs tracking-widest uppercase font-bold border-b border-outline-variant/30 pb-2">Oracle Text (Rules)</h3>
                <div className="space-y-6 text-2xl md:text-3xl font-body leading-relaxed text-on-surface">
                  <p className="font-medium">You may activate loyalty abilities of Teferi, Master of Time on any player&apos;s turn any time you could cast an instant.</p>
                  {[
                    { cost: '+1', text: 'Draw a card, then discard a card.' },
                    { cost: '\u22123', text: "Target creature you don't control phases out." },
                    { cost: '\u221210', text: 'Take two extra turns after this one.' },
                  ].map(ability => (
                    <div key={ability.cost} className="flex gap-4 items-start py-4 group cursor-default">
                      <div className="bg-surface-container-highest px-3 py-1 rounded font-headline text-primary border border-outline-variant/30">{ability.cost}</div>
                      <p className="flex-1 text-on-surface group-hover:text-primary transition-colors">{ability.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Loyalty & Cast */}
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="flex-1 bg-surface-variant/40 glass p-6 rounded-xl flex items-center justify-between border border-outline-variant/10 shadow-xl">
                <div>
                  <p className="text-on-surface-variant font-label text-xs uppercase tracking-widest">Base Loyalty</p>
                  <p className="font-headline text-5xl font-bold text-primary mt-1">3</p>
                </div>
                <span className="material-symbols-outlined filled text-4xl text-primary/40">shield_with_heart</span>
              </div>
              <button className="flex-[2] bg-gradient-to-br from-primary to-primary-container hover:from-primary-fixed hover:to-primary transition-all duration-300 rounded-xl px-8 py-6 flex items-center justify-between group">
                <div className="text-left">
                  <p className="text-on-primary font-label text-xs uppercase tracking-[0.2em] font-bold">External View</p>
                  <p className="text-on-primary-fixed font-headline text-2xl font-bold">Cast to Display</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-on-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-on-primary text-3xl">cast_connected</span>
                </div>
              </button>
            </div>

            {/* Legality */}
            <div className="flex flex-wrap gap-3">
              {['Standard Legal', 'Commander Legal'].map(tag => (
                <span key={tag} className="px-4 py-2 bg-secondary/10 text-secondary border border-secondary/20 rounded-full font-label text-sm font-bold uppercase tracking-wider">{tag}</span>
              ))}
              <span className="px-4 py-2 bg-surface-container-highest text-on-surface-variant rounded-full font-label text-sm font-bold uppercase tracking-wider">Modern Legal</span>
            </div>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  )
}
