import type { QueryKey, UseQueryOptions } from '@tanstack/react-query'
import type { Auth, AuthError, User } from 'firebase/auth'
import { GetVariation } from './types'
import { useAuthSubscription } from './useAuthSubscription'
import { useObserver } from './useObserver'

export function useAuth<Fn extends GetVariation>({
  queryKey,
  queryFn,
  options,
}: {
  queryKey: QueryKey
  queryFn: Fn
  options?: UseQueryOptions<User | null, AuthError>
}) {
  const type = 'auth'
  const auth = queryFn() as unknown as Auth
  const subscribe = useAuthSubscription(auth)

  return useObserver<typeof queryFn, 'auth', AuthError>({
    queryKey,
    queryFn,
    type,
    subscribe,
    options,
  })
}
