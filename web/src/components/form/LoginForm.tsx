'use client'

import { login } from "@/actions/auth-actions";
import { Button, Stack, TextField } from "@mui/material";
import Link from "next/link";


export default function LoginForm() {
    return (
        <form action={login}>
            <Stack gap={2} alignItems={'flex-start'}>
                <TextField
                    label='Email'
                    name='username'
                    id='username'
                    fullWidth
                    autoFocus
                />
                <TextField
                    label='Password'
                    name='password'
                    id='password'
                    type='password'
                    fullWidth
                />
                <Button size='small'>Forgot password?</Button>
                <Stack direction='row' sx={{ width: '100%' }} justifyContent={'flex-end'} gap={1}>
                    <Link href='/signup'>
                        <Button variant='text'>Sign up</Button>
                    </Link>
                    <Button variant='contained' type='submit'>Next</Button>
                </Stack>
            </Stack>
        </form>
    );
}
