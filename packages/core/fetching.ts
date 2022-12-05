import { useQuery, useQueryClient, UseQueryResult } from '@tanstack/react-query'
import { Query, Plugin, Res, QueryMap, Queries } from './types'

export const get =
  <MQueries extends QueryMap<Queries>, MemoicPlugin extends Plugin>(
    queries: MQueries,
    plugin?: MemoicPlugin,
  ) =>
  <K extends keyof MQueries>(
    key: K,
    deps: Parameters<MQueries[K]['queryFn']>,
    params?: MemoicPlugin['queryOptions'],
  ): UseQueryResult<Res<MQueries[K]['queryFn']>> => {
    if (plugin && plugin.get) {
      return plugin.get({
        queryKey: [key, ...deps],
        queryFn: queries[key].queryFn,
        params,
      })
    }
    return useQuery({
      queryKey: [key, ...deps],
      queryFn: ({ queryKey }) => queries[key].queryFn(...(queryKey.slice(1) || [])),
    })
  }

export const prefetch =
  <Queries extends Record<string, Query>, MemoicPlugin extends Plugin>(
    queries: { [K in keyof Queries]: Query<Queries[K]['queryFn']> },
    plugin?: MemoicPlugin,
  ) =>
  async <K extends keyof Queries>(
    key: K,
    deps: Parameters<Queries[K]['queryFn']>,
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
