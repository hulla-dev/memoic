import type { Queries, QueryMap } from './types'
import { get, prefetch } from './fetching'

export function createMemoic<MemoicQueries extends QueryMap<Queries>>(queries: MemoicQueries) {
  return {
    get: get(queries),
    prefetch: prefetch(queries),
  }
}
