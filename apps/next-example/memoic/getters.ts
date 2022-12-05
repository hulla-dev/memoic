export async function getById(id: number) {
  return {
    id,
    name: 'Foo Barrington',
  }
}

export function getUsers() {
  return [{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }]
}
