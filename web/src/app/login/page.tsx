'use client'

import { alpha, Avatar, Button, Container, Grid, IconButton, Paper, Stack, TextField, Typography } from "@mui/material";
import { login } from "@/actions/auth-actions";
import { Close } from "@mui/icons-material";


export default function LoginPage() {
	return (
		<Paper
			square
			sx={(theme) => ({
				minWidth: '100vw',
				minHeight: '100vh',
				background: theme.palette.mode === 'light'
					? alpha(theme.palette.primary.main, 0.1)
					: undefined,
				// background: alpha(theme.palette.primary.main, 0.1),
			})}>
			<Stack sx={{ minHeight: '100vh'}} justifyContent={'center'}>
				<Container maxWidth='lg' disableGutters sx={{ px: 16 }}>
					<Paper variant='outlined' sx={{ borderRadius: 6, p: 6 }}>
						<Stack spacing={3}>
							<Stack direction='row' justifyContent='space-between' alignItems='flex-start'>
								<img src='/images/logo64.png' style={{ width: 48 }}/>
								<IconButton>
									<Close />
								</IconButton>
							</Stack>
							<form action={login}>
								<Grid container columns={2} mb={4}>
									<Grid item xs={1}>
										<Typography variant='h4' mb={1}>Sign in</Typography>
										<Typography>Start using Zisk</Typography>
									</Grid>
									<Grid item xs={1}>
										<Stack gap={2}>
											<TextField
												label='Username'
												name='username'
												id='username'
												fullWidth
												// variant='filled'
												// size='small'
											/>
											<TextField
												label='Password'
												name='password'
												id='password'
												type='password'
												fullWidth
												// variant='filled'
												// size='small'
											/>
										</Stack>
									</Grid>
								</Grid>
								<Stack direction='row' justifyContent={'flex-end'} gap={1}>
									<Button variant='text'>Sign up</Button>
									<Button variant='contained' type='submit'>Continue</Button>
								</Stack>
							</form>
						</Stack>
					</Paper>
				</Container>
			</Stack>
		</Paper>
	);
}
