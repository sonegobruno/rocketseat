import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { aceAccessibilityReporter } from '../utils/axeAccessibilityReporter'
import { useEffect } from 'react'

export default function App({ Component, pageProps }: AppProps) {

  useEffect(() => {
    aceAccessibilityReporter()
  }, [])

  return <Component {...pageProps} />
}
