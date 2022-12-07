import type { QueryKey, UseQueryOptions } from '@tanstack/react-query'
import { execute } from './utils'
import { useObserver } from './useObserver'
import { useQuerySubscription } from './useQuerySubscription'
import { GetVariation, ObserverType, Return } from './types'

export function useMultiQuery<FetchFn extends GetVariation>({
  queryKey,
  queryFn,
  options,
}: {
  queryKey: QueryKey
  queryFn: FetchFn
  options?: UseQueryOptions<Return<FetchFn, 'query'>, Error>
}) {
  const type: ObserverType = 'query'
  const ref = execute<FetchFn, typeof type>(queryFn, queryKey)
  const subscribe = useQuerySubscription(ref)

  return useObserver({
    queryKey,
    queryFn,
    type,
    subscribe,
    options,
  })
}
