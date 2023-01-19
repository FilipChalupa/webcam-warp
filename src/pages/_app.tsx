import type { AppProps } from 'next/app'
import { Theme } from '../components/Theme'
import '../styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
	return (
		<Theme>
			<Component {...pageProps} />
		</Theme>
	)
}
