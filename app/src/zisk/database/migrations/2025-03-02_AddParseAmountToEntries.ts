import { JournalMeta, JournalVersion, ZiskDocument } from "@/types/schema";
import { calculateNetAmount } from "@/utils/journal";
import { Migration, MigrationRun } from "@/database/migrate";

export default class AddParseAmountToEntries implements Migration {
    public version = JournalVersion["2025-03-02"]
    public description = 'Adds the parseAmount field to journal entries'
    public run: MigrationRun = async (records) => {
        return records.reduce((acc: ZiskDocument[], record: ZiskDocument) => {
            if (record.type === 'JOURNAL') {
                return [record, ...acc]
            }
            if (record.type === 'JOURNAL_ENTRY') {
                let parsedNetAmount: number | undefined = undefined
                if (record.amount) {
                    parsedNetAmount = calculateNetAmount(record)
                }
                record.parsedNetAmount = parsedNetAmount
            }
            acc.push(record)
            return acc
        }, []) as [JournalMeta, ...ZiskDocument[]]
    }
}
