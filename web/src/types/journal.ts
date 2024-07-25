

interface JournalEntry {
    memo: string;
    transactions: Transaction
}

enum TransactionType {
    DEBIT = 'DEBIT',
    CREDIT = 'CREDIT'
}

interface Transaction {
    type: TransactionType;
    date: Date;
    amount: number;
    paymentType: PaymentType;
    method: TransactionMethod;
}

enum PaymentType {
    CASH = 'CASH',
    ETRANSFER = 'ETRANSFER',
    DEBIT = 'DEBIT',
    CREDIT = 'CREDIT',
}

enum TransactionMethodType {
    CARD_PAYMENT = 'CARD_PAYMENT',
    PERSON_PAYMENT = 'PERSON_PAYMENT'
}

interface TransactionMethod {
    label: string;
    defaultPaymentType: PaymentType;
    icon: string;
}

const exampleTransactions: Transaction[] = [
    {
        type: TransactionType.DEBIT,
        amount: 2000,
        date: new Date(),
        paymentType: PaymentType.ETRANSFER,
        method: {
            label: 'Stephanie',
            defaultPaymentType: PaymentType.ETRANSFER,
            icon: ''
        }
    }
]
