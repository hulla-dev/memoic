import type { UseQueryOptions } from '@tanstack/react-query'
import type { AsyncFn } from './types'

export function query<Fn extends AsyncFn>(
  fn: Fn,
  initialParams?: Parameters<Fn>,
  options?: UseQueryOptions,
) {
  return {
    queryFn: (...deps: Parameters<Fn>) => fn(...deps) as ReturnType<Fn>,
    options,
    initialParams,
  }
}
