import { pool } from "./client";
import { drizzle } from "drizzle-orm/libsql";
import { migrate } from "drizzle-orm/libsql/migrator";

/**
 * Script which performs all database migrations
 */
async function run() {
    await migrate(drizzle(pool), {
        migrationsFolder: './src/database/migrations'
    });

    await pool.end();
}

run();
