import { createMemoic, query } from 'memoic'
import { getById } from './getters'

export const queries = {
  staffer: query(getById),
}

export const { get } = createMemoic(queries)
