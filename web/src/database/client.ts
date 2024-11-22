import PouchDB from 'pouchdb';
import PouchDBFind from 'pouchdb-find';
import { number } from 'zod';

const POUCH_DB_NAME = '__zisk__db';

export const ZISK_JOURNAL_META_KEY = 'ZISK_JOURNAL_META';
const JOURNAL_ENTRY_SEQUENCE_NUMBER_STARTING_VALUE = 1;

export interface ZiskJournalMeta {
    _id: typeof ZISK_JOURNAL_META_KEY;
    journalEntrySequence: number;
    journalVersion: number;
}

const newMetaDoc: ZiskJournalMeta = {
    _id: ZISK_JOURNAL_META_KEY,
    journalEntrySequence: JOURNAL_ENTRY_SEQUENCE_NUMBER_STARTING_VALUE,
    journalVersion: 1,
}

export const db = new PouchDB(POUCH_DB_NAME);

PouchDB.plugin(PouchDBFind);

db.createIndex({
    index: {
        fields: [
            'type',
            'date',
            'parentEntryId',
        ]
    }
});

db.get(ZISK_JOURNAL_META_KEY)
    .catch((error) => {
        if (error.status === 404) {
            db.put(newMetaDoc);
        }
    });
