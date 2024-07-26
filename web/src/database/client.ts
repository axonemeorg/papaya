import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import * as schema from './schemas'
import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle';

const env = dotenv.config({ path: '../.env' });
dotenvExpand.expand(env);

const database = process.env.DB_NAME as string;
const user = process.env.DB_USER as string;
const password = process.env.DB_PASSWORD as string;
const port = Number(process.env.DB_PORT as string);

export const pool = new Pool({
    database,
    user,
    password,
    port,
});

const db = drizzle(pool, { schema, logger: true });

export const luciaAdapter = new DrizzlePostgreSQLAdapter(db, schema.SessionTable, schema.UserTable);

export default db;
