import { useCallback } from 'react'
import { isLegacyRef } from './utils'
import type { NativeDocRef, Unsubscribe, Updater, DocRef, Value } from './types'
import { QueryAdapter } from '@memoic/core/types'
import type { DocumentSnapshot } from 'firebase/firestore'

export const useSubscription = <FetchFn extends QueryAdapter>(
  data: DocRef<Value<FetchFn>> | NativeDocRef<Value<FetchFn>>,
) =>
  useCallback(
    (callback: Updater<Value<FetchFn>>, onError: (error: Error) => void): Unsubscribe => {
      if (isLegacyRef(data)) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore correct type, but it infers an options object instead of a callback
        return (data as NativeDocRef<Value<FetchFn>>).onSnapshot(
          (snapshot: DocumentSnapshot<Value<FetchFn>>) =>
            callback(snapshot.data() as Value<FetchFn>),
          onError,
        ) as Unsubscribe
      }
      // unnecessary else but used for code splitting in tsup
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (!data.onSnapshot) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const { onSnapshot } = require('firebase/firestore') // eslint-disable-line @typescript-eslint/no-var-requires
        return onSnapshot(
          data as DocRef<Value<FetchFn>>,
          (snapshot: DocumentSnapshot<Value<FetchFn>>) =>
            callback(snapshot.data() as Value<FetchFn>),
          onError,
        ) as Unsubscribe
      }
      throw Error(
        'Missing onSnapshot method. Make sure your function returns DocumentReference or CollectionReference in v8 or you have v9 of firebase/firestore installed.',
      )
    },
    [data],
  )
