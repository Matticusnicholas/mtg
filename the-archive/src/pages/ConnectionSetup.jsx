import TopAppBar from '../components/TopAppBar'
import BottomNav from '../components/BottomNav'

const connectedDevices = [
  { name: 'iPad Pro 12.9"', status: 'Active · Card View', icon: 'tablet_mac', online: true },
  { name: 'Archivist Station', status: 'Last seen: 2h ago', icon: 'desktop_windows', online: false },
]

export default function ConnectionSetup() {
  return (
    <div className="bg-surface text-on-surface font-body min-h-screen">
      <TopAppBar />
      <div className="bg-surface-container h-px w-full" />

      <main className="max-w-5xl mx-auto px-6 pt-12 pb-32">
        <div className="mb-12">
          <h2 className="font-headline text-4xl font-bold text-primary mb-2">Sync Your Journey</h2>
          <p className="text-on-surface-variant text-lg">Connect your mobile scanner to an external companion display for a professional tabletop experience.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Steps & QR */}
          <div className="lg:col-span-7 space-y-8">
            <div className="bg-surface-container rounded-xl p-8 space-y-6">
              {/* Step 1 */}
              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center border border-outline-variant/20">
                  <span className="text-primary font-bold">1</span>
                </div>
                <div>
                  <h3 className="font-headline text-xl text-on-surface mb-1">Open Companion App</h3>
                  <p className="text-on-surface-variant text-sm leading-relaxed">Launch &apos;The Archive Companion&apos; on your tablet, PC, or smart display. Ensure both devices are on the same network.</p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-container flex items-center justify-center">
                  <span className="text-on-primary-container font-bold">2</span>
                </div>
                <div className="flex-grow">
                  <h3 className="font-headline text-xl text-on-surface mb-4">Scan or Enter Code</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* QR */}
                    <div className="bg-surface-container-low rounded-lg p-6 flex flex-col items-center justify-center border border-outline-variant/10">
                      <div className="bg-white p-3 rounded-md mb-4 shadow-[0_0_30px_rgba(173,198,255,0.15)]">
                        <div className="w-32 h-32 bg-surface-container-highest rounded flex items-center justify-center">
                          <span className="material-symbols-outlined text-6xl text-primary">qr_code_2</span>
                        </div>
                      </div>
                      <span className="text-[10px] uppercase tracking-widest text-outline font-medium">Scan to Link</span>
                    </div>
                    {/* Manual Code */}
                    <div className="bg-surface-container-high rounded-lg p-6 flex flex-col items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
                      <div className="relative z-10 flex flex-col items-center">
                        <span className="text-4xl font-headline font-bold text-primary tracking-[0.2em] mb-4">882 103</span>
                        <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-medium">6-Digit Join Code</span>
                      </div>
                      <button className="mt-4 text-xs font-label text-primary hover:underline flex items-center gap-1 relative z-10">
                        <span className="material-symbols-outlined text-sm">refresh</span> Regenerate
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center border border-outline-variant/20">
                  <span className="text-primary font-bold">3</span>
                </div>
                <div>
                  <h3 className="font-headline text-xl text-on-surface mb-1">Confirm Identity</h3>
                  <p className="text-on-surface-variant text-sm leading-relaxed">Verify that the device name appearing on your mobile matches your physical companion display.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Connected Devices */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-surface-container rounded-xl overflow-hidden border border-outline-variant/5">
              <div className="px-6 py-4 border-b border-outline-variant/10 flex justify-between items-center">
                <h3 className="font-headline text-lg font-semibold text-on-surface">Connected Displays</h3>
                <span className="bg-secondary/10 text-secondary text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Online</span>
              </div>
              <div className="p-2">
                {connectedDevices.map(device => (
                  <div key={device.name} className={`flex items-center justify-between p-4 rounded-lg mb-2 group transition-all ${
                    device.online ? 'bg-surface-container-high hover:bg-surface-bright' : 'border border-outline-variant/10 opacity-60'
                  }`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-lg bg-surface-container-highest flex items-center justify-center ${device.online ? 'text-primary' : 'text-outline'}`}>
                        <span className="material-symbols-outlined">{device.icon}</span>
                      </div>
                      <div>
                        <p className="font-medium text-on-surface">{device.name}</p>
                        <p className="text-xs text-on-surface-variant">{device.status}</p>
                      </div>
                    </div>
                    <button className={`p-2 rounded-full transition-colors ${device.online ? 'text-outline hover:text-error' : 'text-outline hover:text-primary'}`}>
                      <span className="material-symbols-outlined">{device.online ? 'link_off' : 'sync'}</span>
                    </button>
                  </div>
                ))}
              </div>
              <div className="p-6 bg-surface-container-highest/30">
                <div className="flex items-start gap-4 mb-4">
                  <span className="material-symbols-outlined filled text-secondary">info</span>
                  <p className="text-xs text-on-surface-variant leading-relaxed">External displays allow you to project high-resolution card art and real-time oracle text while you scan your physical collection.</p>
                </div>
                <button className="w-full py-3 rounded-lg bg-surface-container-highest text-on-surface font-semibold text-sm hover:bg-surface-bright transition-all flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-sm">settings</span> Display Settings
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-surface-container-low to-surface-container rounded-xl p-6 border border-outline-variant/10">
              <h4 className="font-label text-xs uppercase tracking-widest text-outline mb-3">Having Trouble?</h4>
              <ul className="space-y-2">
                <li><a className="text-sm text-primary hover:underline flex items-center gap-2" href="#">
                  <span className="material-symbols-outlined text-base">help_center</span> Connection Guide
                </a></li>
                <li><a className="text-sm text-primary hover:underline flex items-center gap-2" href="#">
                  <span className="material-symbols-outlined text-base">wifi_off</span> Offline Pairing
                </a></li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  )
}
