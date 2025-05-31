import { QueryClient } from '@tanstack/react-query'
import { createRootRoute, Outlet } from '@tanstack/react-router'
import ZiskProviders from '@zisk/ui/providers'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
})

export const Route = createRootRoute({
  component: () => (
    <ZiskProviders queryClient={queryClient}>
      <Outlet />
    </ZiskProviders>
  ),
})
