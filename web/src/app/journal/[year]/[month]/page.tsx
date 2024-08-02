'use server'

import Journal from "@/components/journal/Journal";
import { useParams } from "next/navigation";

export default async function JournalPage({ params }) {
    const month = Number(params.month);
    const year = Number(params.year);

    return (
        <Journal month={month} year={year} />
    )
}
