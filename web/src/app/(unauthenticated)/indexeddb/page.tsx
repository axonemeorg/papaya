
type JournalEntryId = string;
type CategoryId = string;
type AttachmentId = string;
type TagId = string;
type PaymentMethodId = string;


type JounrnalEntry = {
    id: JournalEntryId;
    memo: string;
    notes: string;
    type: 'DEBIT' | 'CREDIT';
    date: string;

    parent_entry: JournalEntryId | null;
    payment_method: PaymentMethodId | null;
    categories: CategoryId[];
    attachments: AttachmentId[];
    tags: TagId[];
    linked_entries: JournalEntryId[];

    createdAt: string;
    updatedAt: string;
    deletedAt: string;
}


export default function IndexedDbPage() {
    return (
        <div>

        </div>
    )
}
