import MainLayout from "@/layouts/main";
import { createFileRoute, Outlet } from "@tanstack/react-router";


export const Route = createFileRoute('/_mainLayout/')({
    component: PathlessLayoutComponent
})

function PathlessLayoutComponent() {
    return (
        <MainLayout>
            <Outlet />
        </MainLayout>
    )
}
