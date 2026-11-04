
import { ref, watchEffect, toValue } from 'vue'

const cache = new Map()

const DEFAULT_TTL = 10 * 60 * 1000
const DEFAULT_API_BASE_URL =
  'https://www.googleapis.com/books/v1'

function getApiBaseUrl() {
  const configuredUrl = import.meta.env.VITE_API_BASE_URL?.trim()

  return (
    (configuredUrl || DEFAULT_API_BASE_URL).replace(/\/+$/, '')
  )
}

function getApiKey() {
  return import.meta.env.VITE_GOOGLE_BOOKS_API_KEY?.trim()
}

function buildApiUrl(path) {
  const baseUrl = getApiBaseUrl()
  const normalizedPath = path.startsWith('/')
    ? path
    : `/${path}`

  const url = new URL(`${baseUrl}${normalizedPath}`)

  const apiKey = getApiKey()

  if (apiKey) {
    url.searchParams.set('key', apiKey)
  }

  return url
}

// Reusable API request
async function requestBooks(url, options = {}) {
  const response = await fetch(url, options)

  if (!response.ok) {
    let apiMessage = ''

    try {
      const body = await response.json()
      apiMessage = body.error?.message || ''
    } catch {
      apiMessage = ''
    }

    throw new Error(
      apiMessage ||
      `Google Books API error: ${response.status} ${response.statusText}`
    )
  }

  return response.json()
}

// Search books
export async function searchBooks(query, options = {}) {
  const normalizedQuery = query?.trim()

  if (!normalizedQuery) {
    throw new Error(
      'Enter a book title, author, or ISBN to search'
    )
  }

  const url = buildApiUrl('/volumes')

  url.searchParams.set('q', normalizedQuery)
  url.searchParams.set(
    'maxResults',
    String(options.maxResults ?? 20)
  )

  if (options.orderBy) {
    url.searchParams.set('orderBy', options.orderBy)
  }

  if (options.filter) {
    url.searchParams.set('filter', options.filter)
  }

  if (options.startIndex !== undefined) {
    url.searchParams.set(
      'startIndex',
      String(options.startIndex)
    )
  }

  const result = await requestBooks(url)
  return result.items || []
}

// Reusable reactive fetch composable
export function useFetch(urlPathFactory, options = {}) {
  const data = ref(null)
  const error = ref(null)
  const loading = ref(true)

  const updater = ref(0)
  const lastCacheKey = ref(null)

  watchEffect(async (onCleanup) => {
    updater.value

    const path = toValue(urlPathFactory)
    const {
      ttl = DEFAULT_TTL,
      ...fetchOptions
    } = toValue(options)

    const url = buildApiUrl(path)
    const fullUrl = url.toString()

    const now = Date.now()

    const cachedItem = cache.get(fullUrl)

    if (cachedItem && now - cachedItem.timestamp < ttl) {
      data.value = cachedItem.data
      error.value = null
      loading.value = false
      return
    }

    if (cachedItem) {
      cache.delete(fullUrl)
    }

    loading.value = true
    error.value = null

    const controller = new AbortController()

    onCleanup(() => controller.abort())

    try {
      const result = await requestBooks(url, {
        ...fetchOptions,
        signal: controller.signal
      })

      if (!controller.signal.aborted) {
        cache.set(fullUrl, {
          data: result,
          timestamp: Date.now()
        })

        lastCacheKey.value = fullUrl
        data.value = result
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        error.value =
          err.message || 'Something went wrong fetching books'
      }
    } finally {
      if (!controller.signal.aborted) {
        loading.value = false
      }
    }
  })

  function refetch() {
    if (lastCacheKey.value) {
      cache.delete(lastCacheKey.value)
    }

    updater.value++
  }

  return {
    data,
    error,
    loading,
    refetch
  }
}

export const getNewReleases = () =>
  searchBooks('African literature', {
    orderBy: 'newest',
    maxResults: 12
  })

export const getFreeBooks = () =>
  searchBooks('African literature', {
    filter: 'free-ebooks',
    maxResults: 12
  })

  export async function getBookById(id) {
  if (!id) {
    throw new Error('Book ID is required')
  }

  const url = buildApiUrl(
    `/volumes/${encodeURIComponent(id)}`
  )

  return requestBooks(url)
}