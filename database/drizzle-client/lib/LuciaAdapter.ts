import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle';

import { SessionTable, UserTable } from '@/database/schemas'
import db from '@/database/client'

export const luciaAdapter = new DrizzlePostgreSQLAdapter(db, SessionTable, UserTable);
