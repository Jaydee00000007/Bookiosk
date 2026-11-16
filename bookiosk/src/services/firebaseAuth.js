import { ref } from 'vue'
import { firebaseAuthRequest } from './firebase'

const USER_KEY = 'bookiosk-firebase-user'
const currentUser = ref(readUser())

function readUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) || 'null')
  } catch {
    return null
  }
}

function storeUser(data) {
  const user = {
    uid: data.localId,
    email: data.email,
    displayName: data.displayName || '',
    idToken: data.idToken,
    refreshToken: data.refreshToken,
  }
  currentUser.value = user
  localStorage.setItem(USER_KEY, JSON.stringify(user))
  return user
}

export function useFirebaseAuth() {
  async function signUp({ name, email, password }) {
    const data = await firebaseAuthRequest('signup', {
      email: email.trim().toLowerCase(),
      password,
      returnSecureToken: true,
    })
    return storeUser({ ...data, displayName: name })
  }

  async function signIn({ email, password }) {
    const data = await firebaseAuthRequest('signin', {
      email: email.trim().toLowerCase(),
      password,
      returnSecureToken: true,
    })
    return storeUser(data)
  }

  async function sendPasswordReset(email) {
    return firebaseAuthRequest('reset', {
      requestType: 'PASSWORD_RESET',
      email: email.trim().toLowerCase(),
    })
  }

  function signOut() {
    currentUser.value = null
    localStorage.removeItem(USER_KEY)
  }

  return { currentUser, signUp, signIn, sendPasswordReset, signOut }
}
