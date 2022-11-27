import React, { useEffect, useRef } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { UseQueryOptions } from '@tanstack/react-query'
import { entries, seconds } from './utils'
import type { QueryMap, Queries, MemoicProps } from './types'

const client = new QueryClient({ defaultOptions: { queries: { staleTime: seconds(20) } } })

function prefetchQueries<Prefetch extends Queries>(queryMap: QueryMap<Prefetch>) {
  return Promise.all(
    entries(queryMap).map(async ([key, { queryFn, deps }]) =>
      client.prefetchQuery({ queryKey: [key, ...(deps || [])], queryFn }),
    ),
  )
}

export function Memoic<MemoicQueries extends Queries>({
  children,
  queries,
  initial = [] as (keyof MemoicQueries)[],
}: MemoicProps<MemoicQueries>) {
  const didInitialPrefetch = useRef(false)

  useEffect(() => {
    if (!didInitialPrefetch.current) {
      // 1. Override options for queries that have them defined
      const queriesWithOptions = entries(queries).reduce(
        (result, [key, builder]) => (builder.options ? result : { ...result, [key]: builder }),
        {} as QueryMap,
      )
      entries(queriesWithOptions).forEach(([key, { deps, options }]) => {
        client.setQueryDefaults([key, deps], options as UseQueryOptions)
      })
      // 2. Prefetch initial queries
      const prefetchableQueries = entries(queries).reduce(
        (result, [key, builder]) =>
          initial.includes(key) ? result : { ...result, [key]: builder },
        {} as QueryMap,
      )
      prefetchQueries(prefetchableQueries)
      didInitialPrefetch.current = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // we only want it to run once to prevent excessive passive prefetching

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}
