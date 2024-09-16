'use server'

import { getJournalDateUrl } from "@/utils/Utils";
import dayjs from "dayjs";
import { redirect } from "next/navigation";

export default async function({ params }: { params: any }) {
    const year = Number(params.year);
    const month = 1;

    redirect(getJournalDateUrl({ month, year }));
}
