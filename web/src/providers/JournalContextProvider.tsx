import { JournalContext } from "@/contexts/JournalContext";
import { getCategories, getEntryTags } from "@/database/queries";
import { Category, EntryTag } from "@/types/schema";
import { useQuery } from "@tanstack/react-query";
import { PropsWithChildren } from "react";

export default function JournalContextProvider(props: PropsWithChildren) {
    const getCategoriesQuery = useQuery<Record<Category['_id'], Category>>({
        queryKey: ['categories'],
        queryFn: getCategories,
        initialData: {},
    });

    const getEntryTagsQuery = useQuery<Record<EntryTag['_id'], EntryTag>>({
        queryKey: ['entryTags'],
        queryFn: getEntryTags,
        initialData: {},
    });

    return (
        <JournalContext.Provider
            value={{
                getCategoriesQuery,
                getEntryTagsQuery,
            }}
        >
            {props.children}
        </JournalContext.Provider>
    );
}
