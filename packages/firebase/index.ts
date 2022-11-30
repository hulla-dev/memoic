import { useDoc } from './useDoc'
import type { Plugin } from '@memoic/core'

export const firebase: Plugin = {
  get: useDoc,
}
