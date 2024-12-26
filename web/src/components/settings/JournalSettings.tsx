import { Stack } from "@mui/material"
import SettingsSectionHeader from "./SettingsSectionHeader"


export default function JournalSettings() {
    return (
        <Stack spacing={2}>

            <section>
                <SettingsSectionHeader title='Syncing' />
            </section>
            <section>
                <SettingsSectionHeader title='Import & Export' />
            </section>
            <section>
                <SettingsSectionHeader title='About' />
            </section>
        </Stack>
        
    )
}