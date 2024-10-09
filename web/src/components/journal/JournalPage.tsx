'use server'

import { getAllUserCategories } from "@/actions/category-actions";
import { getUserJournalEntriesByMonthAndYear } from "@/actions/journal-actions";
import { validateRequest } from "@/auth";
import { JournalDate } from "@/types/calendar";
import JournalEditor from "./JournalEditor";

interface JournalPageProps extends JournalDate {}

export default async function JournalPage(props: JournalPageProps) {
    const { month, year } = props;
    const { user } = await validateRequest();

    if (!user) {
        return <></>
    }

    const journalEntries = await getUserJournalEntriesByMonthAndYear(month, year);
    const categories = await getAllUserCategories();

    return (
        <JournalEditor
            user={user}
            month={month}
            year={year}
            journalEntries={journalEntries}
            categories={categories}
        />
    )
}
