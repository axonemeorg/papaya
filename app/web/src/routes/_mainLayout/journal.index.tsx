import { createFileRoute, redirect } from '@tanstack/react-router'
import { DateViewVariant } from '@zisk/ui/schema/support/search/facet'

export const Route = createFileRoute('/_mainLayout/journal/')({
  loader: () => {
    throw redirect({
      to: '/journal/$view/$',
      params: { view: DateViewVariant.MONTHLY, d: undefined, m: undefined, y: undefined },
      search: { tab: 'journal' },
    })
  },
})
