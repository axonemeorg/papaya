import { Check, Info } from "@mui/icons-material";
import { Alert, Button, Link, Stack, Typography } from "@mui/material";
import SettingsSectionHeader from "./SettingsSectionHeader";

const ZISK_CLOUD_DOCS_URL = 'https://github.com/curtisupshall/zisk/tree/master/server'

export default function AccountSettings() {
    return (
        <Stack spacing={2}>
            <section>
                <SettingsSectionHeader title='Account' />
                <Alert icon={<Info fontSize="inherit" />} severity="info" action={<Button>Sign In</Button>}>
                    Sign in to access your account settings
                </Alert>
            </section>
            <section>
                <SettingsSectionHeader title='Zisk Cloud' />
                <Typography variant='body2'>Zisk Cloud is a managed sync service that keeps your data up to date across all your devices. <Link href={ZISK_CLOUD_DOCS_URL}>Learn more</Link></Typography>
                <Alert icon={<Check fontSize="inherit" />} severity="success" sx={{ mt: 1 }}>
                    Cloud sync will always be free while Zisk is in alpha.
                </Alert>
            </section>
        </Stack>
    )
}
