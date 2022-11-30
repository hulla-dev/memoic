# Memoic :brain::zap:
> "Fetching for users, written for devs" 

## What is it about? :thinking:

For the longest time ever fetching has been a headache and it felt like **a compromise between**
 - having super **complex fetching setup**, that is **awesome for users**, but makes your new dev **hires quit their job after 2 months**
 - a **barebones fetching logic** that is easy to work with, but loading screens are inseparable part of your application
 
This is where **Memoic** comes in! A package, that delivers both an awesome UX with pre-fetching, fetching and caching, ready with integrations for major framework/DB setups like [`Firebase`](https://github.com/samuelhulla/memoic/packages/firebase), Supabase, MongoDB, etc. 

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

- [`React Native`](https://github.com/samuelhulla/memoic/packages/native)
- [`Firebase`](https://github.com/samuelhulla/memoic/)
- `Supabase` - in progress
- and more

## Installation :bricks:
Follow the instructions depending on your use-case. *The main part of Memoic is `@memoic/core` and is required for the other extensions to work

- [`@memoic/core`](https://github.com/samuelhulla/memoic/packages/core) - The core of Memoic. Required for other extensions to work
- [`@memoic/native`](https://github.com/samuelhulla/memoic/packages/native) - React native adapter
- [`@memoic/firebase`](https://github.com/samuelhulla/memoic/packages/firebase) - Firebase adapter

