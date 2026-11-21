import { ref, watchEffect, toValue } from 'vue'

const cache = new Map()
const inFlightRequests = new Map()

const DEFAULT_TTL = 6 * 60 * 60 * 1000
const SESSION_CACHE_PREFIX = 'bookiosk:google-books:'
const MAX_SESSION_CACHE_ENTRIES = 40
const DEFAULT_API_BASE_URL = 'https://www.googleapis.com/books/v1'
const PRODUCTION_API_BASE_URL = '/api/books'

function getApiBaseUrl() {
  const configuredUrl = import.meta.env.VITE_API_BASE_URL?.trim()

  if (configuredUrl) return configuredUrl.replace(/\/+$/, '')
  if (import.meta.env.PROD) return PRODUCTION_API_BASE_URL
  return DEFAULT_API_BASE_URL
}

function getApiKey() {
  // The browser key is only used for local development. Production requests
  // go through /api/books, which reads GOOGLE_BOOKS_API_KEY on the server.
  if (import.meta.env.PROD) return ''
  return import.meta.env.VITE_GOOGLE_BOOKS_API_KEY?.trim()
}

function buildApiUrl(path) {
  const baseUrl = getApiBaseUrl()
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  const url = new URL(`${baseUrl}${normalizedPath}`, window.location.origin)
  const apiKey = getApiKey()

  if (apiKey) url.searchParams.set('key', apiKey)
  return url
}

function getCacheKey(url) {
  const cacheUrl = new URL(url)
  cacheUrl.searchParams.delete('key')
  return cacheUrl.toString()
}

function readSessionCache(cacheKey, ttl) {
  if (typeof window === 'undefined') return null
  try {
    const stored = window.sessionStorage.getItem(SESSION_CACHE_PREFIX + encodeURIComponent(cacheKey))
    if (!stored) return null
    const entry = JSON.parse(stored)
    if (!entry || Date.now() - entry.timestamp >= ttl) {
      window.sessionStorage.removeItem(SESSION_CACHE_PREFIX + encodeURIComponent(cacheKey))
      return null
    }
    return entry.data
  } catch {
    return null
  }
}

function writeSessionCache(cacheKey, data) {
  if (typeof window === 'undefined') return
  try {
    const storageKey = SESSION_CACHE_PREFIX + encodeURIComponent(cacheKey)
    window.sessionStorage.setItem(storageKey, JSON.stringify({ data, timestamp: Date.now() }))
    const keys = []
    for (let index = 0; index < window.sessionStorage.length; index++) {
      const key = window.sessionStorage.key(index)
      if (key?.startsWith(SESSION_CACHE_PREFIX)) keys.push(key)
    }
    while (keys.length > MAX_SESSION_CACHE_ENTRIES) {
      window.sessionStorage.removeItem(keys.shift())
    }
  } catch {
    // Browser storage is an optional optimization.
  }
}

function getCachedResponse(cacheKey, ttl) {
  const memoryEntry = cache.get(cacheKey)
  if (memoryEntry && Date.now() - memoryEntry.timestamp < ttl) return memoryEntry.data
  if (memoryEntry) cache.delete(cacheKey)
  const sessionData = readSessionCache(cacheKey, ttl)
  if (sessionData !== null) {
    cache.set(cacheKey, { data: sessionData, timestamp: Date.now() })
    return sessionData
  }
  return null
}

function setCachedResponse(cacheKey, data) {
  cache.set(cacheKey, { data, timestamp: Date.now() })
  writeSessionCache(cacheKey, data)
}

function getApiErrorMessage(status, statusText, body) {
  const message = body?.error?.message || ''
  const reasons = body?.error?.errors?.map(item => item.reason).join(' ') || ''
  const details = `${message} ${reasons}`.toLowerCase()

  if (details.includes('quota') || details.includes('dailylimitexceeded') || details.includes('userratelimitexceeded')) {
    return 'Book search is temporarily unavailable because the Google Books request limit has been reached. Please try again later.'
  }
  return message || `Google Books API error: ${status} ${statusText}`
}

