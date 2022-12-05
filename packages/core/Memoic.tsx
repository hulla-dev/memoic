import React, { useEffect, useRef } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { UseQueryOptions } from '@tanstack/react-query'
import { entries, seconds } from './utils'
import type { Queries, MemoicProps, QueryMap } from './types'

const client = new QueryClient({ defaultOptions: { queries: { staleTime: seconds(20) } } })

function prefetchQueries<MQ extends Queries>(queryMap: QueryMap<MQ>) {
  return Promise.all(
    entries(queryMap).map(async ([key, { queryFn, initialParams }]) =>
      client.prefetchQuery({
        queryKey: [key, ...(initialParams || [])],
        queryFn: () => queryFn(initialParams),
      }),
    ),
  )
}

export function Memoic<MQ extends Queries>({
  children,
  queries,
  initial = [] as (keyof MQ)[],
}: MemoicProps<MQ>) {
  const didInitialPrefetch = useRef(false)

  useEffect(() => {
    if (!didInitialPrefetch.current) {
      // 1. Override options for queries that have them defined
      const queriesWithOptions = entries(queries).reduce(
        (result, [key, builder]) => (builder.options ? result : { ...result, [key]: builder }),
        {} as QueryMap<MQ>,
      )
      entries(queriesWithOptions).forEach(([key, { initialParams, options }]) => {
        client.setQueryDefaults([key, initialParams], options as UseQueryOptions)
      })
      // 2. Prefetch initial queries
      const prefetchableQueries = entries(queries).reduce(
        (result, [key, builder]) =>
          initial.includes(key) ? result : { ...result, [key]: builder },
        {} as QueryMap<MQ>,
      )
      prefetchQueries(prefetchableQueries)
      didInitialPrefetch.current = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // we only want it to run once to prevent excessive passive prefetching

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}
