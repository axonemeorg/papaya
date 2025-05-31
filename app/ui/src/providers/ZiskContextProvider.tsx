import { ZiskContext } from '@ui/contexts/ZiskContext'
import { updateSettings } from '@ui/database/actions'
import { useZiskMeta } from '@ui/hooks/queries/useZiskMeta'
import { ZiskMeta } from '@ui/schema/documents/ZiskMeta'
import { UserSettings } from '@ui/schema/models/UserSettings'
import { PropsWithChildren, useState } from 'react'

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
        },
      }
    })
    await updateSettings(newSettings)
  }

  const context: ZiskContext = {
    ziskMeta: getZiskMetaQuery.data,
    updateSettings: updateZiskSettings,
  }

  return <ZiskContext.Provider value={context}>{props.children}</ZiskContext.Provider>
}