async function requestBooks(url, options = {}) {
  const { ttl = DEFAULT_TTL, ...fetchOptions } = options
  const cacheKey = getCacheKey(url)
  const cachedData = getCachedResponse(cacheKey, ttl)
  if (cachedData !== null) return cachedData

  const existingRequest = inFlightRequests.get(cacheKey)
  if (existingRequest) return existingRequest

  const request = (async () => {
    const response = await fetch(url, fetchOptions)
    let body
    try {
      body = await response.json()
    } catch {
      body = null
    }
    if (!response.ok) throw new Error(getApiErrorMessage(response.status, response.statusText, body))
    setCachedResponse(cacheKey, body)
    return body
  })()

  inFlightRequests.set(cacheKey, request)
  try {
    return await request
  } finally {
    inFlightRequests.delete(cacheKey)
  }
}

export async function searchBooks(query, options = {}) {
  const normalizedQuery = query?.trim()
  if (!normalizedQuery) throw new Error('Enter a book title, author, or ISBN to search')

  const url = buildApiUrl('/volumes')
  url.searchParams.set('q', normalizedQuery)
  url.searchParams.set('maxResults', String(options.maxResults ?? 20))
  if (options.orderBy) url.searchParams.set('orderBy', options.orderBy)
  if (options.filter) url.searchParams.set('filter', options.filter)
  if (options.startIndex !== undefined) url.searchParams.set('startIndex', String(options.startIndex))

  const result = await requestBooks(url)
  return result.items || []
}

export function useFetch(urlPathFactory, options = {}) {
  const data = ref(null)
  const error = ref(null)
  const loading = ref(true)
  const updater = ref(0)
  const lastCacheKey = ref(null)

  watchEffect(async (onCleanup) => {
    updater.value
    const path = toValue(urlPathFactory)
    const { ttl = DEFAULT_TTL, ...fetchOptions } = toValue(options)
    const url = buildApiUrl(path)
    const cacheKey = getCacheKey(url)
    const cachedData = getCachedResponse(cacheKey, ttl)

    if (cachedData !== null) {
      data.value = cachedData
      error.value = null
      loading.value = false
      lastCacheKey.value = cacheKey
      return
    }

    loading.value = true
    error.value = null
    const controller = new AbortController()
    onCleanup(() => controller.abort())

    try {
      const result = await requestBooks(url, { ...fetchOptions, signal: controller.signal, ttl })
      if (!controller.signal.aborted) {
        lastCacheKey.value = cacheKey
        data.value = result
      }
    } catch (err) {
      if (err.name !== 'AbortError') error.value = err.message || 'Something went wrong fetching books'
    } finally {
      if (!controller.signal.aborted) loading.value = false
    }
  })

  function refetch() {
    if (lastCacheKey.value) {
      cache.delete(lastCacheKey.value)
      if (typeof window !== 'undefined') {
        try {
          window.sessionStorage.removeItem(SESSION_CACHE_PREFIX + encodeURIComponent(lastCacheKey.value))
        } catch {
          // Ignore unavailable browser storage.
        }
      }
    }
    updater.value++
  }

  return { data, error, loading, refetch }
}

export const getNewReleases = () => searchBooks('African literature', { orderBy: 'newest', maxResults: 12 })
export const getFreeBooks = () => searchBooks('African literature', { filter: 'free-ebooks', maxResults: 12 })

export async function getBookById(id) {
  if (!id) throw new Error('Book ID is required')
  return requestBooks(buildApiUrl(`/volumes/${encodeURIComponent(id)}`))
}

export function getReadingAccess(book) {
  const access = book.accessInfo || {}
  return {
    viewability: access.viewability,
    embeddable: access.embeddable,
    publicDomain: access.publicDomain,
    canReadAll: access.viewability === 'ALL_PAGES',
    canPreview: access.viewability === 'PARTIAL',
    readerLink: access.webReaderLink
  }
}
