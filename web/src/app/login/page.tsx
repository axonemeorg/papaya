'use client'

import { Avatar, Button, Container, DialogActions, Grid, Paper, Stack, TextField, Typography } from "@mui/material";
import { login } from "@/actions/auth-actions";


export default function Page() {
	return (
		<Paper square sx={(theme) => ({ minWidth: '100vw', minHeight: '100vh', background: theme.palette.primary.main })}>
			<Container maxWidth='lg' disableGutters sx={{ px: 16 }}>
				<Paper sx={{ borderRadius: 4, p: 6 }} elevation={0}>
					<Stack spacing={3}>
						<Avatar />
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
											size='small'
										/>
										<TextField
											label='Password'
											name='password'
											id='password'
											type='password'
											fullWidth
											// variant='filled'
											size='small'
										/>
									</Stack>
								</Grid>
							</Grid>
							<Stack direction='row' justifyContent={'flex-end'} gap={1}>
								<Button variant='text'>Sign up</Button>
								<Button variant='contained'>Continue</Button>
							</Stack>
						</form>
					</Stack>
				</Paper>
			</Container>
		</Paper>
	);
}



