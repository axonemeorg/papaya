import { getJournalEntries } from "api/actions/journal-actions";
import { InferSelectModel } from "drizzle-orm";


// type JournalEntry = 

enum TransactionType {
    DEBIT = 'DEBIT',
    CREDIT = 'CREDIT'
}

interface Transaction {
    type: TransactionType;
    date: Date;
    amount: number;
    memo: string | null;
    paymentType: PaymentType;
    method: TransactionMethod;
}

enum PaymentType {
    CASH = 'CASH',
    ETRANSFER = 'ETRANSFER',
    DEBIT = 'DEBIT',
    CREDIT = 'CREDIT',
}

interface TransactionMethod {
    label: string;
    defaultPaymentType: PaymentType;
    icon: string;
}

// const exampleTransactions: Transaction[] = [
//     {
//         type: TransactionType.DEBIT,
//         amount: 2000,
//         date: new Date(),
//         paymentType: PaymentType.ETRANSFER,
//         method: {
//             label: 'Stephanie',
//             defaultPaymentType: PaymentType.ETRANSFER,
//             icon: ''
//         }
//     }
// ]
