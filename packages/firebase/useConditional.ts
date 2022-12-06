import { useCallback } from 'react'
import type { AnyFn } from './types'

export function useConditional<Met extends AnyFn, NotMet extends AnyFn>(
  condition: boolean,
  met: Met,
  notMet: NotMet,
) {
  return useCallback(
    (...args: any[]) => {
      if (condition) {
        return met(...args) as ReturnType<Met>
      }
      return notMet(...args) as ReturnType<NotMet>
    },
    [condition, met, notMet],
  )
}
