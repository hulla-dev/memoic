import type { Plugin, Queries, QueryMap } from './types'
import { get, prefetch } from './fetching'

export function createMemoic<MemoicQueries extends QueryMap<Queries>>(
  queries: MemoicQueries,
  plugin?: Plugin,
) {
  return {
    get: get(queries, plugin),
    prefetch: prefetch(queries, plugin),
  }
}
