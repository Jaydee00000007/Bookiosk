import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('../firebase', () => ({
  firebaseAuthRequest: vi.fn(),
}))

import { firebaseAuthRequest } from '../firebase'
import { useFirebaseAuth } from '../firebaseAuth'

describe('Firebase auth state', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
    vi.clearAllMocks()
  })

  it('normalizes sign-in credentials and stores the returned user', async () => {
    firebaseAuthRequest.mockResolvedValue({
      localId: 'reader-1',
      email: 'reader@example.com',
      displayName: 'A Reader',
      idToken: 'id-token',
      refreshToken: 'refresh-token',
      expiresIn: '3600',
    })

    const auth = useFirebaseAuth()
    const user = await auth.signIn({
      email: '  Reader@Example.com ',
      password: 'reader-password',
      keepSignedIn: true,
    })

    expect(firebaseAuthRequest).toHaveBeenCalledWith('signin', {
      email: 'reader@example.com',
      password: 'reader-password',
      returnSecureToken: true,
    })
    expect(user.displayName).toBe('A Reader')
    expect(JSON.parse(localStorage.getItem('bookiosk-firebase-user')).uid).toBe('reader-1')
  })

  it('clears both persisted stores when signing out', () => {
    localStorage.setItem('bookiosk-firebase-user', JSON.stringify({ uid: 'reader-1' }))
    sessionStorage.setItem('bookiosk-firebase-user', JSON.stringify({ uid: 'reader-1' }))

    const auth = useFirebaseAuth()
    auth.signOut()

    expect(auth.currentUser.value).toBeNull()
    expect(localStorage.getItem('bookiosk-firebase-user')).toBeNull()
    expect(sessionStorage.getItem('bookiosk-firebase-user')).toBeNull()
  })
})
