import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Queries } from './types'

export const get =
  <MemoicQueries extends Queries>(queries: MemoicQueries) =>
  <K extends keyof MemoicQueries>(key: K, deps: MemoicQueries[K]['deps']) =>
    useQuery({
      queryKey: [key, ...deps],
      queryFn: queries[key].queryFn,
    })

export const prefetch =
  <MemoicQueries extends Queries>(queries: MemoicQueries) =>
  async <K extends keyof MemoicQueries>(key: K, deps: MemoicQueries[K]['deps']) => {
    const client = useQueryClient()
    return client.prefetchQuery([key, ...deps], queries[key].queryFn)
  }
