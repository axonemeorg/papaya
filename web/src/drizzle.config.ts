import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    dialect: 'postgresql',
    schema: "./database/schemas/index.ts",
    out: "./database/migrations",
});
