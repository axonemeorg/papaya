'use server'

import { getCategoriesByUserId } from "@/actions/category-actions";
import { getJournalEntriesByUserId } from "@/actions/journal-actions";
import { getTransactionMethodsByUserId } from "@/actions/method-actions";
import { validateRequest } from "@/auth";
import JournalEntries from "@/components/journal/JournalEntries";
import { redirect } from "next/navigation";

interface JournalProps {
    month: number;
    year: number;
}

export default async function Journal(props: JournalProps) {
    const { user } = await validateRequest();

    if (!user) {
        redirect('/login');
    }

    const transactionMethods = await getTransactionMethodsByUserId(user.id);
    const journalEntries = await getJournalEntriesByUserId(user.id);
    const categories = await getCategoriesByUserId(user.id);

    return (
        <div>
            <JournalEntries
                journalEntries={journalEntries}
                transactionMethods={transactionMethods}
                categories={categories}
            />
        </div>
    )
}
