import PouchDB from 'pouchdb';
import PouchDBFind from 'pouchdb-find';

const POUCH_DB_NAME = 'zisk-db';

export const db = new PouchDB(POUCH_DB_NAME);

PouchDB.plugin(PouchDBFind);
