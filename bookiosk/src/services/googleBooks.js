import { ref, watchEffect, toValue } from 'vue'

const cache = new Map()
const DEFAULT_TTL = 10 * 60 * 1000 // Books don't change often, cache for 10 mins

export function useFetch(urlPathFactory, options = {}) {
  const data = ref(null)
  const error = ref(null)
  const loading = ref(true)
  const updater = ref(0) 

  watchEffect(async (onCleanup) => {
    updater.value

    const path = toValue(urlPathFactory)
    const { ttl = DEFAULT_TTL, ...fetchOptions } = toValue(options)

    const baseUrl = import.meta.env.VITE_API_BASE_URL
    const apiKey = import.meta.env.VITE_API_KEY

    // 1. Construct the Google Books URL pattern safely
    // Check if the path already has existing query parameters (like ?q=search)
    const connector = path.includes('?') ? '&' : '?'
    const fullUrl = `${baseUrl}${path}${connector}key=${apiKey}`

    const now = Date.now()

    // 2. Cache Interceptor
    if (cache.has(fullUrl)) {
      const cachedItem = cache.get(fullUrl)
      const isExpired = now - cachedItem.timestamp > ttl

      if (!isExpired) {
        data.value = cachedItem.data
        error.value = null
        loading.value = false
        return
      } else {
        cache.delete(fullUrl)
      }
    }

    loading.value = true
    data.value = null
    error.value = null

    const controller = new AbortController()
    onCleanup(() => controller.abort())

    try {
      const response = await fetch(fullUrl, {
        ...fetchOptions,
        signal: controller.signal
      })

      if (!response.ok) {
        throw new Error(`Google Books API Error! Status: ${response.status}`)
      }

      const result = await response.json()
      
      if (!controller.signal.aborted) {
        cache.set(fullUrl, {
          data: result,
          timestamp: Date.now()
        })
        data.value = result
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        error.value = err.message || 'Something went wrong fetching books'
      }
    } finally {
      if (!controller.signal.aborted) {
        loading.value = false
      }
    }
  })

  function refetch() {
    updater.value++
  }

  return { data, error, loading, refetch }
}
