import {
  UseQueryOptions,
  UseInfiniteQueryOptions,
  FetchQueryOptions,
  QueryKey,
  UseQueryResult,
} from '@tanstack/react-query'
import type { ReactNode } from 'react'

/* eslint-disable @typescript-eslint/no-explicit-any */

export type QueryDependency<Fn extends AsyncFn = AsyncFn> = Parameters<Fn>

export type Final<Fn extends AsyncFn> = ReturnType<Fn> extends Promise<infer T> ? Awaited<T> : never

export type AsyncFn = (...args: any[]) => Promise<any> | any

export type Query<Fn extends AsyncFn = AsyncFn> = {
  queryFn: Fn
  initialParams?: QueryDependency<Fn>
  options?: UseQueryOptions
}

export type Queries<Fn extends AsyncFn = AsyncFn> = {
  [key: string]: Query<Fn>
}

export type QueryMap<Prefetch extends Queries = Queries> = {
  [K in keyof Prefetch]: Prefetch[K]
}

export type MemoicProps<Prefetch extends Queries> = {
  children: ReactNode
  queries: QueryMap<Prefetch>
  initial?: (keyof Partial<QueryMap<Prefetch>>)[]
}

export type QueryAdapter = <Key extends QueryKey = QueryKey, Fn extends AsyncFn = AsyncFn>({
  queryKey,
  queryFn,
  params,
}: {
  queryKey: Key
  queryFn: Fn
  params?: UseQueryOptions & Record<string, unknown>
}) => UseQueryResult<Final<Fn> | ReturnType<Fn>, Error | unknown>

export type Plugin = {
  get?: QueryAdapter
  prefetch?: (...args: Parameters<QueryAdapter>) => Promise<void>
  queryOptions?: UseQueryOptions & Record<string, unknown>
  infiniteQueryOptions?: UseInfiniteQueryOptions & Record<string, unknown>
  preFetchOptions?: FetchQueryOptions & Record<string, unknown>
}

export type ExcludeParams<Skipped extends any[], Params extends any[]> = Params extends [
  ...Skipped,
  ...infer Rest,
]
  ? Rest
  : never

export type ApplyArgs<Fn extends AsyncFn, Param = Parameters<Fn>> = {
  [K in keyof Param]?: Param[K]
}
