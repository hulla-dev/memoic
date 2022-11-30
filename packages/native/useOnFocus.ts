import { useCallback, useRef } from 'react'
import type { RefetchFn } from './types'

export function useOnFocus(refetch: RefetchFn, focusListener: (callback: () => void) => void) {
  const activeRef = useRef(false)
  focusListener(
    useCallback(() => {
      if (activeRef.current) {
        refetch()
      } else {
        activeRef.current = true
      }
    }, [refetch]),
  )
}
