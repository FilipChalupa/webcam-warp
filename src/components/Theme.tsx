import { CssBaseline } from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import type { FunctionComponent, ReactNode } from 'react'

export const Theme: FunctionComponent<{ children: ReactNode }> = ({
	children,
}) => {
	const theme = createTheme({
		palette: {
			mode: 'dark',
		},
	})

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			{children}
		</ThemeProvider>
	)
}
