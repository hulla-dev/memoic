import type { UseQueryOptions } from '@tanstack/react-query'
import type { AsyncFn } from './types'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function query<Fn extends AsyncFn = AsyncFn, Result = ReturnType<Fn>>(
  fn: Fn,
  initialParams?: Parameters<Fn>,
  options?: UseQueryOptions,
) {
  return {
    queryFn: (...deps: Parameters<Fn>): Awaited<Result> => fn(...deps),
    options,
    initialParams,
  }
}
