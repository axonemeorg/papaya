import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import * as schema from './schema'

const env = dotenv.config({ path: '../.env' });
dotenvExpand.expand(env);

const connectionString = process.env.POSTGRES_DATABASE_URL as string;
export const pool = new Pool({
    connectionString
});

export default drizzle(pool, { schema, logger: true });

