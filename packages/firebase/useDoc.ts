import type { QueryKey } from '@tanstack/react-query'
import type { QueryAdapter, DocRef, Value, NativeDocRef } from './types'
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
  const data = getRef(queryFn, queryKey) as DocRef<Value<FetchFn>> | NativeDocRef<Value<FetchFn>>
  const subscribe = useSubscription(data)

  return useObserver({
    queryKey,
    queryFn,
    subscribe,
  })
}
