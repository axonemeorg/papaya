import { createFileRoute, Outlet } from '@tanstack/react-router'
import MainLayout from '@zisk/ui/layouts/main'

export const Route = createFileRoute('/_mainLayout')({
  component: PathlessLayoutComponent,
})

function PathlessLayoutComponent() {
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  )
}
