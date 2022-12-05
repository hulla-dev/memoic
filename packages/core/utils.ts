import type { UseQueryOptions } from '@tanstack/react-query'
import { ApplyArgs, AsyncFn, Defined, ExcludeParams } from './types'

export function entries<O extends Record<string, unknown>>(obj: O) {
  return Object.entries(obj) as [keyof O, O[keyof O]][]
}

export function seconds(seconds: number) {
  return seconds * 1000
}

export function apply<Fn extends AsyncFn, Params extends ApplyArgs<Fn> & unknown[]>(
  fn: Fn,
  ...aplyArgs: Params
) {
  return (...args: ExcludeParams<Params, Parameters<Fn>>) =>
    fn(...aplyArgs, ...args) as ReturnType<Fn>
}

export function canEnable<T extends readonly unknown[] | undefined>(arr: T | Defined<T>[]): arr is Array<Defined<T>> {
  // If the query has no dependencies it will always be enabled
  if (arr === undefined) {
    return true
  }
  // Otherwise only enable it if all dependencies are provided
  return arr.every((item) => item !== undefined)
}

export function getOptions<T, D extends readonly unknown[]>(options?: UseQueryOptions<T>, deps?: D) {
  if (options === undefined) {
    return { enabled: canEnable(deps) }
  }
  return options.enabled !== undefined
    ? options
    : { ...options, enabled: canEnable(deps) }
}