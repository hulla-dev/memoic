import type { QueryKey } from '@tanstack/react-query'
import type { DocumentData } from 'firebase/firestore'
import type { DocRef, NativeDocRef, Value } from './types'

export function isLegacyRef<T extends DocumentData>(
  ref: NativeDocRef<T> | DocRef<T>,
): ref is NativeDocRef<T> {
  return !!(ref as NativeDocRef<T>).onSnapshot
}

export function getRef<Fn extends (...args: any[]) => any>(queryFn: Fn, queryKey: QueryKey) {
  return queryFn(...(queryKey.slice(1) || [])) as NativeDocRef<Value<Fn>> | DocRef<Value<Fn>>
}

export async function getSnapshot<
  Val extends DocumentData,
  Ref extends DocRef<Val> | NativeDocRef<Val>,
>(ref: Ref) {
  if (isLegacyRef(ref)) {
    return ref.get()
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (!ref.onSnapshot) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { getDoc } = require('firebase/firestore') // eslint-disable-line @typescript-eslint/no-var-requires
    return getDoc(ref)
  }
}
