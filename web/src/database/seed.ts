import { pool } from "./client";
import { drizzle } from "drizzle-orm/node-postgres";
import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';

import * as schema from '@/database/schemas';
import DatabaseTableSeeder from "./lib/DatabaseTableSeeder";
import UsersTableSeeder from "@/database/seeds/UsersTableSeeder";
import TransactionMethodsTableSeeder from "./seeds/TransactionMethodsTableSeeder";
import CategoriesTableSeeder from "./seeds/CategoriesTableSeeder";

const env = dotenv.config({ path: '../.env' });
dotenvExpand.expand(env);

/**
 * Script which performs all database migrations
 */
async function run() {
    const db = drizzle(pool, { schema, logger: false });

    const seeders: DatabaseTableSeeder[] = [
        new UsersTableSeeder(db),
        new TransactionMethodsTableSeeder(db),
        new CategoriesTableSeeder(db),
    ];

    console.log(`Running ${seeders.length} database seeder(s)...\n`);

    for (const seeder of seeders) {
        await seeder._run();
    }

    await pool.end();
}

run();
