import type { Queries } from './types'
import { get, prefetch } from './fetching'

export function createMemoic<MemoicQueries extends Queries>(queries: MemoicQueries) {
  return {
    get: get(queries),
    prefetch: prefetch(queries),
  }
}
