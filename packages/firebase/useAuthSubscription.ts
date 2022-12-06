import { useCallback } from 'react'
import type { Auth, User, AuthError } from 'firebase/auth'

export const useAuthSubscription = (auth: Auth) =>
  useCallback(
    (callback: (user: User | null) => void, onError: (error: AuthError) => void) => {
      return auth.onAuthStateChanged(
        (user) => callback(user),
        (error) => onError(error as AuthError),
      )
    },
    [auth],
  )
