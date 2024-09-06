'use server'

import { getCategoriesByUserId } from "@/actions/category-actions";
import { getJournalEntriesByUserId } from "@/actions/journal-actions";
import { getTransactionMethodsByUserId } from "@/actions/method-actions";
import { validateRequest } from "@/auth";
import JournalEntries from "@/components/journal/JournalEntries";
import { redirect } from "next/navigation";
import BaseLayout from "../layout/BaseLayout";
import JournalHeader from "./JournalHeader";
import { JournalDate } from "@/types/calendar";
import Journal from "./Journal";

interface JournalPageProps extends JournalDate {}

export default async function JournalPage(props: JournalPageProps) {
    const { month, year } = props;
    const { user } = await validateRequest();

    const transactionMethods = await getTransactionMethodsByUserId(user.id);
    const journalEntries = await getJournalEntriesByUserId(user.id);
    const categories = await getCategoriesByUserId(user.id);

    console.log(transactionMethods);

    return (
        <Journal
            journalEntries={journalEntries}
            transactionMethods={transactionMethods}
            categories={categories}
            month={month}
            year={year}
        />            
    )
}
