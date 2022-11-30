import { ApplyArgs, AsyncFn, ExcludeParams } from './types'

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
