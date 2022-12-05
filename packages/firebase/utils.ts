import type { QueryKey } from '@tanstack/react-query'
import type { DocumentData, Query } from 'firebase/firestore'
import type {
  CollectionRef,
  DocRef,
  NativeCollection,
  NativeDocRef,
  NativeQuery,
  ObserverType,
  Value,
} from './types'

type QueryVariation<T extends DocumentData> = CollectionRef<T> | Query<T>

type NativeQueryVariation<T extends DocumentData> = NativeCollection<T> | NativeQuery<T>

export function isDocument(
  ref:
    | DocRef<DocumentData>
    | NativeDocRef<DocumentData>
    | QueryVariation<DocumentData>
    | NativeQueryVariation<DocumentData>,
): ref is DocRef<DocumentData> | NativeDocRef<DocumentData> {
  return (
    (ref as DocRef<DocumentData>)?.type === 'document' ||
    (ref as NativeQueryVariation<DocumentData>)?.where === undefined
  )
}

export function isLegacyRef<T extends DocumentData>(
  ref: NativeDocRef<T> | DocRef<T>,
): ref is NativeDocRef<T> {
  return !!(ref as NativeDocRef<T>).onSnapshot
}

export function isLegacyQuery<T extends DocumentData>(
  ref: QueryVariation<T> | NativeQueryVariation<T>,
): ref is NativeQueryVariation<T> {
  return !!(ref as NativeQueryVariation<T>).onSnapshot
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getRef<Fn extends (...args: any[]) => any, O extends ObserverType>(
  queryFn: Fn,
  queryKey: QueryKey,
) {
  return queryFn(...(queryKey.slice(1) || [])) as O extends 'doc'
    ? DocRef<Value<Fn>> | NativeDocRef<Value<Fn>>
    : QueryVariation<Value<Fn>> | NativeQueryVariation<Value<Fn>>
}
