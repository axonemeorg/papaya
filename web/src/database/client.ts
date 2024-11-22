import PouchDB from 'pouchdb';
import PouchDBFind from 'pouchdb-find';

const POUCH_DB_NAME = '__zisk__db';

export const JOURNAL_ENTRY_SEQUENCE_NUMBER_KEY = 'JOURNAL_ENTRY_SEQUENCE_NUMBER';
const JOURNAL_ENTRY_SEQUENCE_NUMBER_STARTING_VALUE = 1;

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

db.get(JOURNAL_ENTRY_SEQUENCE_NUMBER_KEY)
    .then((record) => {
        if (record.sequenceValue === undefined) {
            db.put({
                ...record,
                _id: JOURNAL_ENTRY_SEQUENCE_NUMBER_KEY,
                sequenceValue: JOURNAL_ENTRY_SEQUENCE_NUMBER_STARTING_VALUE,
            });
        }
    })
    .catch((error) => {
        if (error.status === 404) {
            db.put({
                _id: JOURNAL_ENTRY_SEQUENCE_NUMBER_KEY,
                sequenceValue: JOURNAL_ENTRY_SEQUENCE_NUMBER_STARTING_VALUE,
            });
        }
    });

