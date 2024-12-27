import { Alert, Avatar, Box, Button, Stack, ToggleButtonGroup, Typography } from "@mui/material"
import SettingsSectionHeader from "./SettingsSectionHeader"
import { useContext } from "react"
import { JournalContext } from "@/contexts/JournalContext"
import RadioToggleButton from "../input/RadioToggleButton"


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
                            description='Sync your journal with Zisk Cloud to access it from anywhere'
                            value='CLOUD'
                        />
                        <RadioToggleButton
                            heading='Local'
                            description='Keep your journal on this device only'
                            value='LOCAL'
                        />
                        <RadioToggleButton
                            heading='Custom Server'
                            description='Sync your journal with an unmanaged custom server'
                            value='CUSTOM'
                        />
                        
                    </ToggleButtonGroup>
                </Box>
            </section>
        </Stack>
        
    )
}