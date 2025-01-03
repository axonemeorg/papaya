import ManageSettings from "@/components/settings/ManageSettings";
import { Container } from "@mui/material";
import { getLayout } from '@/layouts/main'

export default function SettingsPage() {
    return (
        <Container maxWidth="md" disableGutters sx={{ pt: 1, pl: 1, pr: 3, mx: 2 }}>
            <ManageSettings />
        </Container>
    )
}

SettingsPage.getLayout = getLayout
