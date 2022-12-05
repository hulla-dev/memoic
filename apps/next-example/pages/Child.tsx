import React from 'react'
import { get } from '../memoic'

export default function Child() {
  const { data: users, isFetching } = get('users', [])
  const { data } = get('user', [(users || [])[0]?.id])

  return (
    <>
      <h1>Users</h1>
      <ul>
        {users?.map((user) => (
          <li key={user.id}>{user.id}: {user.name}</li>
        ))}
      </ul>
      <h1>Fetched user</h1>
      <p>{data?.id}</p>
      <p>{data?.name}</p>
    </>
  )
}
