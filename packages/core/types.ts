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

export type AsyncFn = (...args: any[]) => any

export type Query<Fn extends AsyncFn = AsyncFn> = {
  queryFn: Fn
  initialParams?: QueryDependency<Fn>
  options?: UseQueryOptions<ReturnType<Fn>>
}

export type Queries<Fn extends AsyncFn = AsyncFn> = {
  [key: string]: Query<Fn>
}

export type Res<Fn> = Fn extends (...args: any[]) => infer R
  ? R extends Promise<infer AR>
    ? AR
    : R
  : Fn

  export type QueryMap<Prefetch extends Queries = Queries> = {
    [K in keyof Prefetch]: Prefetch[K]
  }

export type MemoicProps<Queries extends Record<string, Query>> = {
  children: ReactNode
  queries: QueryMap<Queries>
  initial?: (keyof Partial<QueryMap<Queries>>)[]
}

export type QueryAdapter = <Key extends QueryKey = QueryKey, Fn extends AsyncFn = AsyncFn>({
  queryKey,
  queryFn,
  options,
}: {
  queryKey: Key
  queryFn: Fn
  options?: UseQueryOptions<Res<Fn>>
}) => UseQueryResult<Res<Fn>, Error | unknown>

export type Plugin<Adapter extends QueryAdapter = QueryAdapter> = {
  get?: Adapter
  prefetch?: (...args: Parameters<Adapter>) => Promise<void>
  queryOptions?: UseQueryOptions<Res<Adapter>, Error> 
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

export type Params<PluginOptions extends Record<string, unknown> | undefined>  = UseQueryOptions & PluginOptions

export type Defined<T> = T extends Array<infer V>
   ? V extends undefined
      ? never
      : V
   : never
