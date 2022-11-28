import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Memoic } from 'memoic'
import { queries } from '../memoic'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Memoic queries={queries}>
      <Component {...pageProps} />
    </Memoic>
  )
}
