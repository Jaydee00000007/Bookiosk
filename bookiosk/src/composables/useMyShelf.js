import { ref, watch } from 'vue'
import { useFirebaseAuth } from '../services/firebaseAuth'
import { firestoreRequest } from '../services/firebase'

const GUEST_STORAGE_KEY = 'bookiosk-my-shelf:guest'
const { currentUser, getIdToken } = useFirebaseAuth()
const savedBooks = ref(loadShelf(GUEST_STORAGE_KEY))
const syncing = ref(false)
const syncError = ref('')
let activeUid = null

function loadShelf(key) {
  try { return JSON.parse(localStorage.getItem(key) || '[]') }
  catch { return [] }
}
function storageKey() {
  return activeUid ? `bookiosk-my-shelf:${activeUid}` : GUEST_STORAGE_KEY
}
function persistLocal() {
  localStorage.setItem(storageKey(), JSON.stringify(savedBooks.value))
}
function fromFirestore(document) {
  const encoded = document.fields?.bookJson?.stringValue
  if (!encoded) return null
  try { return JSON.parse(encoded) } catch { return null }
}
async function loadCloudShelf() {
  const user = currentUser.value
  if (!user?.uid) return
  syncing.value = true
  syncError.value = ''
  try {
    const token = await getIdToken()
    const result = await firestoreRequest(`users/${user.uid}/shelf`, { token })
    activeUid = user.uid
    savedBooks.value = (result.documents || []).map(fromFirestore).filter(Boolean)
    persistLocal()
  } catch (error) {
    syncError.value = error.message || 'Could not sync your shelf.'
    console.error('Could not load cloud shelf:', error)
  } finally { syncing.value = false }
}
watch(currentUser, user => {
  if (user) void loadCloudShelf()
  else {
    activeUid = null
    savedBooks.value = loadShelf(GUEST_STORAGE_KEY)
  }
}, { immediate: true })
watch(savedBooks, persistLocal, { deep: true })

async function saveCloudBook(book) {
  const user = currentUser.value
  if (!user?.uid) return
  const token = await getIdToken()
  await firestoreRequest(`users/${user.uid}/shelf?documentId=${encodeURIComponent(String(book.id))}`, {
    method: 'POST', token,
    body: { fields: { bookJson: { stringValue: JSON.stringify(book) } } },
  })
}
async function deleteCloudBook(id) {
  const user = currentUser.value
  if (!user?.uid) return
  const token = await getIdToken()
  await firestoreRequest(`users/${user.uid}/shelf/${encodeURIComponent(String(id))}`, { method: 'DELETE', token })
}
function addBook(book) {
  if (savedBooks.value.some(item => item.id === book.id)) return
  savedBooks.value.push(book)
  if (currentUser.value) void saveCloudBook(book).catch(error => { syncError.value = error.message })
}
function removeBook(id) {
  savedBooks.value = savedBooks.value.filter(book => book.id !== id)
  if (currentUser.value) void deleteCloudBook(id).catch(error => { syncError.value = error.message })
}
function isSaved(id) { return savedBooks.value.some(book => book.id === id) }
function toggleBook(book) { isSaved(book.id) ? removeBook(book.id) : addBook(book) }

export function useMyShelf() {
  return { savedBooks, syncing, syncError, addBook, removeBook, isSaved, toggleBook, refreshShelf: loadCloudShelf }
}
