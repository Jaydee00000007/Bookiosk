import { ref } from 'vue'
import { firebaseAuthRequest } from './firebase'

const USER_KEY = 'bookiosk-firebase-user'
function readUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY) || 'null')
  } catch { return null }
}
const currentUser = ref(readUser())

function persistUser(user, keepSignedIn = true) {
  currentUser.value = user
  localStorage.removeItem(USER_KEY)
  sessionStorage.removeItem(USER_KEY)
  ;(keepSignedIn ? localStorage : sessionStorage).setItem(USER_KEY, JSON.stringify(user))
  return user
}
function storeUser(data, displayName = '', keepSignedIn = true) {
  return persistUser({
    uid: data.localId, email: data.email, displayName: displayName || data.displayName || '',
    idToken: data.idToken, refreshToken: data.refreshToken,
    expiresAt: Date.now() + Number(data.expiresIn || 3600) * 1000,
  }, keepSignedIn)
}

export function useFirebaseAuth() {
  async function signUp({ name, email, password }) {
    const data = await firebaseAuthRequest('signup', {
      email: email.trim().toLowerCase(), password, displayName: name.trim(), returnSecureToken: true,
    })
    return storeUser(data, name)
  }
  async function signIn({ email, password, keepSignedIn = true }) {
    const data = await firebaseAuthRequest('signin', {
      email: email.trim().toLowerCase(), password, returnSecureToken: true,
    })
    return storeUser(data, data.displayName || '', keepSignedIn)
  }
  async function sendPasswordReset(email) {
    return firebaseAuthRequest('reset', { requestType: 'PASSWORD_RESET', email: email.trim().toLowerCase() })
  }
  async function getIdToken() {
    const user = currentUser.value
    if (!user?.refreshToken) return null
    if (user.idToken && user.expiresAt > Date.now() + 60000) return user.idToken
    const data = await firebaseAuthRequest('refresh', { grant_type: 'refresh_token', refresh_token: user.refreshToken })
    const updated = { ...user, idToken: data.id_token, refreshToken: data.refresh_token || user.refreshToken, expiresAt: Date.now() + Number(data.expires_in || 3600) * 1000 }
    persistUser(updated, Boolean(localStorage.getItem(USER_KEY)))
    return updated.idToken
  }
  function signOut() {
    currentUser.value = null
    localStorage.removeItem(USER_KEY)
    sessionStorage.removeItem(USER_KEY)
  }
  return { currentUser, signUp, signIn, sendPasswordReset, getIdToken, signOut }
}
