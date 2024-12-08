import { JournalAllFilters, JournalFilters } from "@/components/journal/JournalFilters"
import { JOURNAL_FILTER_KEY_DESERIALIZER, JOURNAL_FILTER_KEY_SERIALIZER, JOURNAL_FILTER_SHORTHAND_KEY_MAP, JOURNAL_FILTER_SHORTHAND_KEY_MAP_INVERSE } from "@/constants/filters"
import { useRouter } from "next/router"
import { useMemo } from "react"

export function serializeJournalFilters(filters: JournalFilters): Record<string, string> {
    const result: Record<string, string> = {}

    // Use Object.keys and then cast to (keyof JournalAllFilters)[]
    for (const key of Object.keys(filters) as (keyof JournalAllFilters)[]) {
        const val = filters[key]
        // Check that val is defined and that key is in the shorthand map
        if (val !== undefined && key in JOURNAL_FILTER_SHORTHAND_KEY_MAP) {
            const shorthand = JOURNAL_FILTER_SHORTHAND_KEY_MAP[key]
            const serializer = JOURNAL_FILTER_KEY_SERIALIZER[key] as (value: any) => string
            result[shorthand] = serializer(val)
        }
    }

    return result
}

export function deserializeJournalFilters(record: Record<string, string>): JournalFilters {
    const result: JournalFilters = {}

    for (const shorthandKey of Object.keys(record)) {
        const value = record[shorthandKey]
        // Ensure we have a matching original key
        if (shorthandKey in JOURNAL_FILTER_SHORTHAND_KEY_MAP_INVERSE) {
            const originalKey = JOURNAL_FILTER_SHORTHAND_KEY_MAP_INVERSE[shorthandKey]
            const deserializer = JOURNAL_FILTER_KEY_DESERIALIZER[originalKey]
            result[originalKey] = deserializer(value) as any
        }
    }

    return result
}

export default function useQueryFilters() {
    const router = useRouter()

    const filters: JournalFilters = useMemo(() => {
        const query = router.query
        const sanitizedQuery = Object.fromEntries(
            Object.entries(query)
            .map(([key, value]) => [key, value ?? ''])
        )
       
        return deserializeJournalFilters(sanitizedQuery as Record<string, string>)
    }, [router.query])

    const setFilters = (filters: JournalFilters) => {
        const serializedFilters = serializeJournalFilters(filters)
        router.push({
            query: serializedFilters
        })
    }

    return { filters, setFilters }
}
