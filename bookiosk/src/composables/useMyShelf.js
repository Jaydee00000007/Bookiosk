import { ref, watch } from 'vue'
import { useFirebaseAuth } from '../services/firebaseAuth'
import { firestoreRequest } from '../services/firebase'

const STORAGE_KEY = 'bookiosk-my-shelf'
const savedBooks = ref(loadShelf())
const { currentUser } = useFirebaseAuth()
const syncing = ref(false)

function loadShelf() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

function persistLocal() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(savedBooks.value))
}

function fromFirestore(document) {
  const encoded = document.fields?.bookJson?.stringValue
  if (!encoded) return null
  try { return JSON.parse(encoded) } catch { return null }
}

async function loadCloudShelf() {
  if (!currentUser.value?.uid || !currentUser.value?.idToken) return
  syncing.value = true
  try {
    const result = await firestoreRequest(`users/${currentUser.value.uid}/shelf`, { token: currentUser.value.idToken })
    savedBooks.value = (result.documents || []).map(fromFirestore).filter(Boolean)
    persistLocal()
  } catch (error) {
    console.error('Could not load the cloud shelf:', error)
  } finally {
    syncing.value = false
  }
}

watch(currentUser, user => {
  if (user) void loadCloudShelf()
}, { immediate: true })

watch(savedBooks, persistLocal, { deep: true })

async function saveCloudBook(book) {
  const user = currentUser.value
  if (!user?.uid || !user?.idToken) return
  const documentId = encodeURIComponent(String(book.id))
  await firestoreRequest(`users/${user.uid}/shelf?documentId=${documentId}`, {
    method: 'POST',
    token: user.idToken,
    body: { fields: { bookJson: { stringValue: JSON.stringify(book) } } },
  })
}

async function deleteCloudBook(id) {
  const user = currentUser.value
  if (!user?.uid || !user?.idToken) return
  await firestoreRequest(`users/${user.uid}/shelf/${encodeURIComponent(String(id))}`, {
    method: 'DELETE',
    token: user.idToken,
  })
}

export function useMyShelf() {
  function addBook(book) {
    if (savedBooks.value.some(item => item.id === book.id)) return
    savedBooks.value.push(book)
    if (currentUser.value) void saveCloudBook(book).catch(error => console.error('Could not save book to cloud:', error))
  }

  function removeBook(id) {
    savedBooks.value = savedBooks.value.filter(book => book.id !== id)
    if (currentUser.value) void deleteCloudBook(id).catch(error => console.error('Could not remove cloud book:', error))
  }

  function isSaved(id) {
    return savedBooks.value.some(book => book.id === id)
  }

  function toggleBook(book) {
    if (isSaved(book.id)) removeBook(book.id)
    else addBook(book)
  }

  return { savedBooks, syncing, addBook, removeBook, isSaved, toggleBook, refreshShelf: loadCloudShelf }
}
