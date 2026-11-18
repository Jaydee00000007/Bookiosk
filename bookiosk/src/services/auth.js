function getAuthApiBaseUrl() {
  const configuredUrl = import.meta.env.VITE_AUTH_API_BASE_URL?.trim()
  return (configuredUrl || '/api').replace(/\/+$/, '')
}

async function postAuth(path, payload) {
  let response

  try {
    response = await fetch(`${getAuthApiBaseUrl()}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
  } catch {
    throw new Error('Could not reach Bookiosk. Check your connection and try again.')
  }

  let body

  try {
    body = await response.json()
  } catch {
    body = null
  }

  if (!response.ok) {
    throw new Error(body?.message || 'We could not complete that request. Please try again.')
  }

  return body
}

export function signIn(credentials) {
  return postAuth('/auth/signin', credentials)
}

export function signUp(details) {
  return postAuth('/auth/signup', details)
}
