const BASE_URL = 'https://api.scryfall.com'
const USER_AGENT = 'TheArchive/1.0 (MTG Accessibility Companion)'
const REQUEST_DELAY_MS = 100

let lastRequestTime = 0

async function rateLimitedFetch(url) {
  const now = Date.now()
  const elapsed = now - lastRequestTime
  if (elapsed < REQUEST_DELAY_MS) {
    await new Promise(resolve => setTimeout(resolve, REQUEST_DELAY_MS - elapsed))
  }
  lastRequestTime = Date.now()

  const response = await fetch(url, {
    headers: { 'User-Agent': USER_AGENT },
  })

  if (response.status === 429) {
    // Rate limited — wait and retry once
    await new Promise(resolve => setTimeout(resolve, 1000))
    lastRequestTime = Date.now()
    return fetch(url, { headers: { 'User-Agent': USER_AGENT } })
  }

  return response
}

/**
 * Fuzzy search for a card by name.
 * This is the primary lookup path after OCR extracts text from a card.
 * Scryfall handles misspellings, partial names, and abbreviations.
 */
export async function findCardByName(name, { exact = false } = {}) {
  const param = exact ? 'exact' : 'fuzzy'
  const url = `${BASE_URL}/cards/named?${param}=${encodeURIComponent(name)}`
  const response = await rateLimitedFetch(url)

  if (!response.ok) {
    if (response.status === 404) return null
    throw new Error(`Scryfall API error: ${response.status}`)
  }

  return normalizeCard(await response.json())
}

/**
 * Search cards with Scryfall query syntax.
 * Useful for broader searches (e.g., by set, type, color).
 */
export async function searchCards(query, { page = 1 } = {}) {
  const url = `${BASE_URL}/cards/search?q=${encodeURIComponent(query)}&page=${page}`
  const response = await rateLimitedFetch(url)

  if (!response.ok) {
    if (response.status === 404) return { cards: [], hasMore: false, totalCards: 0 }
    throw new Error(`Scryfall API error: ${response.status}`)
  }

  const data = await response.json()
  return {
    cards: data.data.map(normalizeCard),
    hasMore: data.has_more,
    totalCards: data.total_cards,
    nextPage: data.has_more ? page + 1 : null,
  }
}

/**
 * Get autocomplete suggestions for partial card names.
 * Returns up to 20 name strings. Fast and lightweight.
 */
export async function autocomplete(partialName) {
  const url = `${BASE_URL}/cards/autocomplete?q=${encodeURIComponent(partialName)}`
  const response = await rateLimitedFetch(url)

  if (!response.ok) return []

  const data = await response.json()
  return data.data // array of name strings
}

/**
 * Look up a card by set code and collector number.
 * Useful when OCR can also read the set symbol or collector info.
 */
export async function findCardBySetAndNumber(setCode, collectorNumber) {
  const url = `${BASE_URL}/cards/${encodeURIComponent(setCode)}/${encodeURIComponent(collectorNumber)}`
  const response = await rateLimitedFetch(url)

  if (!response.ok) {
    if (response.status === 404) return null
    throw new Error(`Scryfall API error: ${response.status}`)
  }

  return normalizeCard(await response.json())
}

/**
 * Batch lookup up to 75 cards at once.
 * Each identifier can be { name }, { set, collector_number }, { id }, etc.
 */
export async function lookupCollection(identifiers) {
  const url = `${BASE_URL}/cards/collection`
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': USER_AGENT,
    },
    body: JSON.stringify({ identifiers }),
  })

  if (!response.ok) {
    throw new Error(`Scryfall API error: ${response.status}`)
  }

  const data = await response.json()
  return {
    found: data.data.map(normalizeCard),
    notFound: data.not_found || [],
  }
}

/**
 * Get the URL for the bulk data download of unique artwork cards.
 * Use this to build an offline perceptual hash database.
 */
export async function getBulkDataUrl(type = 'unique_artwork') {
  const url = `${BASE_URL}/bulk-data`
  const response = await rateLimitedFetch(url)

  if (!response.ok) {
    throw new Error(`Scryfall API error: ${response.status}`)
  }

  const data = await response.json()
  const bulk = data.data.find(d => d.type === type)
  if (!bulk) throw new Error(`Bulk data type "${type}" not found`)

  return {
    downloadUri: bulk.download_uri,
    updatedAt: bulk.updated_at,
    size: bulk.size,
  }
}

/**
 * Normalize a Scryfall card object into our app's internal format.
 * Handles single-face and multi-face cards uniformly.
 */
function normalizeCard(raw) {
  const face = raw.card_faces?.[0]
  const imageUris = raw.image_uris || face?.image_uris || {}

  return {
    id: raw.id,
    oracleId: raw.oracle_id,
    name: raw.name,
    manaCost: raw.mana_cost || face?.mana_cost || '',
    cmc: raw.cmc,
    typeLine: raw.type_line || face?.type_line || '',
    oracleText: raw.oracle_text || face?.oracle_text || '',
    colors: raw.colors || face?.colors || [],
    colorIdentity: raw.color_identity || [],
    keywords: raw.keywords || [],
    power: raw.power || face?.power,
    toughness: raw.toughness || face?.toughness,
    loyalty: raw.loyalty || face?.loyalty,
    set: raw.set,
    setName: raw.set_name,
    collectorNumber: raw.collector_number,
    rarity: raw.rarity,
    artist: raw.artist,
    images: {
      small: imageUris.small,
      normal: imageUris.normal,
      large: imageUris.large,
      png: imageUris.png,
      artCrop: imageUris.art_crop,
      borderCrop: imageUris.border_crop,
    },
    legalities: raw.legalities || {},
    prices: raw.prices || {},
    scryfallUri: raw.scryfall_uri,
    // For multi-face cards, include all faces
    faces: raw.card_faces?.map(f => ({
      name: f.name,
      manaCost: f.mana_cost,
      typeLine: f.type_line,
      oracleText: f.oracle_text,
      power: f.power,
      toughness: f.toughness,
      loyalty: f.loyalty,
      images: f.image_uris ? {
        small: f.image_uris.small,
        normal: f.image_uris.normal,
        large: f.image_uris.large,
        artCrop: f.image_uris.art_crop,
      } : null,
    })) || null,
  }
}
