import {
  FetchQueryOptions,
  useQuery,
  useQueryClient,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query'
import { Plugin, Res, QueryMap, Queries } from './types'
import { getOptions } from './utils'

export const get =
  <MQueries extends QueryMap<Queries>, MemoicPlugin extends Plugin>(
    queries: MQueries,
    plugin?: MemoicPlugin,
  ) =>
  <K extends keyof MQueries>(
    key: K,
    deps: Parameters<MQueries[K]['queryFn']>,
    queryOptions?: UseQueryOptions<Res<MQueries[K]['queryFn']>>,
  ): UseQueryResult<Res<MQueries[K]['queryFn']>> => {
    // Defaults options to enable query only when dependencies are defined
    const options = getOptions(queryOptions, deps)
    // If plugin adapter is provided, use it over default return
    if (plugin && plugin.get) {
      return plugin.get({
        queryKey: [key, ...(deps || [])],
        queryFn: queries[key].queryFn,
        options,
      })
    }
    return useQuery({
      queryKey: [key, ...(deps || [])],
      queryFn: ({ queryKey }) => queries[key].queryFn(...(queryKey.slice(1) || [])),
      ...(options || {}),
    })
  }

export const prefetch =
  <MQueries extends QueryMap<Queries>, MemoicPlugin extends Plugin>(
    queries: MQueries,
    plugin?: MemoicPlugin,
  ) =>
  async <K extends keyof MQueries>(
    key: K,
    deps: Parameters<MQueries[K]['queryFn']>,
    options?: FetchQueryOptions<Res<MQueries[K]['queryFn']>>,
  ) => {
    if (plugin && plugin.prefetch) {
      return plugin.prefetch({
        queryKey: [key, ...(deps || [])],
        queryFn: queries[key].queryFn,
        options,
      })
    }
    const client = useQueryClient()
    return client.prefetchQuery([key, ...(deps || [])], queries[key].queryFn, options)
  }
