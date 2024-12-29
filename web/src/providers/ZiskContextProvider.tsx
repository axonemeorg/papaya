import { ZiskContext } from "@/contexts/ZiskContext"
import { getOrCreateZiskMeta } from "@/database/queries"
import { useQuery } from "@tanstack/react-query"
import { PropsWithChildren } from "react"

export default function ZiskContextProvider(props: PropsWithChildren) {
    const getZiskMetaQuery = useQuery<ZiskContext>({
        queryKey: ['ziskMeta'],
        queryFn: getOrCreateZiskMeta,
        initialData: null,
        enabled: true,
    })

    return (
        <ZiskContext.Provider value={getZiskMetaQuery.data}>
            {props.children}
        </ZiskContext.Provider>
    )
}
