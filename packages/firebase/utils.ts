import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore'
import type { QueryKey } from '@tanstack/react-query'
import type {
  CollectionReference,
  DocumentData,
  DocumentReference,
  Query,
} from 'firebase/firestore'
import type { ObserverType, Value } from './types'

type QueryVariation<T extends DocumentData> = CollectionReference<T> | Query<T>

type NativeQueryVariation<T extends DocumentData> =
  | FirebaseFirestoreTypes.CollectionReference<T>
  | FirebaseFirestoreTypes.Query<T>

export function isDocument(
  ref:
    | DocumentReference<DocumentData>
    | FirebaseFirestoreTypes.DocumentReference<DocumentData>
    | QueryVariation<DocumentData>
    | NativeQueryVariation<DocumentData>,
): ref is DocumentReference<DocumentData> | FirebaseFirestoreTypes.DocumentReference<DocumentData> {
  return (
    (ref as DocumentReference<DocumentData>)?.type === 'document' ||
    (ref as NativeQueryVariation<DocumentData>)?.where === undefined
  )
}

export function isLegacyRef<T extends DocumentData>(
  ref: FirebaseFirestoreTypes.DocumentReference<T> | DocumentReference<T>,
): ref is FirebaseFirestoreTypes.DocumentReference<T> {
  return !!(ref as FirebaseFirestoreTypes.DocumentReference<T>).onSnapshot
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
    ? FirebaseFirestoreTypes.DocumentReference<Value<Fn>> | DocumentReference<Value<Fn>>
    : QueryVariation<Value<Fn>> | NativeQueryVariation<Value<Fn>>
}
