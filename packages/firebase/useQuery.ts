import type { QueryKey } from '@tanstack/react-query'
import { getRef } from './utils'
import { useObserver } from './useObserver'
import { useQuerySubscription } from './useQuerySubscription'
import { ObserverType, QueryAdapter } from './types'

export function useQuery<FetchFn extends QueryAdapter>({
  queryKey,
  queryFn,
}: {
  queryKey: QueryKey
  queryFn: FetchFn
}) {
  const type: ObserverType = 'query'
  const ref = getRef<FetchFn, typeof type>(queryFn, queryKey)
  const subscribe = useQuerySubscription(ref)

  return useObserver({
    queryKey,
    queryFn,
    type,
    subscribe,
  })
}
