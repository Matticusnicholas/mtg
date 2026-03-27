import { findCardByName, autocomplete } from './scryfall'

/**
 * Card Recognition Service
 *
 * Two-stage pipeline:
 * 1. OCR stage: Extract text from camera frame using browser OCR
 * 2. Match stage: Fuzzy-match extracted text against Scryfall's database
 *
 * For perceptual hash matching (future/offline mode), the bulk data
 * download from Scryfall provides unique_artwork entries that can be
 * hashed with pHash/dHash and stored in IndexedDB.
 */

// ── OCR Text Extraction ──────────────────────────────────────────────

/**
 * Extract card name text from a video frame using the browser's
 * native OCR capabilities (Shape Detection API or Tesseract.js fallback).
 */
export async function extractTextFromFrame(videoElement) {
  const canvas = document.createElement('canvas')
  canvas.width = videoElement.videoWidth
  canvas.height = videoElement.videoHeight
  const ctx = canvas.getContext('2d')
  ctx.drawImage(videoElement, 0, 0)

  // Try native TextDetector API first (Chrome/Edge)
  if ('TextDetector' in window) {
    try {
      const detector = new window.TextDetector()
      const texts = await detector.detect(canvas)
      if (texts.length > 0) {
        return extractCardNameFromTexts(texts.map(t => t.rawValue))
      }
    } catch {
      // Fall through to manual extraction
    }
  }

  // Fallback: return the image data for server-side processing
  // or Tesseract.js integration
  return {
    rawTexts: [],
    candidateName: null,
    imageData: canvas.toDataURL('image/jpeg', 0.8),
  }
}

/**
 * Given an array of detected text strings from a card image,
 * identify the most likely card name.
 *
 * MTG card layout: the name is always in the top-left area,
 * typically the first or largest text block detected.
 */
function extractCardNameFromTexts(texts) {
  // Filter out common non-name text (mana symbols, set info, etc.)
  const filtered = texts.filter(t => {
    const clean = t.trim()
    if (clean.length < 2) return false
    if (/^\d+\/\d+$/.test(clean)) return false // power/toughness
    if (/^\{.*\}$/.test(clean)) return false // mana symbols
    if (/^©/.test(clean)) return false // copyright
    return true
  })

  return {
    rawTexts: texts,
    candidateName: filtered[0] || null,
    imageData: null,
  }
}

// ── Card Matching ─────────────────────────────────────────────────────

/**
 * Full recognition pipeline: take a candidate name (from OCR) and
 * resolve it to a Scryfall card using fuzzy matching.
 *
 * Returns { card, confidence, alternatives }
 */
export async function recognizeCard(candidateName) {
  if (!candidateName || candidateName.trim().length < 2) {
    return { card: null, confidence: 0, alternatives: [] }
  }

  const cleaned = cleanOcrText(candidateName)

  // Try exact match first (fastest, highest confidence)
  const exactMatch = await findCardByName(cleaned, { exact: true })
  if (exactMatch) {
    return { card: exactMatch, confidence: 1.0, alternatives: [] }
  }

  // Try fuzzy match (handles OCR errors)
  const fuzzyMatch = await findCardByName(cleaned, { exact: false })
  if (fuzzyMatch) {
    const confidence = calculateConfidence(cleaned, fuzzyMatch.name)
    return { card: fuzzyMatch, confidence, alternatives: [] }
  }

  // Try autocomplete for partial matches
  const suggestions = await autocomplete(cleaned)
  if (suggestions.length > 0) {
    const bestMatch = await findCardByName(suggestions[0], { exact: true })
    if (bestMatch) {
      const confidence = calculateConfidence(cleaned, bestMatch.name)
      const altCards = await Promise.all(
        suggestions.slice(1, 4).map(name => findCardByName(name, { exact: true }))
      )
      return {
        card: bestMatch,
        confidence: Math.max(0.3, confidence),
        alternatives: altCards.filter(Boolean),
      }
    }
  }

  return { card: null, confidence: 0, alternatives: [] }
}

