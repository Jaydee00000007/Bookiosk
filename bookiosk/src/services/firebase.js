const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

export const firebaseReady = Object.values(firebaseConfig).every(Boolean)
export const firebaseProjectId = firebaseConfig.projectId
export const firebaseApiKey = firebaseConfig.apiKey

export function requireFirebaseConfig() {
  if (!firebaseReady) {
    throw new Error('Firebase is not configured. Add the VITE_FIREBASE_* environment variables in Vercel and your local .env file.')
  }
}

export async function firebaseAuthRequest(method, payload) {
  requireFirebaseConfig()
  const endpoint = {
    signup: 'accounts:signUp',
    signin: 'accounts:signInWithPassword',
    reset: 'accounts:sendOobCode',
    refresh: null,
  }[method]

  const url = method === 'refresh'
    ? `https://securetoken.googleapis.com/v1/token?key=${firebaseApiKey}`
    : `https://identitytoolkit.googleapis.com/v1/${endpoint}?key=${firebaseApiKey}`

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': method === 'refresh' ? 'application/x-www-form-urlencoded' : 'application/json' },
    body: method === 'refresh' ? new URLSearchParams(payload) : JSON.stringify(payload),
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    const messages = {
      EMAIL_EXISTS: 'An account already exists with this email.',
      INVALID_LOGIN_CREDENTIALS: 'The email or password is incorrect.',
      EMAIL_NOT_FOUND: 'No account was found with this email.',
      INVALID_PASSWORD: 'The password is incorrect.',
      WEAK_PASSWORD: 'Choose a stronger password (at least 8 characters).',
      TOO_MANY_ATTEMPTS_TRY_LATER: 'Too many attempts. Please wait a little and try again.',
    }
    const code = data.error?.message?.split(' : ')[0] || data.error?.message
    throw new Error(messages[code] || data.error?.message || 'Firebase authentication failed.')
  }
  return data
}

export async function firestoreRequest(path, { method = 'GET', token, body } = {}) {
  requireFirebaseConfig()
  const response = await fetch(`https://firestore.googleapis.com/v1/projects/${firebaseProjectId}/databases/(default)/documents/${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data.error?.message || 'Could not sync your reading data.')
  return data
}
