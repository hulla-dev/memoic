import { useDoc } from './useDoc'
import { useMultiQuery } from './useMultiQuery'
import { getRef, isDocument } from './utils'
import { GetReturnVariation, Return } from './types'
import type { QueryKey, UseQueryOptions } from '@tanstack/react-query'
import { Plugin, getOptions } from '@memoic/core'


const fireGet = <Fn extends (...args: any[]) => GetReturnVariation>({ queryFn, queryKey, options: opt }: { queryFn: Fn, queryKey: QueryKey, options?: UseQueryOptions<Return<Fn, 'doc' | 'query'>> }) => {
  const ref = getRef(queryFn, queryKey)
  if (isDocument(ref)) {
    const options = getOptions(opt, queryKey) as UseQueryOptions<Return<Fn, 'doc'>, Error>
    return useDoc({ queryFn, queryKey, options })
  }
  const options = getOptions(opt, queryKey) as UseQueryOptions<Return<Fn, 'query'>, Error>
  return useMultiQuery({ queryFn, queryKey, options })
}

export const firebase = {
  get: fireGet,
} as Plugin
