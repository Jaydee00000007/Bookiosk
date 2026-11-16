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
    throw new Error('Firebase is not configured. Add the VITE_FIREBASE_* values to your environment.')
  }
}

export async function firebaseAuthRequest(method, payload) {
  requireFirebaseConfig()
  const endpoint = method === 'signup' ? 'accounts:signUp' : method === 'signin' ? 'accounts:signInWithPassword' : 'accounts:sendOobCode'
  const response = await fetch(`https://identitytoolkit.googleapis.com/v1/${endpoint}?key=${firebaseApiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data.error?.message || 'Firebase authentication failed.')
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
