import { ZiskContext } from "@/contexts/ZiskContext"
import { updateSettings } from "@/database/actions"
import { getOrCreateZiskMeta } from "@/database/queries"
import { useZiskMeta } from "@/hooks/queries/useZiskMeta"
import { ZiskMeta } from "@/schema/documents/ZiskMeta"
import { UserSettings } from "@/schema/models/UserSettings"
import { useQuery } from "@tanstack/react-query"
import { PropsWithChildren, useEffect, useState } from "react"

export default function ZiskContextProvider(props: PropsWithChildren) {
    const [ziskMeta, setZiskMeta] = useState<ZiskMeta | null>(null)

    const getZiskMetaQuery = useZiskMeta()

    const updateZiskSettings = async (newSettings: Partial<UserSettings>): Promise<void> => {
        setZiskMeta((prev) => {
            if (!prev) {
                return null
            }
            return {
                ...prev,
                userSettings: {
                    ...prev.userSettings,
                    ...newSettings,
                }
            }
        })
        await updateSettings(newSettings)
    }

    const context: ZiskContext = {
        ziskMeta: getZiskMetaQuery.data,
        updateSettings: updateZiskSettings,
    }

    return (
        <ZiskContext.Provider value={context}>
            {props.children}
        </ZiskContext.Provider>
    )
}
