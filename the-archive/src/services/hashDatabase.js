/**
 * IndexedDB-backed perceptual hash database for offline card matching.
 *
 * Stores dHash values from Scryfall's unique_artwork bulk data,
 * enabling camera-based card recognition without network access.
 *
 * Schema:
 *   cardHashes: { scryfallId, oracleId, name, hash (hex string), artCropUrl }
 *   metadata:   { key, value } — stores lastUpdated, version, etc.
 */

const DB_NAME = 'the-archive-hashes'
const DB_VERSION = 1

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onupgradeneeded = (event) => {
      const db = event.target.result
      if (!db.objectStoreNames.contains('cardHashes')) {
        const store = db.createObjectStore('cardHashes', { keyPath: 'scryfallId' })
        store.createIndex('name', 'name', { unique: false })
        store.createIndex('hash', 'hash', { unique: false })
      }
      if (!db.objectStoreNames.contains('metadata')) {
        db.createObjectStore('metadata', { keyPath: 'key' })
      }
    }

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

/**
 * Store a batch of card hashes into IndexedDB.
 */
export async function storeHashes(entries) {
  const db = await openDB()
  const tx = db.transaction('cardHashes', 'readwrite')
  const store = tx.objectStore('cardHashes')

  for (const entry of entries) {
    store.put(entry)
  }

  return new Promise((resolve, reject) => {
    tx.oncomplete = resolve
    tx.onerror = () => reject(tx.error)
  })
}

/**
 * Get the count of stored hashes.
 */
export async function getHashCount() {
  const db = await openDB()
  const tx = db.transaction('cardHashes', 'readonly')
  const store = tx.objectStore('cardHashes')

  return new Promise((resolve, reject) => {
    const req = store.count()
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

/**
 * Retrieve all hashes for brute-force matching.
 * For a ~30k unique artwork database, this is fast enough in-browser.
 * For larger sets, consider a VP-tree or multi-probe LSH.
 */
export async function getAllHashes() {
  const db = await openDB()
  const tx = db.transaction('cardHashes', 'readonly')
  const store = tx.objectStore('cardHashes')

  return new Promise((resolve, reject) => {
    const req = store.getAll()
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

/**
 * Find the closest matching card by hamming distance.
 */
export async function findClosestMatch(queryHash, { maxDistance = 10 } = {}) {
  const { hammingDistance, hexToHash } = await import('./cardRecognition')
  const allHashes = await getAllHashes()

  let bestMatch = null
  let bestDistance = Infinity

  for (const entry of allHashes) {
    const entryHash = hexToHash(entry.hash)
    const dist = hammingDistance(queryHash, entryHash)

    if (dist < bestDistance) {
      bestDistance = dist
      bestMatch = entry
    }
  }

  if (bestMatch && bestDistance <= maxDistance) {
    return {
      match: bestMatch,
      distance: bestDistance,
      confidence: 1 - bestDistance / 64, // 64-bit hash
    }
  }

  return null
}

/**
 * Store metadata (e.g., last bulk data update timestamp).
 */
export async function setMetadata(key, value) {
  const db = await openDB()
  const tx = db.transaction('metadata', 'readwrite')
  tx.objectStore('metadata').put({ key, value })

  return new Promise((resolve, reject) => {
    tx.oncomplete = resolve
    tx.onerror = () => reject(tx.error)
  })
}

/**
 * Retrieve metadata value.
 */
export async function getMetadata(key) {
  const db = await openDB()
  const tx = db.transaction('metadata', 'readonly')
  const req = tx.objectStore('metadata').get(key)

  return new Promise((resolve, reject) => {
    req.onsuccess = () => resolve(req.result?.value ?? null)
    req.onerror = () => reject(req.error)
  })
}

/**
 * Clear all stored hashes (for rebuilding the database).
 */
export async function clearHashes() {
  const db = await openDB()
  const tx = db.transaction('cardHashes', 'readwrite')
  tx.objectStore('cardHashes').clear()

  return new Promise((resolve, reject) => {
    tx.oncomplete = resolve
    tx.onerror = () => reject(tx.error)
  })
}
