import { createMemoic, query } from '@memoic/core'
import { getById, getStafferById } from './getters'

export const queries = {
  staffer: query(getStafferById),
}

export const { get, prefetch } = createMemoic(queries)
