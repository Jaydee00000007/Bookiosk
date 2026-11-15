import { ref, watch } from 'vue'

const STORAGE_KEY = 'bookiosk-book-views'

function loadViews() {
  try {
    const storedViews = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')

    return Array.isArray(storedViews)
      ? storedViews.filter(view =>
          typeof view.id === 'string' &&
          Number.isInteger(view.count) &&
          view.count > 0
        )
      : []
  } catch {
    return []
  }
}

const bookViews = ref(loadViews())

watch(
  bookViews,
  (views) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(views))
  },
  { deep: true, flush: 'sync' }
)

export function recordBookView(bookId) {
  if (typeof bookId !== 'string' || !bookId) {
    return
  }

  const existingView = bookViews.value.find(view => view.id === bookId)

  if (existingView) {
    existingView.count++
  } else {
    bookViews.value.push({ id: bookId, count: 1 })
  }
}

export function getMostViewedBookId() {
  return bookViews.value.reduce(
    (mostViewed, view) => view.count > (mostViewed?.count || 0)
      ? view
      : mostViewed,
    null
  )?.id || null
}
