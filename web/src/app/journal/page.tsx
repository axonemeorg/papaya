'use server'

import JournalPage from "@/components/journal/JournalPage";
import { getTodayYearAndMonth } from "@/utils/Utils";
import dayjs from "dayjs";

export default async function() {
    const { year, month } = getTodayYearAndMonth();

    return (
        <JournalPage month={month} year={year} />
    )
}
