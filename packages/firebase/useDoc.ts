import type { QueryKey } from '@tanstack/react-query'
import type { QueryAdapter, ObserverType } from './types'
import { getRef } from './utils'
import { useObserver } from './useObserver'
import { useSubscription } from './useSubscription'

export function useDoc<FetchFn extends QueryAdapter>({
  queryKey,
  queryFn,
}: {
  queryKey: QueryKey
  queryFn: FetchFn
}) {
  const type: ObserverType = 'doc'
  const ref = getRef<FetchFn, typeof type>(queryFn, queryKey)
  const subscribe = useSubscription(ref)

  return useObserver({
    queryKey,
    queryFn,
    type,
    subscribe,
  })
}
