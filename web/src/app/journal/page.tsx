'use server'

import Journal from "@/components/journal/Journal";
import dayjs from "dayjs";

export default async function() {
    const year = Number(dayjs().format('YYYY'));
    const month = Number(dayjs().format('M'));

    return (
        <Journal month={month} year={year} />
    )
}
