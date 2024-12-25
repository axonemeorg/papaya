import { Check, Info } from "@mui/icons-material";
import { Alert, Button, Divider, Link, Stack, Typography } from "@mui/material";

const ZISK_CLOUD_DOCS_URL = 'https://github.com/curtisupshall/zisk/tree/master/server'

export default function AccountSettings() {
    return (
        <Stack spacing={2}>
            <section>
                <Typography variant='h6'>Account</Typography>
                <Divider sx={{ mt: 1, mb: 2 }} />
                {/* user is NOT signed in, prompt them to sign in*/}
                <Alert icon={<Info fontSize="inherit" />} severity="info" action={<Button>Sign In</Button>}>
                    Sign in to access your account settings
                </Alert>
            </section>
            <section>
                <Typography variant='h6'>Zisk Cloud</Typography>
                <Divider sx={{ mt: 1, mb: 2 }} />
                <Typography variant='body2'>Zisk Cloud is a managed sync service that keeps your data up to date across all your devices. <Link href={ZISK_CLOUD_DOCS_URL}>Learn more</Link></Typography>
                <Alert icon={<Check fontSize="inherit" />} severity="success" sx={{ mt: 1 }}>
                    Cloud sync will always be free while Zisk is in alpha.
                </Alert>
            </section>
        </Stack>
    )
}
