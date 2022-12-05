import type { QueryKey, UseQueryOptions } from '@tanstack/react-query'
import { getRef } from './utils'
import { useObserver } from './useObserver'
import { useQuerySubscription } from './useQuerySubscription'
import { ObserverType, QueryAdapter, Return } from './types'

export function useQuery<FetchFn extends QueryAdapter>({
  queryKey,
  queryFn,
  options,
}: {
  queryKey: QueryKey
  queryFn: FetchFn
  options?: UseQueryOptions<Return<FetchFn, 'query'>, Error>
}) {
  const type: ObserverType = 'query'
  const ref = getRef<FetchFn, typeof type>(queryFn, queryKey)
  const subscribe = useQuerySubscription(ref)

  return useObserver({
    queryKey,
    queryFn,
    type,
    subscribe,
    options,
  })
}
