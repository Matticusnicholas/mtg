import { useState, useRef, useCallback } from 'react'
import { recognizeCard, extractTextFromFrame } from '../services/cardRecognition'

/**
 * Hook that orchestrates the card scanning pipeline:
 * 1. Captures frames from the camera at a set interval
 * 2. Runs OCR text extraction on each frame
 * 3. Fuzzy-matches extracted text against Scryfall
 * 4. Maintains a list of detected cards with confidence scores
 */
export default function useCardScanner() {
  const [detectedCard, setDetectedCard] = useState(null)
  const [confidence, setConfidence] = useState(0)
  const [isScanning, setIsScanning] = useState(false)
  const [recentScans, setRecentScans] = useState([])
  const [scanStatus, setScanStatus] = useState('idle') // idle | scanning | detected | error
  const intervalRef = useRef(null)
  const lastDetectedRef = useRef(null)

  /**
   * Start continuous scanning from a video element.
   * Captures a frame every `intervalMs` and runs recognition.
   */
  const startScanning = useCallback((videoElement, { intervalMs = 2000 } = {}) => {
    if (intervalRef.current) return
    setIsScanning(true)
    setScanStatus('scanning')

    intervalRef.current = setInterval(async () => {
      if (!videoElement || videoElement.paused || videoElement.ended) return

      try {
        const { candidateName } = await extractTextFromFrame(videoElement)

        if (!candidateName) {
          setScanStatus('scanning')
          return
        }

        // Skip if we just detected the same card
        if (lastDetectedRef.current === candidateName) return

        const result = await recognizeCard(candidateName)

        if (result.card && result.confidence > 0.5) {
          lastDetectedRef.current = candidateName
          setDetectedCard(result.card)
          setConfidence(result.confidence)
          setScanStatus('detected')

          setRecentScans(prev => {
            // Don't add duplicates
            if (prev.some(s => s.id === result.card.id)) return prev
            return [
              { ...result.card, scannedAt: new Date(), confidence: result.confidence },
              ...prev,
            ].slice(0, 20) // Keep last 20 scans
          })
        }
      } catch {
        setScanStatus('error')
      }
    }, intervalMs)
  }, [])

  const stopScanning = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setIsScanning(false)
    setScanStatus('idle')
  }, [])

  /**
   * Manually trigger a single scan (e.g., when user taps the shutter button).
   */
  const scanOnce = useCallback(async (videoElement) => {
    if (!videoElement) return null

    setScanStatus('scanning')

    try {
      const { candidateName } = await extractTextFromFrame(videoElement)

      if (!candidateName) {
        setScanStatus('idle')
        return null
      }

      const result = await recognizeCard(candidateName)

      if (result.card) {
        setDetectedCard(result.card)
        setConfidence(result.confidence)
        setScanStatus('detected')

        setRecentScans(prev => {
          if (prev.some(s => s.id === result.card.id)) return prev
          return [
            { ...result.card, scannedAt: new Date(), confidence: result.confidence },
            ...prev,
          ].slice(0, 20)
        })
      } else {
        setScanStatus('idle')
      }

      return result
    } catch {
      setScanStatus('error')
      return null
    }
  }, [])

  const clearDetected = useCallback(() => {
    setDetectedCard(null)
    setConfidence(0)
    setScanStatus('idle')
    lastDetectedRef.current = null
  }, [])

  return {
    detectedCard,
    confidence,
    isScanning,
    scanStatus,
    recentScans,
    startScanning,
    stopScanning,
    scanOnce,
    clearDetected,
  }
}
