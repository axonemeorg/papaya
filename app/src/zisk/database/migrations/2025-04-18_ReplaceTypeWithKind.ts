import { JournalMeta, JournalVersion, ZiskDocument } from "@/types/schema";
import { Migration, MigrationRun } from "@/database/migrate";

export default class ReplaceTypeWithKind implements Migration {
    public version = JournalVersion.REPLACE_TYPE_WITH_KIND
    public description = 'Replaces all type attributes with kind'
    public run: MigrationRun = async (records) => {
        const typeToKindMap: Record<string, string> = {
            'CATEGORY': 'zisk:category',
            'JOURNAL': 'zisk:journal',
            'JOURNAL_ENTRY': 'zisk:entry',
            'ENTRY_TAG': 'zisk:tag',
            'RESERVED_TAG': 'zisk:status',
            'TRANSFER_ENTRY': 'zisk:entry',
        }
        return records.reduce((acc: ZiskDocument[], record: ZiskDocument) => {
            if ('type' in record) {
                (record as any).kind = typeToKindMap[record.type as unknown as string],
                delete record.type;
            }
            if ((record as any).kind === 'zisk:journal') {
                return [record, ...acc]
            }

            acc.push(record)
            return acc
        }, []) as [JournalMeta, ...ZiskDocument[]]
    }
}
