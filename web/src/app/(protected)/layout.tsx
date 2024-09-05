'use server'

import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";
import { PropsWithChildren } from "react";

export default async function ProtectedPageLayout(props: PropsWithChildren) {
    const { user } = await validateRequest();

    if (!user) {
        redirect('/login');
    }

    return props.children
}
