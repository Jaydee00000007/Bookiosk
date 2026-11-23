import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

describe('firebaseAuthRequest', () => {
  beforeEach(() => {
    vi.stubEnv('VITE_FIREBASE_API_KEY', 'test-api-key')
    vi.stubEnv('VITE_FIREBASE_AUTH_DOMAIN', 'test.firebaseapp.com')
    vi.stubEnv('VITE_FIREBASE_PROJECT_ID', 'test-project')
    vi.stubEnv('VITE_FIREBASE_APP_ID', 'test-app-id')
    vi.resetModules()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.unstubAllEnvs()
  })

  it('posts a sign-in request to Firebase', async () => {
    const { firebaseAuthRequest } = await import('../firebase')
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ idToken: 'token' }),
    })
    vi.stubGlobal('fetch', fetchMock)

    await firebaseAuthRequest('signin', { email: 'reader@example.com', password: 'password', returnSecureToken: true })

    expect(fetchMock).toHaveBeenCalledOnce()
    expect(fetchMock.mock.calls[0][0]).toContain('accounts:signInWithPassword')
    expect(fetchMock.mock.calls[0][1]).toMatchObject({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    })
  })

  it('maps Firebase error codes to readable messages', async () => {
    const { firebaseAuthRequest } = await import('../firebase')
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: { message: 'EMAIL_EXISTS' } }),
    }))

    await expect(firebaseAuthRequest('signup', {}))
      .rejects.toThrow('An account already exists with this email.')
  })
})
