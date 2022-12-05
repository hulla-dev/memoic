import type {
  DocumentReference,
  CollectionReference,
  Query as QueryType,
  QuerySnapshot as WebQuerySnapshot,
  DocumentData,
} from 'firebase/firestore'
import type { FirebaseFirestoreTypes } from '@react-native-firebase/firestore'
import type { UseQueryOptions, QueryKey, UseQueryResult } from '@tanstack/react-query'

/* eslint-disable @typescript-eslint/no-explicit-any */

export type DocRef<DataOrRef> = DataOrRef extends DocumentReference<DataOrRef>
  ? DataOrRef
  : DocumentReference<DataOrRef>

export type CollectionRef<Result> = Result extends CollectionReference<Result>
  ? Result
  : CollectionReference<Result>

export type NativeDocRef<Result extends DocumentData> =
  Result extends FirebaseFirestoreTypes.DocumentReference<Result>
    ? Result
    : FirebaseFirestoreTypes.DocumentReference<Result>

export type NativeCollectionRef<Result extends DocumentData> =
  Result extends FirebaseFirestoreTypes.CollectionReference<Result>
    ? Result
    : FirebaseFirestoreTypes.CollectionReference<Result>

export type NativeCollection<Result extends DocumentData> = NativeCollectionRef<Result>

export type NativeQuery<Result extends DocumentData = DocumentData> =
  FirebaseFirestoreTypes.Query<Result>

export type Snapshot<T extends DocumentData = DocumentData> =
  FirebaseFirestoreTypes.DocumentSnapshot<T>

export type NativeQuerySnapshot<T extends DocumentData = DocumentData> =
  FirebaseFirestoreTypes.QuerySnapshot<T>

export type QuerySnapshot<T extends DocumentData = DocumentData> = WebQuerySnapshot<T>

export type Unsubscribe = () => void

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyFn = (...args: any[]) => Promise<any>

export type Final<Fn extends AnyFn> = ReturnType<Fn> extends Promise<infer T>
  ? Awaited<T>
  : ReturnType<Fn>

export type QueryAdapter = <Return, Key extends QueryKey = QueryKey, Fn extends AnyFn = AnyFn>({
  queryKey,
  queryFn,
  params,
}: {
  queryKey: Key
  queryFn: Fn
  params?: UseQueryOptions & Record<string, unknown>
}) => UseQueryResult<Return, Error>

export type Value<
  Fn extends (...args: any[]) => any,
  R = ReturnType<Fn>,
> = R extends DocumentReference<infer T>
  ? T
  : R extends CollectionReference<infer T>
  ? T
  : R extends QueryType<infer T>
  ? T
  : R extends FirebaseFirestoreTypes.DocumentReference<infer T>
  ? T
  : R extends FirebaseFirestoreTypes.CollectionReference<infer T>
  ? T
  : R extends FirebaseFirestoreTypes.Query<infer T>
  ? T
  : R

export type ObserverType = 'doc' | 'query'

export type DocValue<Fn> = Fn extends (...args: any[]) => infer R
  ? R extends DocumentReference<infer T>
    ? T
    : R extends FirebaseFirestoreTypes.DocumentReference<infer T>
    ? T
    : R extends CollectionReference<infer T>
    ? T
    : R extends FirebaseFirestoreTypes.CollectionReference<infer T>
    ? T
    : R extends QueryType<infer T>
    ? T
    : R extends FirebaseFirestoreTypes.Query<infer T>
    ? T
    : R
  : never
