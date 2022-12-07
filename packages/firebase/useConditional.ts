import { useCallback } from 'react'
import type { AnyFn } from './types'

export function useConditional(condition: number, ...fn: AnyFn[]) {
  return useCallback(
    (...args: Parameters<typeof fn[number]>) => fn[condition](...args),
    [condition, fn],
  )
}
