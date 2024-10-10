'use server'

import JournalPage from "@/components/journal/JournalPage";
import { getTodayYearAndMonth } from "@/utils/Utils";

export default async function() {
    const { year, month } = getTodayYearAndMonth();

    return (
        <JournalPage month={month} year={year} />
    )
}
