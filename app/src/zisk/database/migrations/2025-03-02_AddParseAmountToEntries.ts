import { JournalMeta, JournalVersion, ZiskDocument } from "@/types/schema";
import { parseJournalEntryAmount } from "@/utils/journal";
import { Migration, MigrationRun } from "@/database/migrate";

export default class AddParseAmountToEntries implements Migration {
    public version = JournalVersion["2025-03-02"]
    public description = 'Adds the parseAmount field to journal entries'
    public run: MigrationRun = async (records) => {
        return records.reduce((acc: ZiskDocument[], record: ZiskDocument) => {
            if (record.type === 'JOURNAL') {
                return [record, ...acc]
            }
            if (record.type === 'CHILD_JOURNAL_ENTRY' || record.type === 'JOURNAL_ENTRY') {
                let parsedAmount: number | undefined = undefined
                if (record.amount) {
                    parsedAmount = parseJournalEntryAmount(record.amount)
                }
                record.parsedAmount = parsedAmount
            }
            acc.push(record)
            return acc
        }, []) as [JournalMeta, ...ZiskDocument[]]
    }
}
