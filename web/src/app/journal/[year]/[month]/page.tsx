'use server'

import JournalPageContent from "@/components/journal/JournalPage";
import { useParams } from "next/navigation";

export default async function JournalPage({ params }) {
    const month = Number(params.month);
    const year = Number(params.year);

    return (
        <JournalPageContent month={month} year={year} />
    )
}
