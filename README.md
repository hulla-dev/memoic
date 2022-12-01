# Memoic :brain::zap:
> "Fetching for users, written for devs" 

## What is it about? :thinking:

For the longest time ever fetching has been a headache and it felt like **a compromise between**
 - having super **complex fetching setup**, that is **awesome for users**, but makes your new dev **hires quit their job after 2 months**
 - a **barebones fetching logic** that is easy to work with, but loading screens are inseparable part of your application
 
This is where **Memoic** comes in! A package, that delivers both an awesome UX with pre-fetching, fetching and caching, ready with integrations for major framework/DB setups like [`Firebase`](packages/firebase), Supabase, MongoDB, etc. 

## Features :gem:


### Simple
Tired of inconsistent `useEffect` behavior, asynchronous wrappers, pessimistic loading states?  Memoic comes with simple one-liner that handles everything for you. 

Not to mention, it provides caching for your next hits straight out of the box!

```tsx
function YourComponent() {
  const { data, isLoading, error } = get('preferences') // ✅ always ready and deterministic
}
```

### Smart
The get method with automatically handle the component life cycle and prop / state changes for you.

```tsx
function UserCart({ id }: { id: string }) {
  const { data } = get('user', [id]) // 🧠 Refetches and revalidates on id change 
}
```

### Typesafe
Memoic ensures, that you always query for correct data with correct parameters

```tsx
function Usercart() {
  const { data } = get('user', [42]) // ⛔️ Throws error, expects type string
}
```

### Extensible
Comes pre-packaged with **optional** extensions. They do not muddy the internal core itself, but are extensible part of memoic that you can opt into. Memoic so far supports the following plugins/extensions

- [`React Native`](packages/native)
- [`Firebase`](packages/firebase)
- `Supabase` - in progress
- ...

### And much more
This is only tip of the iceberg and we can include only so much into a single git page. But there is a lot more cool stuff you can do, like pre-fetching on trigger, infinite queries, type inferrence from getters and much more!

## Installation :bricks:
Follow the instructions depending on your use-case.

- [`@memoic/core`](packages/core) - The core of Memoic. Required for other extensions to work
- [`@memoic/native`](packages/native) - React native adapter
- [`@memoic/firebase`](packages/firebase) - Firebase adapter

## Credits  ❤️
This package would not be possible without the awesome work of [`@tanstack/query`](https://github.com/TanStack/query). As a matter of fact, if you are already using `@tanstack/react-query`, you can directly use the exported functions and they will work in unison with memoic! 😉