/**
 * Clean OCR artifacts from extracted text.
 */
function cleanOcrText(text) {
  return text
    .replace(/[^a-zA-Z0-9\s',\-]/g, '') // Remove special chars
    .replace(/\s+/g, ' ')                // Normalize whitespace
    .trim()
}

/**
 * Calculate a confidence score between 0 and 1 based on how closely
 * the OCR text matches the resolved card name.
 */
function calculateConfidence(ocrText, cardName) {
  const a = ocrText.toLowerCase()
  const b = cardName.toLowerCase()

  if (a === b) return 1.0

  // Levenshtein-based similarity
  const distance = levenshtein(a, b)
  const maxLen = Math.max(a.length, b.length)
  const similarity = 1 - distance / maxLen

  // Boost if OCR text is a substring of the card name
  if (b.includes(a) || a.includes(b)) {
    return Math.min(1.0, similarity + 0.2)
  }

  return Math.max(0, similarity)
}

function levenshtein(a, b) {
  const m = a.length
  const n = b.length
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0))

  for (let i = 0; i <= m; i++) dp[i][0] = i
  for (let j = 0; j <= n; j++) dp[0][j] = j

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1])
    }
  }

  return dp[m][n]
}

// ── Perceptual Hash Matching (Offline Mode) ──────────────────────────

/**
 * Compute a difference hash (dHash) from an image.
 * This produces a 64-bit hash that is robust to:
 * - Scaling, minor rotations, brightness changes
 * - JPEG compression artifacts
 * - Slight color shifts (foil cards)
 *
 * The hash works by comparing adjacent pixel intensities,
 * making it invariant to overall brightness/contrast.
 */
export function computeDHash(imageData, hashSize = 8) {
  // Resize to (hashSize+1) x hashSize grayscale
  const canvas = document.createElement('canvas')
  canvas.width = hashSize + 1
  canvas.height = hashSize
  const ctx = canvas.getContext('2d')

  // Draw image scaled down
  ctx.drawImage(imageData, 0, 0, hashSize + 1, hashSize)
  const pixels = ctx.getImageData(0, 0, hashSize + 1, hashSize).data

  // Convert to grayscale and compute horizontal gradient
  const hash = []
  for (let y = 0; y < hashSize; y++) {
    for (let x = 0; x < hashSize; x++) {
      const leftIdx = (y * (hashSize + 1) + x) * 4
      const rightIdx = (y * (hashSize + 1) + x + 1) * 4

      const leftGray = pixels[leftIdx] * 0.299 + pixels[leftIdx + 1] * 0.587 + pixels[leftIdx + 2] * 0.114
      const rightGray = pixels[rightIdx] * 0.299 + pixels[rightIdx + 1] * 0.587 + pixels[rightIdx + 2] * 0.114

      hash.push(leftGray < rightGray ? 1 : 0)
    }
  }

  return hash
}

/**
 * Calculate Hamming distance between two dHash values.
 * Lower distance = more similar images.
 * Typically, distance < 10 means the same card art.
 */
export function hammingDistance(hash1, hash2) {
  let distance = 0
  for (let i = 0; i < hash1.length; i++) {
    if (hash1[i] !== hash2[i]) distance++
  }
  return distance
}

/**
 * Convert a hash array to a hex string for compact storage.
 */
export function hashToHex(hash) {
  let hex = ''
  for (let i = 0; i < hash.length; i += 4) {
    const nibble = (hash[i] << 3) | (hash[i + 1] << 2) | (hash[i + 2] << 1) | hash[i + 3]
    hex += nibble.toString(16)
  }
  return hex
}

/**
 * Convert a hex string back to a hash array.
 */
export function hexToHash(hex) {
  const hash = []
  for (const char of hex) {
    const nibble = parseInt(char, 16)
    hash.push((nibble >> 3) & 1, (nibble >> 2) & 1, (nibble >> 1) & 1, nibble & 1)
  }
  return hash
}
