import { pool } from "client";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";

/**
 * Script which performs all database migrations
 */
async function run() {
    await migrate(drizzle(pool), {
        migrationsFolder: './migrations'
    });

    await pool.end();
}

run();
