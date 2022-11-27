import type { UseQueryOptions } from '@tanstack/react-query'
import type { AsyncFn } from './types'

export function query<Fn extends AsyncFn>(fn: Fn, deps: Parameters<Fn>, options?: UseQueryOptions) {
  return {
    queryFn: () => fn(...deps) as ReturnType<Fn>,
    deps,
    options,
  }
}
