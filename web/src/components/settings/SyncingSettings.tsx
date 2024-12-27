import { Alert, Avatar, Box, Button, Link, Stack, ToggleButtonGroup, Typography } from "@mui/material"
import SettingsSectionHeader from "./SettingsSectionHeader"
import { useContext } from "react"
import { JournalContext } from "@/contexts/JournalContext"
import RadioToggleButton from "../input/RadioToggleButton"
import { ZISK_CLOUD_DOCS_URL } from "./AccountSettings"
import CustomServerForm from "../form/CustomServerForm"


export default function SyncingSettings() {
    const journalContext = useContext(JournalContext)

    const journal = journalContext.journal

    if (!journal) {
        return (
            <Alert />
        )
    }

    return (
        <Stack spacing={2}>
            <section>
                <SettingsSectionHeader title='Syncing Strategy' />
                <Box pt={2}>
                    <ToggleButtonGroup exclusive orientation="vertical">
                        <RadioToggleButton
                            selected
                            heading='Zisk Cloud'
                            description='Sync your journals with Zisk Cloud to access it from anywhere'
                            value='CLOUD'
                        />
                        <RadioToggleButton
                            heading='Local'
                            description='Keep your journals on this device only'
                            value='LOCAL'
                        />
                        <RadioToggleButton
                            heading='Advanced'
                            description='Sync your journal with a Zisk server hosted by you'
                            value='CUSTOM'
                        />
                        
                    </ToggleButtonGroup>
                </Box>
            </section>
            <section>
                <SettingsSectionHeader title='Your Custom Servers' />
                <Typography variant="body2" mb={2}>
                    A custom server allows you to host your own Zisk server and sync your journals with it. This is useful if you want to keep your data private and secure. <Link href={ZISK_CLOUD_DOCS_URL}>Learn more</Link>
                </Typography>
                <Box py={1}>
                    <CustomServerForm />
                </Box>
            </section>
        </Stack>
        
    )
}