import { QueryKey, UseQueryOptions } from '@tanstack/react-query'
import type { ObserverType, Return, GetVariation } from './types'
import { getRef } from './utils'
import { useObserver } from './useObserver'
import { useSubscription } from './useSubscription'

export function useDoc<FetchFn extends GetVariation>({
  queryKey,
  queryFn,
  options,
}: {
  queryKey: QueryKey
  queryFn: FetchFn
  options?: UseQueryOptions<Return<FetchFn, 'doc'>, Error>
}) {
  const type: ObserverType = 'doc'
  const ref = getRef<FetchFn, typeof type>(queryFn, queryKey)
  const subscribe = useSubscription(ref)

  return useObserver({
    queryKey,
    queryFn,
    type,
    subscribe,
    options,
  })
}
