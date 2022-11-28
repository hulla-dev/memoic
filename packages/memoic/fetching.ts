import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Queries, QueryMap } from './types'

export const get =
  <MemoicQueries extends QueryMap<Queries>>(queries: MemoicQueries) =>
  <K extends keyof MemoicQueries>(key: K, ...deps: Parameters<MemoicQueries[K]['queryFn']>) =>
    useQuery({
      queryKey: [key, ...deps],
      queryFn: queries[key].queryFn,
    })

export const prefetch =
  <MemoicQueries extends QueryMap<Queries>>(queries: MemoicQueries) =>
  async <K extends keyof MemoicQueries>(
    key: K,
    ...deps: Parameters<MemoicQueries[K]['queryFn']>
  ) => {
    const client = useQueryClient()
    return client.prefetchQuery([key, ...deps], queries[key].queryFn)
  }
