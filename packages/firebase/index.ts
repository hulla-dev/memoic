import { useDoc } from './useDoc'
import { useQuery } from './useQuery'
import { getRef, isDocument } from './utils'
import {QueryAdapter } from './types'
import { QueryKey } from '@tanstack/react-query'


const fireGet = <Fn extends QueryAdapter>({ queryFn, queryKey }: { queryFn: Fn, queryKey: QueryKey }) => {
  const ref = getRef(queryFn, queryKey)
  if (isDocument(ref)) {
    return useDoc({ queryFn, queryKey })
  }
  return useQuery({ queryFn, queryKey })
}

export const firebase = {
  get: fireGet,
}
