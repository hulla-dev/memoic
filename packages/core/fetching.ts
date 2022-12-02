import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Queries, QueryMap, Final, Plugin } from './types'

export const get =
  <MemoicQueries extends QueryMap<Queries>, MemoicPlugin extends Plugin>(
    queries: MemoicQueries,
    plugin?: MemoicPlugin,
  ) =>
  <K extends keyof MemoicQueries>(
    key: K,
    deps: Parameters<MemoicQueries[K]['queryFn']>,
    params?: MemoicPlugin['queryOptions'],
  ) => {
    if (plugin && plugin.get) {
      return plugin.get({
        queryKey: [key, ...deps],
        queryFn: queries[key].queryFn,
        params,
      })
    }
    return useQuery<Final<MemoicQueries[K]['queryFn']>>({
      queryKey: [key, ...deps],
      queryFn: ({ queryKey }) => queries[key].queryFn(...(queryKey.slice(1) || [])),
    })
  }

export const prefetch =
  <MemoicQueries extends QueryMap<Queries>, MemoicPlugin extends Plugin>(
    queries: MemoicQueries,
    plugin?: MemoicPlugin,
  ) =>
  async <K extends keyof MemoicQueries>(
    key: K,
    deps: Parameters<MemoicQueries[K]['queryFn']>,
    params?: MemoicPlugin['preFetchOptions'],
  ) => {
    if (plugin && plugin.prefetch) {
      return plugin.prefetch({
        queryKey: [key, ...deps],
        queryFn: queries[key].queryFn,
        params,
      })
    }
    const client = useQueryClient()
    return client.prefetchQuery([key, ...deps], queries[key].queryFn)
  }
