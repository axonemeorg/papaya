import { JournalFilterSlot } from "@/components/journal/ribbon/JournalFilterPicker";
import { JournalSlice } from "@/types/schema";


export const enumerateFilters = (journalSlice: JournalSlice): Set<JournalFilterSlot> => {
    const {
        amount,
        categoryIds,
    } = journalSlice
    const slots: Set<JournalFilterSlot> = new Set<JournalFilterSlot>([])
    if (categoryIds && categoryIds.length > 0) {
        slots.add(JournalFilterSlot.CATEGORIES)
    }
    if (amount) {
        // TODO implement in ZK-115
        // const transformedAmountRange = transformAmountRange(amount)
        // if (transformedAmountRange.minimum || transformedAmountRange.maximum) {}

        slots.add(JournalFilterSlot.AMOUNT)
    }

    return slots
}

// TODO implement in ZK-115
// export const transformAmountRange = (amountRange: AmountRange): { minimum: number | undefined, maximum: number | undefined }[] => {
//     // TODO
//     const maximum = parseJournalEntryAmount(amountRange.maximum ?? '')
//     const minimum = parseJournalEntryAmount(amountRange.minimum ?? '')
//     return [
//         {
//             minimum: amountRange.minimum ? Number(amountRange.minimum) : undefined,
//             maximum: amountRange.maximum ? Number(amountRange.maximum) : undefined,
//         }
//     ]
// }
