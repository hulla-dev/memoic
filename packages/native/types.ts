import type {
  RefetchOptions,
  RefetchQueryFilters,
  QueryObserverResult,
} from '@tanstack/react-query'

export type RefetchFn<Return = unknown> = (
  options?: RefetchOptions & RefetchQueryFilters<Return>,
) => Promise<QueryObserverResult<Return, unknown>>
