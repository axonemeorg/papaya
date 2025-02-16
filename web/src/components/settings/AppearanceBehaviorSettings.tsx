import { Alert, Button, Link, Paper, Stack, Typography } from "@mui/material"
import SettingsSectionHeader from "./SettingsSectionHeader"
import React, { useContext, useState } from "react"
import { ZiskContext } from "@/contexts/ZiskContext"

export default function AppearanceBehaviorSettings() {
    const ziskContext = useContext(ZiskContext)

    if (!ziskContext.data) {
        return (
            <></>
        )
    }

    const appearanceSettings = ziskContext.data.settings.appearance


    return (
        <>
            <Stack gap={3}>
                <section>
                    <SettingsSectionHeader title='Appearance' />
                    <Typography variant='body2' color='textSecondary' mb={2}>
                        Customize.
                    </Typography>
                </section>
            </Stack>
        </>
    )
}
