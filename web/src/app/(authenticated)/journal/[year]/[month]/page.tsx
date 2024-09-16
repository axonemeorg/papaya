'use server'

import JournalPage from "@/components/journal/JournalPage";
import { useParams } from "next/navigation";

export default async function JournalYearMonthPage({ params }: { params: any }) {
    const month = Number(params.month);
    const year = Number(params.year);

    return (
        <JournalPage month={month} year={year} />
    )
}
