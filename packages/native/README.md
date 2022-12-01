# `@memoic/native` 📱

The adapter for `react-native` apps

> **Note**  
> **This adapter is optional**.  
> 
> Your fetching will work just fine with only `@memoic/core`. Only add the adapter if you requires any of the following
> functionality inside your `react-native` application
> - Re-fetching on connection loss
> - Re-fetching on app state change (i.e. switching between apps)
> - Re-fetching on focus on specific component

## Installation 🧱

Depending on your preferred package manager

```zsh
# npm
npm install @memoic/core @memoic/native

# yarn
yarn add @memoic/core @memoic/native

# pnpm
pnpm add @memoic/core @memoic/native
```


## Setup / Usage 🛠️
This guide presumes you already have done the [`@memoic/core` setup](/core). If not, please do it first and return here.


```tsx
// ./App.tsx
import { Memoic } from '@memoic/core'
import { useOnline, useAppState } from '@memoic/native'
import { queries } from 'memoic'

export default function App() {
  useOnline() // enables refetching if user loses connection on reconnect 🛰️
  useAppState() // enables refetching if user switches between apps (app state) 🪄
  
  return (
    <Memoic queries={queries}>
     {/* Your app code here */}
    </Memoic>
  )
}
```

Last but not least, you can enable re-fetching on focus (i.e. on certain field or even entire screen)

```tsx
// screens/Profile.tsx
import { useOnFocus } from '@memoic/native'
import { useFocusEffect } from '@react-navigation/native'
import { get } from 'memoic'

export default function Profile({ id ): { id: string }) {
  const { data, refetch } = get('user', [id])
  useOnFocus(refetch, useFocusEffect) / enables refetching on focus ✅
  // Note, you don't have to specifically use @react-navigation.
  // Can be any focus listener, or you can even create your own, it just needs to accepts a callback as first argument  ℹ️
}
```

And that's it. You can use the rest of your application just like you normally would with `@memoic/core`
