import type { UseQueryOptions } from '@tanstack/react-query'
import type { ReactNode } from 'react'

export type QueryDependency = [string, ...unknown[]]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AsyncFn = (...args: any[]) => Promise<any>

export type Query = {
  queryFn: AsyncFn
  deps: QueryDependency
  options?: UseQueryOptions
}

export type Queries = {
  [key: string]: Query
}

export type QueryMap<Prefetch extends Queries = Queries> = {
  [K in keyof Prefetch]: Prefetch[K]
}

export type MemoicProps<Prefetch extends Queries> = {
  children: ReactNode
  queries: QueryMap<Prefetch>
  initial?: (keyof Partial<QueryMap<Prefetch>>)[]
}
