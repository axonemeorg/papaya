'use client'

import { signup } from "@/actions/auth-actions";
import { ArrowBack } from "@mui/icons-material";
import { Button, Stack, TextField } from "@mui/material";
import Link from "next/link";

export default function SignupForm() {
    return (
        <form action={signup}>
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
                <Stack direction='row' sx={{ width: '100%' }} justifyContent={'flex-end'} gap={1}>
                    <Link href='/login'>
                        <Button type='submit' startIcon={<ArrowBack />}>Back</Button>
                    </Link>
                    <Button variant='contained' type='submit'>Join</Button>
                </Stack>
            </Stack>
        </form>
    );
}
