import { useCallback } from 'react'
import { isLegacyRef } from './utils'
import type { NativeDocRef, Unsubscribe, DocRef, Value, Snapshot } from './types'
import { QueryAdapter } from '@memoic/core/types'
import type { DocumentSnapshot } from 'firebase/firestore'

// Sad, but necessary because we need to hackishly accommodate both v8 and v9
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-var-requires */

export const useSubscription = <Fn extends QueryAdapter>(
  ref: DocRef<Value<Fn>> | NativeDocRef<Value<Fn>>,
) =>
  useCallback(
    (
      callback: (data: Value<Fn> & { id: string }) => void,
      onError: (error: Error) => void,
    ): Unsubscribe => {
      if (isLegacyRef(ref)) {
        // @ts-ignore
        return ref.onSnapshot({
          next: (snapshot: Snapshot<Value<Fn>>) =>
            callback({ id: snapshot.id, ...(snapshot.data() as Value<Fn>) }),
          error: onError,
        }) as Unsubscribe
      }
      // unnecessary else but used for code splitting in tsup
      // @ts-ignore
      if (!ref.onSnapshot) {
        // @ts-ignore
        const { onSnapshot } = require('firebase/firestore')
        return onSnapshot(
          ref as DocRef<Value<Fn>>,
          (snapshot: DocumentSnapshot<Value<Fn>>) =>
            callback({ id: snapshot.id, ...(snapshot.data() as Value<Fn>) }),
          onError,
        ) as Unsubscribe
      }
      throw Error(
        'Missing onSnapshot method. Make sure your function returns DocumentReference or CollectionReference in v8 or you have >=v9 of firebase/firestore installed.',
      )
    },
    [ref],
  )
