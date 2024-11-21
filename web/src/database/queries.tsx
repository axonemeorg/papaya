import { Category, JournalEntry } from "@/types/schema";
import { db } from "./client";
import { JournalEditorView } from "@/components/journal/JournalEditor";
import dayjs from "dayjs";

export const getCategories = async (): Promise<Record<Category['_id'], Category>> => {
    const result = await db.find({
        selector: {
            type: 'CATEGORY',
        }
    });

    return Object.fromEntries((result.docs as Category[]).map(category => [category._id, category]));
}

export const getJournalEntries = async (view: JournalEditorView, date: string): Promise<Record<JournalEntry['_id'], JournalEntry>> => {
    const startDate = dayjs(date)
        .startOf(view)
        .format('YYYY-MM-DD');

    const endDate = dayjs(date)
        .endOf(view)
        .format('YYYY-MM-DD');

    const result = await db.find({
        selector: {
            type: 'JOURNAL_ENTRY',
            date: {
                $gte: startDate,
                $lte: endDate,
            }
        }
    });

    return Object.fromEntries((result.docs as JournalEntry[])
        .map(entry => [entry._id, entry]));
}
