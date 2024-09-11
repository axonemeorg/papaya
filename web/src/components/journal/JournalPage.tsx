'use server'

import { getCategoriesByUserId } from "@/actions/category-actions";
import { getJournalEntriesByUserId, getUserJournalEntriesByMonthAndYear } from "@/actions/journal-actions";
import { getTransactionMethodsByUserId } from "@/actions/method-actions";
import { validateRequest } from "@/auth";
import JournalEditor from "@/components/journal/JournalEditor";
import { redirect } from "next/navigation";
import BaseLayout from "../layout/BaseLayout";
import JournalHeader from "./JournalHeader";
import { JournalDate } from "@/types/calendar";
import { JournalEntryContext } from "@/contexts/JournalEntryContext";

interface JournalPageProps extends JournalDate {}

export default async function JournalPage(props: JournalPageProps) {
    const { month, year } = props;
    const { user } = await validateRequest();

    // const transactionMethods = await getTransactionMethodsByUserId(user.id);
    const journalEntries = await getUserJournalEntriesByMonthAndYear(user.id, month, year);
    // const categories = await getCategoriesByUserId(user.id);

    return (
        <BaseLayout
            headerChildren={
                <JournalHeader month={month} year={year} />
            }
            user={user}
        >
            {/* <CategoryContext.Provider value={{ categories }}> */}
                    {/* <TransactionMethodContext.Provider value={{ transactionMethods }}> */}
                    <JournalEditor journalEntries={journalEntries} />
                {/* </TransactionMethodContext.Provider> */}
            {/* </CategoryContext.Provider> */}
        </BaseLayout>        
    )
}
