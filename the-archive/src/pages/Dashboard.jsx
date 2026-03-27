import TopAppBar from '../components/TopAppBar'
import BottomNav from '../components/BottomNav'

const logEntries = [
  { time: '14:22:01', type: 'INFO', color: 'text-primary', msg: 'Camera initializing...' },
  { time: '14:22:03', type: 'INFO', color: 'text-primary', msg: 'Focus locked at 0.85m' },
  { time: '14:22:05', type: 'DETECT', color: 'text-secondary', msg: 'Card Found (Hullbreacher) - Confidence: 94.2%' },
  { time: '14:22:06', type: 'SYNC', color: 'text-primary-container', msg: 'Pushing meta-data to Archivist Station...' },
  { time: '14:22:10', type: 'DETECT', color: 'text-secondary', msg: 'Card Found (Black Lotus) - Confidence: 98.4%' },
  { time: '14:22:11', type: 'SYNC', color: 'text-primary-container', msg: 'Syncing to Archivist Station... OK' },
  { time: '14:22:15', type: 'WARN', color: 'text-tertiary', msg: 'Lighting drop detected. Adjusting ISO...' },
  { time: '14:22:18', type: 'INFO', color: 'text-primary', msg: 'Neutral balance restored.' },
  { time: '14:22:25', type: 'DETECT', color: 'text-secondary', msg: 'Card Found (Mox Emerald) - Confidence: 97.1%' },
  { time: '14:22:26', type: 'SYNC', color: 'text-primary-container', msg: 'Cloud entry verified.' },
  { time: '14:22:30', type: 'WAIT', color: 'text-outline', msg: 'Idle - scanning surface...' },
]

const activeNodes = [
  { name: 'iPhone 14 Pro', role: 'Scanner Node', icon: 'smartphone', active: true },
  { name: 'Archivist Station', role: 'Display Node', icon: 'desktop_windows', active: true },
  { name: 'iPad Air', role: 'Secondary Observer', icon: 'tablet', active: false },
]

const pipelineSteps = [
  { name: 'Tabletop', desc: 'Physical Card Presence', icon: 'grid_view' },
  { name: 'Scanner', desc: 'Neural Vision Processing', icon: 'document_scanner' },
  { name: 'Cloud Sync', desc: 'Distributed Ledger Storage', icon: 'cloud_sync' },
  { name: 'Companion', desc: 'Real-time Visualization', icon: 'cast_connected' },
]

const latencyBars = [60, 75, 40, 55, 90, 45, 30, 65, 50, 70, 60, 40]

export default function Dashboard() {
  return (
    <div className="bg-background text-on-surface font-body min-h-screen">
      <TopAppBar showDesktopNav />

      <main className="max-w-7xl mx-auto p-6 space-y-8 pb-32">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p className="font-label text-xs uppercase tracking-[0.2em] text-primary mb-2">Systems Diagnostic</p>
            <h2 className="font-headline text-4xl font-bold tracking-tight">Archivist Dashboard</h2>
          </div>
          <div className="flex gap-4">
            <button className="bg-surface-container-highest text-on-surface px-6 py-2.5 rounded-lg font-label text-sm font-medium hover:bg-surface-bright transition-all flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">download</span>
              Download Debug Logs
            </button>
            <button className="bg-gradient-to-br from-primary to-primary-container text-on-primary px-6 py-2.5 rounded-lg font-label text-sm font-bold hover:opacity-90 transition-all flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">restart_alt</span>
              Restart Session
            </button>
          </div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* OCR Console */}
          <div className="md:col-span-8 bg-surface-container-low rounded-xl overflow-hidden flex flex-col h-[500px]">
            <div className="px-6 py-4 bg-surface-container flex justify-between items-center border-b border-white/5">
              <div className="flex items-center gap-3">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-secondary" />
                </span>
                <h3 className="font-label text-sm font-semibold tracking-wider uppercase text-on-surface-variant">OCR Console Stream</h3>
              </div>
              <span className="text-xs font-mono text-outline">v2.4.1-stable</span>
            </div>
            <div className="p-6 font-mono text-sm space-y-2 overflow-y-auto bg-surface-container-lowest flex-grow">
              {logEntries.map((entry, i) => (
                <p key={i} className="text-outline">
                  [{entry.time}] <span className={entry.color}>{entry.type}:</span> {entry.msg}
                </p>
              ))}
            </div>
          </div>

          {/* Right column */}
          <div className="md:col-span-4 space-y-6">
            {/* Active Nodes */}
            <div className="bg-surface-container-high rounded-xl p-6">
              <h3 className="font-label text-sm font-semibold tracking-wider uppercase text-on-surface-variant mb-6">Active Nodes</h3>
              <div className="space-y-4">
                {activeNodes.map(node => (
                  <div key={node.name} className={`flex items-center justify-between p-3 bg-surface-container rounded-lg ${!node.active ? 'opacity-50' : ''}`}>
                    <div className="flex items-center gap-3">
                      <span className={`material-symbols-outlined ${node.active ? 'text-primary' : 'text-outline'}`}>{node.icon}</span>
                      <div>
                        <p className="text-sm font-medium">{node.name}</p>
                        <p className="text-xs text-outline">{node.role}</p>
                      </div>
                    </div>
                    <span className={`text-[10px] px-2 py-1 rounded-full font-bold ${
                      node.active
                        ? 'bg-secondary-container/20 text-secondary'
                        : 'bg-surface-variant text-outline'
                    }`}>
                      {node.active ? 'ACTIVE' : 'OFFLINE'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Latency */}
            <div className="bg-surface-container-high rounded-xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-label text-sm font-semibold tracking-wider uppercase text-on-surface-variant">Network Latency</h3>
                <span className="text-secondary font-mono text-sm">24ms</span>
              </div>
              <div className="h-24 flex items-end gap-1 px-1">
                {latencyBars.map((h, i) => (
                  <div
                    key={i}
                    className={`w-full rounded-t-sm transition-colors ${h < 35 ? 'bg-tertiary/40 hover:bg-tertiary' : 'bg-primary/20 hover:bg-primary'}`}
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
              <div className="flex justify-between mt-2 text-[10px] text-outline font-mono uppercase tracking-widest">
                <span>14:00</span>
                <span>Now</span>
              </div>
            </div>
          </div>

          {/* Data Flow Pipeline */}
          <div className="md:col-span-12">
            <div className="bg-surface-container-low rounded-xl p-8 border border-white/5 relative overflow-hidden">
              <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/5 blur-[100px] rounded-full" />
              <h3 className="font-label text-sm font-semibold tracking-wider uppercase text-on-surface-variant mb-10 text-center">Global Data Flow Pipeline</h3>
              <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
                {pipelineSteps.map((step, i) => (
                  <div key={step.name} className="contents">
                    <div className="flex flex-col items-center text-center group w-48">
                      <div className={`w-16 h-16 rounded-2xl bg-surface-container-highest flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500 shadow-xl ${i === 2 ? 'border border-primary/20' : ''}`}>
                        <span className="material-symbols-outlined text-3xl text-primary">{step.icon}</span>
                      </div>
                      <h4 className="font-bold text-on-surface mb-1">{step.name}</h4>
                      <p className="text-xs text-outline">{step.desc}</p>
                    </div>
                    {i < pipelineSteps.length - 1 && (
                      <>
                        <div className="hidden lg:block h-px w-24 bg-gradient-to-r from-primary/10 via-primary/50 to-primary/10" />
                        <span className="lg:hidden material-symbols-outlined text-outline">arrow_downward</span>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  )
}
