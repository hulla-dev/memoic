import type { Plugin, QueryMap } from './types'
import { get, prefetch } from './fetching'

export function createMemoic<Queries extends QueryMap<Queries>, CustomPlugin extends Plugin>(
  queries: Queries,
  plugin?: CustomPlugin,
) {
  return {
    get: get(queries, plugin),
    prefetch: prefetch(queries, plugin),
  }
}
