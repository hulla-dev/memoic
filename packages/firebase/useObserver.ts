import { QueryKey, useQuery, useQueryClient, UseQueryResult, UseQueryOptions } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'
import type { Unsubscribe, QueryAdapter, Return, ObserverType } from './types'


/**
 * Handles firebase API subscriptions, since react-query is based on Promises
 * however firebase is based on Observables, we need to bridge the gap.
 */
export function useObserver<Fn extends QueryAdapter, O extends ObserverType>({
  queryKey,
  subscribe,
  options,
}: {
  queryKey: QueryKey
  queryFn: Fn
  subscribe: (
    callback: (res: Return<Fn, O>) => void,
    onError: (error: Error) => void,
  ) => Unsubscribe
  type: O,
  options?: UseQueryOptions<Return<Fn, O>, Error>
}): UseQueryResult<Return<Fn, O>, Error> {
  const unsubscribe = useRef<Unsubscribe | null>(null)
  const client = useQueryClient()

  useEffect(() => {
    const cleanup = unsubscribe.current
    return () => {
      if (cleanup) {
        cleanup()
      }
    }
  }, [])

  // instantiate fake promise for returning data
  let resolve: (value?: Return<Fn, O>) => void = () => null
  let reject: (error: Error) => void = () => null

  const result = new Promise((res, err) => {
    resolve = res
    reject = err
  })

  let firstRun = true
  if (!unsubscribe.current) {
    unsubscribe.current = subscribe(async (data: Return<Fn, O>) => {
      if (firstRun) {
        resolve(data)
        firstRun = false
      } else {
        client.setQueryData(queryKey, data)
      }
    }, reject)
  } else {
    resolve(client.getQueryData(queryKey))
  }

  return useQuery<Return<Fn, O>, Error>({
    ...(options || {}),
    queryFn: () => result as Promise<Return<Fn, O>>,
    queryKey,
    retry: false,
    staleTime: Infinity,
    refetchInterval: undefined,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  })
}
