import { ref, watch } from 'vue'

const STORAGE_KEY = 'bookiosk-my-shelf'

function loadShelf() {
  try {
    return JSON.parse(
      localStorage.getItem(STORAGE_KEY) || '[]'
    )
  } catch {
    return []
  }
}

const savedBooks = ref(loadShelf())

watch(
  savedBooks,
  (books) => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(books)
    )
  },
  { deep: true }
)

export function useMyShelf() {
  function addBook(book) {
    const exists = savedBooks.value.some(
      item => item.id === book.id
    )

    if (!exists) {
      savedBooks.value.push(book)
    }
  }

  function removeBook(id) {
    savedBooks.value = savedBooks.value.filter(
      book => book.id !== id
    )
  }

  function isSaved(id) {
    return savedBooks.value.some(
      book => book.id === id
    )
  }

  function toggleBook(book) {
    if (isSaved(book.id)) {
      removeBook(book.id)
    } else {
      addBook(book)
    }
  }

  return {
    savedBooks,
    addBook,
    removeBook,
    isSaved,
    toggleBook
  }
}