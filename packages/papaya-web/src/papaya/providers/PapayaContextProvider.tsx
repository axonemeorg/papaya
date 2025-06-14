import { NotificationsContext } from '@/contexts/NotificationsContext'
import { PapayaContext } from '@/contexts/PapayaContext'
import { updateSettings } from '@/database/actions'
import { usePapayaMeta } from '@/hooks/queries/usePapayaMeta'
import { PapayaMeta } from '@/schema/documents/PapayaMeta'
import { UserSettings } from '@/schema/models/UserSettings'
import { PropsWithChildren, useContext, useState } from 'react'

export default function PapayaContextProvider(props: PropsWithChildren) {
  const [papayaMeta, setPapayaMeta] = useState<PapayaMeta | null>(null)

  const getPapayaMetaQuery = usePapayaMeta()

  const notificationsContext = useContext(NotificationsContext)

  // useEffect(() => {
  //   notificationsContext.alert({
  //     title: 'Test Alert',
  //     description: 'This is a test alert.',
  //     promptDismissal: true,
  //   })
  // }, [])

  const updatePapayaSettings = async (newSettings: Partial<UserSettings>): Promise<void> => {
    setPapayaMeta((prev) => {
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

  const context: PapayaContext = {
    papayaMeta: getPapayaMetaQuery.data,
    updateSettings: updatePapayaSettings,
  }

  return <PapayaContext.Provider value={context}>{props.children}</PapayaContext.Provider>
}
