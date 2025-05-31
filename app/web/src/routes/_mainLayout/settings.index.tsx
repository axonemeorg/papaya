import { createFileRoute, redirect } from '@tanstack/react-router'
import { DEFAULT_SETTINGS_TAB } from '@zisk/ui/components/settings/ManageSettings'

export const Route = createFileRoute('/_mainLayout/settings/')({
  loader: () => {
    throw redirect({
      to: '/settings/$section',
      params: {
        section: DEFAULT_SETTINGS_TAB,
      },
    })
  },
})
