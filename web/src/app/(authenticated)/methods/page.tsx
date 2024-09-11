import { getJournalEntriesByUserId } from "@/actions/journal-actions";
import { getTransactionMethodsByUserId } from "@/actions/method-actions";
import { validateRequest } from "@/auth";
import TransactionMethods from "@/components/journal/TransactionMethods";
import CreateTransactionMethodModal from "@/components/modal/CreateTransactionMethodModal";
import { redirect } from "next/navigation";

export default async function MethodsTestPage() {
    const { user } = await validateRequest();

    const transactionMethods = await getTransactionMethodsByUserId(user.id);

    return (
        <div>
            <TransactionMethods transactionMethods={transactionMethods} />
        </div>
    )
}
