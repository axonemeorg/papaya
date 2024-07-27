import { getJournalEntriesByUserId } from "@/actions/journal-actions";
import { getTransactionMethodsByUserId } from "@/actions/method-actions";
import { validateRequest } from "@/auth";
import JournalEntries from "@/components/journal/JournalEntries";
import { redirect } from "next/navigation";


export default async function JournalPage() {
    const { user, session } = await validateRequest();

    if (!user) {
        redirect('/login');
    }

    const transactionMethods = await getTransactionMethodsByUserId(user.id);
    const journalEntries = await getJournalEntriesByUserId(user.id);

    return (
        <div>
            <JournalEntries
                journalEntries={journalEntries}
                transactionMethods={transactionMethods}
            />
        </div>
    )
}
