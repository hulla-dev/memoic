import React from 'react'
import { get } from '../memoic'

export default function Child() {
  const { data } = get('user', ['made-up-id-148149891'])

  return (
    <>
      <p>{data?.id}</p>
      <p>{data?.name}</p>
    </>
  )
}
