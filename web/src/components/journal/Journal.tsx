'use server'

import { getCategoriesByUserId } from "@/actions/category-actions";
import { getJournalEntriesByUserId } from "@/actions/journal-actions";
import { getTransactionMethodsByUserId } from "@/actions/method-actions";
import { validateRequest } from "@/auth";
import JournalEntries from "@/components/journal/JournalEntries";
import { redirect } from "next/navigation";
import BaseLayout from "../layout/BaseLayout";
import JournalHeaderActions from "./JournalHeaderActions";
import { JournalDate } from "@/types/calendar";

interface JournalProps extends JournalDate {}

export default async function Journal(props: JournalProps) {
    const { user } = await validateRequest();

    if (!user) {
        redirect('/login');
    }

    const transactionMethods = await getTransactionMethodsByUserId(user.id);
    const journalEntries = await getJournalEntriesByUserId(user.id);
    const categories = await getCategoriesByUserId(user.id);

    return (
        <BaseLayout headerChildren={<JournalHeaderActions month={props.month} year={props.year} />}>
            <JournalEntries
                journalEntries={journalEntries}
                transactionMethods={transactionMethods}
                categories={categories}
            />
            
        </BaseLayout>
    )
}
