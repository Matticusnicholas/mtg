import { useState, useRef, useCallback, useEffect } from 'react'

/**
 * Hook to manage camera access and provide a live video feed.
 * Uses the rear-facing camera by default (ideal for scanning cards on a table).
 */
export default function useCamera() {
  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const [isActive, setIsActive] = useState(false)
  const [error, setError] = useState(null)
  const [facingMode, setFacingMode] = useState('environment') // rear camera
  const [flashOn, setFlashOn] = useState(false)

  const start = useCallback(async () => {
    try {
      setError(null)
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      })

      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }
      setIsActive(true)
    } catch (err) {
      setError(err.message || 'Camera access denied')
      setIsActive(false)
    }
  }, [facingMode])

  const stop = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    setIsActive(false)
  }, [])

  const toggleFlash = useCallback(async () => {
    if (!streamRef.current) return

    const track = streamRef.current.getVideoTracks()[0]
    const capabilities = track.getCapabilities?.()

    if (capabilities?.torch) {
      const newFlashState = !flashOn
      await track.applyConstraints({ advanced: [{ torch: newFlashState }] })
      setFlashOn(newFlashState)
    }
  }, [flashOn])

  const switchCamera = useCallback(() => {
    stop()
    setFacingMode(prev => prev === 'environment' ? 'user' : 'environment')
  }, [stop])

  // Restart camera when facing mode changes
  useEffect(() => {
    if (isActive) {
      start()
    }
  }, [facingMode]) // eslint-disable-line react-hooks/exhaustive-deps

  // Cleanup on unmount
  useEffect(() => {
    return () => stop()
  }, [stop])

  /**
   * Capture a still frame from the video feed as a canvas.
   */
  const captureFrame = useCallback(() => {
    if (!videoRef.current || !isActive) return null

    const video = videoRef.current
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')
    ctx.drawImage(video, 0, 0)
    return canvas
  }, [isActive])

  return {
    videoRef,
    isActive,
    error,
    flashOn,
    facingMode,
    start,
    stop,
    toggleFlash,
    switchCamera,
    captureFrame,
  }
}
