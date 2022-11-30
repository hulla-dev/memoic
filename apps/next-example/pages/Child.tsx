import React from 'react'
import { get } from '../memoic'

export default function Child() {
  const { data } = get('staffer', ['rf8a98f1ffjk1'])

  return (
    <>
      <p>{data?.id}</p>
      <p>{data?.name}</p>
    </>
  )
}
