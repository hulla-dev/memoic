import { QueryKey, useQuery, useQueryClient } from '@tanstack/react-query'
import type { Unsubscribe, Updater, QueryAdapter, Value } from './types'
import { useEffect, useRef } from 'react'

/**
 * Handles firebase API subscriptions, since react-query is based on Promises
 * however firebase is based on Observables, we need to bridge the gap.
 */
export function useObserver<FetchFn extends QueryAdapter>({
  queryKey,
  subscribe,
}: {
  queryKey: QueryKey
  queryFn: FetchFn
  subscribe: (callback: Updater<Value<FetchFn>>, onError: (error: Error) => void) => Unsubscribe
}) {
  const ref = useRef(false)
  const { current: isActive } = ref
  const client = useQueryClient()

  // instantiate fake promise for returning data
  let resolve: (value?: Value<FetchFn>) => void
  let reject: (error: Error) => void

  const result = new Promise((res, err) => {
    resolve = res
    reject = err
  })

  // add snapshot subscription
  useEffect(() => {
    const unsubscribe = subscribe(async (data) => {
      if (!isActive) {
        const cache = client.getQueryData(queryKey) as Value<FetchFn>
        resolve(cache)
        ref.current = true
      } else {
        if (data !== undefined) {
          client.setQueryData(queryKey, data)
          resolve(data)
        }
      }
    }, reject)
    return () => {
      ref.current = false
      unsubscribe()
    }
  }, [])

  return useQuery<ReturnType<FetchFn>>({
    queryFn: () => result as Promise<ReturnType<FetchFn>>,
    queryKey,
    retry: false,
    staleTime: Infinity,
    refetchInterval: undefined,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  })
}
