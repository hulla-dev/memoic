import { QueryKey, useQuery, useQueryClient } from '@tanstack/react-query'
import type { Unsubscribe, QueryAdapter, Value, Snapshot } from './types'
import { useEffect, useRef } from 'react'
import { DocumentSnapshot } from 'firebase/firestore'

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
  subscribe: (
    callback: (snap: Snapshot<Value<FetchFn>> | DocumentSnapshot<Value<FetchFn>>) => void,
    onError: (error: Error) => void,
  ) => Unsubscribe
}) {
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
  let resolve: (value?: Value<FetchFn> & { id: string }) => void = () => null
  let reject: (error: Error) => void = () => null

  const result = new Promise((res, err) => {
    resolve = res
    reject = err
  })

  let firstRun = true
  if (!unsubscribe.current) {
    unsubscribe.current = subscribe(
      async (snap: Snapshot<Value<FetchFn>> | DocumentSnapshot<Value<FetchFn>>) => {
        if (firstRun) {
          resolve({ ...(snap.data() as Value<FetchFn>), id: snap.id })
          firstRun = false
        } else {
          client.setQueryData(queryKey, { ...(snap.data() as Value<FetchFn>), id: snap.id })
        }
      },
      reject,
    )
  } else {
    resolve(client.getQueryData(queryKey))
  }

  return useQuery<Value<FetchFn> & { id: string }>({
    queryFn: () => result as Promise<Value<FetchFn> & { id: string }>,
    queryKey,
    retry: false,
    staleTime: Infinity,
    refetchInterval: undefined,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  })
}
