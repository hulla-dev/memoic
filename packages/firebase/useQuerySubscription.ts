import { useCallback } from 'react'
import type { CollectionReference, Query, QuerySnapshot } from 'firebase/firestore'
import type { FirebaseFirestoreTypes } from '@react-native-firebase/firestore'
import type {
  Unsubscribe,
  QueryVariation,
  Value,
  GetVariation,
} from './types'
import { isLegacyQuery } from './utils'

// Sad, but necessary because we need to hackishly accommodate both v8 and v9
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-var-requires */

export const useQuerySubscription = <Fn extends GetVariation>(
  ref:
    | FirebaseFirestoreTypes.CollectionReference<Value<Fn>>
    | CollectionReference<Value<Fn>>
    | FirebaseFirestoreTypes.Query<Value<Fn>>
    | Query<Value<Fn>>
) =>
  useCallback(
    (
      callback: (snap: Array<Value<Fn> & { id: string }>) => void,
      onError: (error: Error) => void,
    ): Unsubscribe => {
      if (isLegacyQuery(ref)) {
        // @ts-ignore
        return ref.onSnapshot({
          next: (snapshot: QuerySnapshot<Value<Fn>>) =>
            callback(snapshot.docs.map((doc) => ({ id: doc.id, ...(doc.data() as Value<Fn>) }))),
          error: onError,
        }) as Unsubscribe
      }
      // unnecessary else but used for code splitting in tsup
      // @ts-ignore
      if (!ref.onSnapshot) {
        // @ts-ignore
        const { onSnapshot } = require('firebase/firestore')
        return onSnapshot(
          ref as QueryVariation<Value<Fn>>,
          (snapshot: QuerySnapshot<Value<Fn>>) =>
            callback(snapshot.docs.map((doc) => ({ id: doc.id, ...(doc.data() as Value<Fn>) }))),
          onError,
        ) as Unsubscribe
      }
      throw Error(
        'Missing onSnapshot method. Make sure your function returns CollectionRefernece or Query in v8 or if you have >=v9 of firebase/firestore installed.',
      )
    },
    [ref],
  )
