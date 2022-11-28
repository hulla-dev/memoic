import type { UseQueryOptions } from '@tanstack/react-query'
import type { ReactNode } from 'react'

export type QueryDependency<Fn extends AsyncFn = AsyncFn> = Parameters<Fn>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AsyncFn = (...args: any[]) => Promise<any>

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
