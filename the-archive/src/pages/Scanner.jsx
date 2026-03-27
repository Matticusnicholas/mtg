import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import TopAppBar from '../components/TopAppBar'
import BottomNav from '../components/BottomNav'
import useCamera from '../hooks/useCamera'
import useCardScanner from '../hooks/useCardScanner'

function timeAgo(date) {
  if (!date) return ''
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  return `${minutes}m ago`
}

export default function Scanner() {
  const { videoRef, isActive, error: cameraError, flashOn, start, toggleFlash, captureFrame } = useCamera()
  const { detectedCard, confidence, isScanning, scanStatus, recentScans, startScanning, stopScanning, scanOnce } = useCardScanner()

  // Start camera on mount
  useEffect(() => {
    start()
  }, [start])

  // Start continuous scanning when camera is active
  useEffect(() => {
    if (isActive && videoRef.current) {
      startScanning(videoRef.current, { intervalMs: 2000 })
    }
    return () => stopScanning()
  }, [isActive]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleShutter = () => {
    if (videoRef.current) {
      scanOnce(videoRef.current)
    }
  }

  const confidencePercent = detectedCard ? (confidence * 100).toFixed(1) : '—'

  return (
    <div className="min-h-screen flex flex-col">
      <TopAppBar showSyncBadge />
      <main className="relative flex-1 flex flex-col pb-28">
        {/* Camera Viewfinder */}
        <div className="flex-1 relative m-4 rounded-xl border border-white/10 shadow-inner overflow-hidden bg-surface-container-lowest min-h-[400px]">
          {/* Live camera feed */}
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
            playsInline
            muted
            autoPlay
          />

          {/* Fallback when camera isn't available */}
          {!isActive && (
            <div className="absolute inset-0 bg-gradient-to-br from-surface-container-low via-surface-container to-surface-container-high flex items-center justify-center">
              {cameraError ? (
                <div className="text-center space-y-4 p-8">
                  <span className="material-symbols-outlined text-5xl text-outline">videocam_off</span>
                  <p className="text-on-surface-variant text-sm max-w-xs">
                    Camera access is required to scan cards. {cameraError}
                  </p>
                  <button onClick={start} className="px-4 py-2 bg-primary-container text-on-primary-container rounded-lg text-sm font-medium">
                    Try Again
                  </button>
                </div>
              ) : (
                <div className="text-center space-y-3">
                  <span className="material-symbols-outlined text-5xl text-primary animate-pulse">photo_camera</span>
                  <p className="text-on-surface-variant text-sm">Starting camera...</p>
                </div>
              )}
            </div>
          )}

          {/* Scan Focus Bounding Box */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className={`relative w-64 h-80 border-2 rounded-lg transition-colors duration-300 ${
              scanStatus === 'detected' ? 'border-secondary/70' : 'border-primary/50'
            }`}>
              {/* Corner brackets */}
              <div className={`absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 rounded-tl-md transition-colors ${scanStatus === 'detected' ? 'border-secondary' : 'border-primary'}`} />
              <div className={`absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 rounded-tr-md transition-colors ${scanStatus === 'detected' ? 'border-secondary' : 'border-primary'}`} />
              <div className={`absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 rounded-bl-md transition-colors ${scanStatus === 'detected' ? 'border-secondary' : 'border-primary'}`} />
              <div className={`absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 rounded-br-md transition-colors ${scanStatus === 'detected' ? 'border-secondary' : 'border-primary'}`} />
              {/* Animated scan line */}
              {isScanning && scanStatus !== 'detected' && (
                <div className="absolute left-0 w-full h-px bg-primary/40 shadow-[0_0_15px_rgba(173,198,255,0.8)] animate-scan-line" />
              )}
            </div>
          </div>

          {/* Detected Card Tag */}
          {detectedCard && (
            <div className="absolute top-10 left-10 flex flex-col gap-2">
              <Link
                to={`/card/${detectedCard.id}`}
                className="bg-surface-container/80 glass p-3 rounded-lg border border-white/5 flex items-center gap-3 hover:bg-surface-container-high/80 transition-colors"
              >
                {detectedCard.images.artCrop && (
                  <div className="w-10 h-10 bg-surface-container-highest rounded overflow-hidden">
                    <img alt={detectedCard.name} className="w-full h-full object-cover" src={detectedCard.images.artCrop} />
                  </div>
                )}
                <div>
                  <div className="text-[10px] font-label text-primary uppercase tracking-tighter">Detected</div>
                  <div className="font-headline text-sm font-bold">{detectedCard.name}</div>
                </div>
                <span className="material-symbols-outlined text-secondary ml-2">check_circle</span>
              </Link>
            </div>
          )}

          {/* Stats Overlay & Shutter */}
          <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
            <div className="space-y-2">
              <div className="bg-surface-container-lowest/60 glass px-3 py-1 rounded-md text-[10px] font-label text-on-surface-variant uppercase tracking-widest">
                Confidence: {confidencePercent}%
              </div>
              <div className={`bg-surface-container-lowest/60 glass px-3 py-1 rounded-md text-[10px] font-label uppercase tracking-widest ${
                isActive ? 'text-secondary' : 'text-on-surface-variant'
              }`}>
                {isActive ? 'Camera Active' : 'Camera Off'}
              </div>
              <div className="bg-surface-container-lowest/60 glass px-3 py-1 rounded-md text-[10px] font-label text-on-surface-variant uppercase tracking-widest">
                {scanStatus === 'scanning' && 'Scanning...'}
                {scanStatus === 'detected' && 'Card Found'}
                {scanStatus === 'idle' && 'Ready'}
                {scanStatus === 'error' && 'Scan Error'}
              </div>
            </div>
            <button
              onClick={handleShutter}
              disabled={!isActive}
              className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary-container p-1 shadow-lg active:scale-95 transition-transform disabled:opacity-40"
            >
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
            <Link to="/archive" className="text-xs font-label text-primary cursor-pointer">View All</Link>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {recentScans.length === 0 && (
              <div className="flex-shrink-0 w-32 bg-surface-container rounded-lg p-2 border border-white/5 opacity-60">
                <div className="aspect-[3/4] rounded-sm bg-surface-container-highest mb-2 flex items-center justify-center">
                  <span className="material-symbols-outlined text-outline">photo_camera</span>
                </div>
                <div className="text-[10px] font-label truncate uppercase tracking-tighter">Scan a card</div>
                <div className="text-[9px] text-on-surface-variant font-label">Point camera at a card</div>
              </div>
            )}
            {recentScans.map(card => (
              <Link
                key={card.id}
                to={`/card/${card.id}`}
                className="flex-shrink-0 w-32 bg-surface-container rounded-lg p-2 border border-white/5 hover:bg-surface-container-high transition-colors"
              >
                <div className="aspect-[3/4] rounded-sm bg-surface-container-highest mb-2 overflow-hidden">
                  {card.images.artCrop ? (
                    <img alt={card.name} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all" src={card.images.artCrop} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="material-symbols-outlined text-outline">image</span>
                    </div>
                  )}
                </div>
                <div className="text-[10px] font-label truncate uppercase tracking-tighter">{card.name}</div>
                <div className="text-[9px] text-on-surface-variant font-label">
                  {timeAgo(card.scannedAt)}
                </div>
              </Link>
            ))}
            {recentScans.length > 0 && (
              <Link to="/archive" className="flex-shrink-0 w-32 bg-surface-container rounded-lg p-2 border border-white/5 opacity-60">
                <div className="aspect-[3/4] rounded-sm bg-surface-container-highest mb-2 flex items-center justify-center">
                  <span className="material-symbols-outlined text-outline">history</span>
                </div>
                <div className="text-[10px] font-label truncate uppercase tracking-tighter">More History</div>
              </Link>
            )}
          </div>
        </div>
      </main>

      {/* Flash toggle FAB */}
      <div className="fixed bottom-28 right-6 z-40">
        <button
          onClick={toggleFlash}
          className={`p-4 rounded-full shadow-2xl border border-white/10 active:scale-90 transition-transform ${
            flashOn ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-primary'
          }`}
        >
          <span className="material-symbols-outlined">{flashOn ? 'flash_on' : 'flash_off'}</span>
        </button>
      </div>

      <BottomNav />
    </div>
  )
}
