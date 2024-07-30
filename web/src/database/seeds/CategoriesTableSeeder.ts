import DatabaseTableSeeder from "../lib/DatabaseTableSeeder";
import { CategoryTable, TransactionMethodTable, UserTable } from "../schemas";
import { faker } from '@faker-js/faker'
import { InferSelectModel } from "drizzle-orm";

const NUM_CATEGORIES_PER_USER = 5 as const;

export default class CategoriesTableSeeder extends DatabaseTableSeeder {
    async seed(): Promise<void> {
        const users = await this.transaction.query.UserTable.findMany() as InferSelectModel<typeof UserTable>[];

        const categories = users.reduce((acc, user) => {
            for (let i = 0; i < NUM_CATEGORIES_PER_USER; i ++) {
                acc.push({
                    userId: user.id,
                    label: faker.lorem.words(1)
                });
            }

            return acc;
        }, [])

        await this.transaction.insert(CategoryTable).values(categories)        
    }
}
