import { createMemoic, query } from '@memoic/core'
import { getById, getUsers } from './getters'

export const queries = {
  user: query(getById),
  users: query(getUsers),
}

export const { get, prefetch } = createMemoic(queries)
