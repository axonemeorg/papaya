import { DateViewSymbol } from '@/types/schema'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_mainLayout/journal/')({
//   component: Outlet,
  loader: () => {
    throw redirect({
        to: '/journal/$view/$',
        params: { view: DateViewSymbol.MONTHLY, d: undefined, m: undefined, y: undefined }
    })
  },
})
