import React from 'react'
import { get } from '../memoic'

export default function Child() {
  const { data } = get('staffer', 2)
  return (
    <>
      <p>{data?.id}</p>
      <p>{data?.name}</p>
    </>
  )
}
