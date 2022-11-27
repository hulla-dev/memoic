export function entries<O extends Record<string, unknown>>(obj: O) {
  return Object.entries(obj) as [keyof O, O[keyof O]][]
}

export function seconds(seconds: number) {
  return seconds * 1000
}
