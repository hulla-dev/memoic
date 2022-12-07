import { useDoc } from './useDoc'
import { useMultiQuery } from './useMultiQuery'
import { execute, isDocument, isAuth } from './utils'
import { AnyFn, GetReturnVariation, ObserverType, Return } from './types'
import { QueryKey, useQuery, UseQueryOptions } from '@tanstack/react-query'
import { Plugin } from '@memoic/core'
import { useConditional } from './useConditional'
import { useAuth } from './useAuth'

function getCondition<Fn extends AnyFn>(fn: Fn, key: QueryKey) {
  const isAsync = fn.constructor.name === 'AsyncFunction'
  if (isAsync) {
    return 3
  }
  const refOrAuth = execute(fn, key)
  if (isAuth(refOrAuth)) {
    return 2
  }
  if (isDocument(refOrAuth)) {
    return 0
  }
  return 1
}

const useGet = <Fn extends (...args: unknown[]) => GetReturnVariation, Opt extends ObserverType>({
  queryFn,
  queryKey,
  options: opt,
}: {
  queryFn: Fn
  queryKey: QueryKey
  options?: UseQueryOptions<Return<Fn, Opt>>
}) => {
  const options = opt
  const condition = getCondition(queryFn, queryKey)

  return useConditional(
    condition,
    useDoc,
    useMultiQuery,
    useAuth,
    useQuery,
  )({ queryFn, queryKey, options })
}

export const firebase = {
  get: useGet,
} as Plugin
