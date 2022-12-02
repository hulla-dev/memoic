import { createMemoic, query } from '@memoic/core'
import { getById } from './getters'

export const queries = {
  staffer: query(getById),
}

export const { get, prefetch } = createMemoic(queries)
