import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    dialect: 'postgresql',
    schema: "./src/database/schema/index.ts",
    out: "./database/migrations",
});
