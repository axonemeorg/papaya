'use server'

import Journal from "@/components/journal/Journal";
import { getTodayYearAndMonth } from "@/utils/Utils";
import dayjs from "dayjs";

export default async function() {
    const { year, month } = getTodayYearAndMonth();

    return (
        <Journal month={month} year={year} />
    )
}
