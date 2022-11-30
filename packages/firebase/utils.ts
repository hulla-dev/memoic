import type { QueryKey } from '@tanstack/react-query'
import type { DocumentData } from 'firebase/firestore'
import type { DocRef, NativeDocRef, Value } from './types'

export function isLegacyRef<T extends DocumentData>(
  ref: NativeDocRef<T> | DocRef<T>,
): ref is NativeDocRef<T> {
  return !!(ref as NativeDocRef<T>).onSnapshot
}

export function getRef<Fn extends (...args: any[]) => any>(queryFn: Fn, queryKey: QueryKey) {
  return queryFn(...queryKey.slice(1)) as NativeDocRef<Value<Fn>> | DocRef<Value<Fn>>
}
