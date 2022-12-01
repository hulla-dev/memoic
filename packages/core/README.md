# `@memoic/core` 🔩

## Installation 🧱

First you'll need to install the package itself to your `node_modules`

```zsh
# npm
npm install @memoic/core

# yarn
yarn add @memoic/core

# pnpm
pnpm add @memoic/core
```

## Setup 🛠️

Before we begin, one important note

> **Note**  
> It's strongly recommended to create your memoic folder inside wherever your project rootDir is.
> If your app has `./src` or any other structure, accomodate your structure accordingly. We will presume a rootDir of `./` for this documentation
> ```js
> // tsconfig.json
> {
>   "compilerOptions": {
>      "rootDir": "./"
>   }
> }
> ```

First we'll need to define our queries

```tsx
// ./memoic/index.ts
import { query, createMemoic } from '@memoic/core'

// doesnt have to be fetch, any function that returns a Promise works! ℹ️
const getUserById = async (id: string) => fetch(`yourAPI/user/${id}`).then(res => res.json())


export const queries = {
  user: query(getUserById)
  memoic: query(async () => 'awesome')
}

export const { get, prefetch } = createMemoic(queries) // this prepares the fetching, cache and type-safety for us ✅
```

There are some advanced tricks you can do inside the set-up, like extending your functions with default params, pre-fetching and so on, but we'll tackle that later 😉

Now one last step is remaining. Adding a cache / query provider to your application!

```tsx
// ./App.tsx
import { Memoic } from '@memoic/core'
import { queries } from 'memoic' // <- this is the ./memoic/index.ts we defined earlier, just pointing to rootDir 🚀

export default function App() {
  // And just wrap your outer application layer. Just like you would with context
  return (
     <Memoic queries={queries}>
      {/* Your application code */}
     </Memoic>
  )
}
```

## Usage ⚡

We're ready to put memoic to use. Let's say we're are displaying a user's profile with some dashboard data on their initial login

```tsx
// ./components/User.tsx
import { get } from 'memoic'

function User({ id }: { id: string}) {
  const { data } = get('user', [id]) // this takes care of everything you need 🧠
  
  return (
    <p>Hello, {data?.name}!</p>
  )
}
```

And voilá, you're good to go. Everything is taken care of for you out of the box. Even if your user switched to different tab and then came back, he will actually get served straight away with the cached data, no loading screen and  in the meantime we'll perform a recalidation on background.

> **Info**
> For more advanced concepts, refer to the [wiki](https://github.com/samuelhulla/memoic/wiki)

