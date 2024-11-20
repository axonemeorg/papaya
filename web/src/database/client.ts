
const POUCH_DB_NAME = process.env.POUCH_DB_NAME;

export const db = new PouchDB(POUCH_DB_NAME);
