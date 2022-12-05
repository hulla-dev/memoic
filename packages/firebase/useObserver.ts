import { QueryKey, useQuery, useQueryClient, UseQueryResult, UseQueryOptions, hashQueryKey } from '@tanstack/react-query'
import { useEffect } from 'react'
import type { Unsubscribe, QueryAdapter, Return, ObserverType } from './types'

type Observer = {
  unsubscribe: Unsubscribe,
  init?: boolean,
}
const subs: Record<string, Observer> = {}

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
  const client = useQueryClient()
  const hash = hashQueryKey(queryKey)

  useEffect(() => {
    return () => {
      if (subs[hash].unsubscribe !== undefined) {
        subs[hash].unsubscribe()
        delete subs[hash]
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

  if (subs[hash].unsubscribe !== undefined) {
    const data = client.getQueryData<Return<Fn, O>>(queryKey)
    if (data !== undefined) {
      resolve(data)
    } else {
      client.invalidateQueries(queryKey)
    }
  } else {
    subs[hash].unsubscribe = subscribe(async (data: Return<Fn, O>) => {
      if(!subs[hash].init) {
        subs[hash].init = true
        if (data !== undefined) {
          resolve(data)
        } else {
          client.invalidateQueries(queryKey)
        }
      } else {
        client.setQueryData(queryKey, data)
      }
    }, reject)
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
