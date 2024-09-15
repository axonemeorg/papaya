import { Stack, TextField } from "@mui/material";


export default function SignupForm() {
    return (
        <Stack gap={2}>
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
        </Stack>
    );
}
