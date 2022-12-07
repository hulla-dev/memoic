import {
  QueryKey,
  useQuery,
  useQueryClient,
  UseQueryResult,
  UseQueryOptions,
  hashQueryKey,
} from '@tanstack/react-query'
import { useEffect } from 'react'
import type { Unsubscribe, Return, ObserverType, GetVariation } from './types'
import { nonNullish } from './utils'

type Observer = {
  unsubscribe: Unsubscribe | undefined
  initState: number
  refetchState: number
}

let obs: Record<string, Observer> = {}

/**
 * Handles firebase API subscriptions, since react-query is based on Promises
 * however firebase is based on Observables, we need to bridge the gap.
 */
export function useObserver<Fn extends GetVariation, O extends ObserverType, E = Error>({
  queryKey,
  subscribe,
  options,
}: {
  queryKey: QueryKey
  queryFn: Fn
  subscribe: (callback: (res: Return<Fn, O>) => void, onError: (error: E) => void) => Unsubscribe
  type: O
  options?: UseQueryOptions<Return<Fn, O>, E>
}): UseQueryResult<Return<Fn, O>, E> {
  const client = useQueryClient()
  const hash = hashQueryKey(queryKey) as keyof typeof obs

  obs = {
    ...(obs || {}),
    [hash]: {
      ...(obs[hash] || {}),
    },
  }

  obs[hash].refetchState = nonNullish(obs[hash]?.refetchState, 1)

  const cleanup = (hashId: keyof typeof obs) => {
    if (obs[hashId].refetchState === 1) {
      // needs to be a direct reference otherwise it can get lost in useEffect during unsubscription
      const unsubscribe = obs[hashId].unsubscribe
      if (unsubscribe) {
        unsubscribe()
        delete obs[hashId]
      }
    }
  }

  useEffect(() => {
    obs[hash].refetchState += 1
    return () => {
      obs[hash].refetchState -= 1
      cleanup(hash)
    }
  }, [])

  // instantiate fake promise for returning data
  let resolve: (value?: Return<Fn, O> | null) => void = () => null
  let reject: (error: E) => void = () => null

  const result = new Promise((res, err) => {
    resolve = res
    reject = err
  })

  let unsubscribe: Unsubscribe | undefined = undefined
  if (obs[hash].unsubscribe) {
    unsubscribe = obs[hash].unsubscribe
    const data = client.getQueryData<Return<Fn, O>>(queryKey)
    resolve(data || null)
  } else {
    unsubscribe = subscribe(async (data: Return<Fn, O>) => {
      obs[hash].initState = nonNullish(obs[hash]?.initState, 0)
      obs[hash].initState += 1
      if (obs[hash].initState === 1) {
        resolve(data || null)
      } else {
        client.setQueryData(queryKey, data)
      }
    }, reject)
  }
  obs[hash].unsubscribe = unsubscribe

  return useQuery<Return<Fn, O>, E>({
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
