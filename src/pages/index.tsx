import { Container, Typography } from '@mui/material'
import Head from 'next/head'

export default function Home() {
	return (
		<>
			<Head>
				<title>Webcam warp</title>
				<meta name="description" content="@TODO" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<Container>
				<Typography variant="h1">Webcam warp</Typography>
				<Typography variant="h2">Pick a camera</Typography>
				@TODO
			</Container>
		</>
	)
}
