import { useDoc } from './useDoc'
import { useQuery } from './useQuery'
import { getRef, isDocument } from './utils'
import { QueryAdapter, Return } from './types'
import type { QueryKey, UseQueryOptions } from '@tanstack/react-query'
import { getOptions } from '@memoic/core'


const fireGet = <Fn extends QueryAdapter>({ queryFn, queryKey, options: opt }: { queryFn: Fn, queryKey: QueryKey, options?: UseQueryOptions<Return<Fn, 'doc' | 'query'>> }) => {
  const ref = getRef(queryFn, queryKey)
  if (isDocument(ref)) {
    const options = getOptions(opt, queryKey) as UseQueryOptions<Return<Fn, 'doc'>, Error>
    return useDoc({ queryFn, queryKey, options })
  }
  const options = getOptions(opt, queryKey) as UseQueryOptions<Return<Fn, 'query'>, Error>
  return useQuery({ queryFn, queryKey, options })
}

export const firebase = {
  get: fireGet,
}
