import { QueryKey, useQuery, useQueryClient, UseQueryResult, UseQueryOptions, hashQueryKey } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'
import type { Unsubscribe, QueryAdapter, Return, ObserverType } from './types'

type Observer = {
  unsubscribe: Unsubscribe | undefined,
  initState: number,
  refetchState: number
}

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
  const ref = useRef<Record<string, Observer>>({})
  const subs = ref.current
  const client = useQueryClient()
  const hash = hashQueryKey(queryKey) as keyof typeof subs

  ref.current = {
    ...(ref.current || {}),
    [hash]: {
      ...(ref.current[hash] || {}),
    }
  }

  subs[hash].refetchState ??= 1

  const cleanup = (hashId: keyof typeof subs) => {
    if (subs[hashId].refetchState === 1) {
      // needs to be a direct reference otherwise it can get lost in useEffect during unsubscription
      const unsubscribe = subs[hashId].unsubscribe
      if (unsubscribe) {
        unsubscribe()
        delete subs[hashId]
      }
    }
  }

  useEffect(() => {
    subs[hash].refetchState += 1
    return () => {
      subs[hash].refetchState -= 1
      cleanup(hash)
    }
  }, [])

  // instantiate fake promise for returning data
  let resolve: (value?: Return<Fn, O> | null) => void = () => null
  let reject: (error: Error) => void = () => null

  const result = new Promise((res, err) => {
    resolve = res
    reject = err
  })

  let unsubscribe: Unsubscribe | undefined = undefined
  if (subs[hash].unsubscribe) {
    unsubscribe = subs[hash].unsubscribe
    const data = client.getQueryData<Return<Fn, O>>(queryKey)
    resolve(data || null)
  } else {
    unsubscribe = subscribe(async (data: Return<Fn, O>) => {
      subs[hash].initState ??= 0
      subs[hash].initState += 1
      if (subs[hash].initState === 1) {
        resolve(data || null)
      } else {
        client.setQueryData(queryKey, data)
      }
    }, reject)
  }
  subs[hash].unsubscribe = unsubscribe

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
