import { useFirebaseAuth } from './firebaseAuth'

export async function signIn(credentials) {
  const { signIn: firebaseSignIn } = useFirebaseAuth()
  const user = await firebaseSignIn(credentials)
  return { user, message: 'You are signed in.' }
}
export async function signUp(details) {
  const { signUp: firebaseSignUp } = useFirebaseAuth()
  const user = await firebaseSignUp(details)
  if (details.genres?.length) localStorage.setItem('bookiosk-reading-preferences', JSON.stringify(details.genres))
  return { user, message: 'Your account has been created. Welcome to Bookiosk.' }
}
