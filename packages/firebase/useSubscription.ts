import { useCallback } from 'react'
import { isLegacyRef } from './utils'
import type { NativeDocRef, Unsubscribe, DocRef, Value, Snapshot } from './types'
import { QueryAdapter } from '@memoic/core/types'
import type { DocumentSnapshot } from 'firebase/firestore'

// Sad, but necessary because we need to hackishly accommodate both v8 and v9
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-var-requires */

export const useSubscription = <FetchFn extends QueryAdapter>(
  ref: DocRef<Value<FetchFn>> | NativeDocRef<Value<FetchFn>>,
) =>
  useCallback(
    (
      callback: (snap: Snapshot<Value<FetchFn>> | DocumentSnapshot<Value<FetchFn>>) => void,
      onError: (error: Error) => void,
    ): Unsubscribe => {
      if (isLegacyRef(ref)) {
        // @ts-ignore
        return ref.onSnapshot({
          next: (snapshot: Snapshot<Value<FetchFn>>) => callback(snapshot),
          error: onError,
        }) as Unsubscribe
      }
      // unnecessary else but used for code splitting in tsup
      // @ts-ignore
      if (!ref.onSnapshot) {
        // @ts-ignore
        const { onSnapshot } = require('firebase/firestore')
        return onSnapshot(
          ref as DocRef<Value<FetchFn>>,
          (snapshot: DocumentSnapshot<Value<FetchFn>>) => callback(snapshot),
          onError,
        ) as Unsubscribe
      }
      throw Error(
        'Missing onSnapshot method. Make sure your function returns DocumentReference or CollectionReference in v8 or you have v9 of firebase/firestore installed.',
      )
    },
    [ref],
  )
