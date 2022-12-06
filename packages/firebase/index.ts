import { useDoc } from './useDoc'
import { useMultiQuery } from './useMultiQuery'
import { getRef, isDocument } from './utils'
import { GetReturnVariation, ObserverType, Return } from './types'
import type { QueryKey, UseQueryOptions } from '@tanstack/react-query'
import { Plugin, getOptions } from '@memoic/core'
import { useConditional } from './useConditional'

const useGet = <Fn extends (...args: unknown[]) => GetReturnVariation, Opt extends ObserverType>({
  queryFn,
  queryKey,
  options: opt,
}: {
  queryFn: Fn
  queryKey: QueryKey
  options?: UseQueryOptions<Return<Fn, Opt>>
}) => {
  const ref = getRef(queryFn, queryKey)
  const options = getOptions(opt, queryKey) as UseQueryOptions<Return<Fn, Opt>, Error>
  return useConditional(isDocument(ref), useDoc, useMultiQuery)({ queryFn, queryKey, options })
}

export const firebase = {
  get: useGet,
} as Plugin
