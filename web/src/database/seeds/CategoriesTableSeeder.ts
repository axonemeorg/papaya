import DatabaseTableSeeder from "../lib/DatabaseTableSeeder";
import { CategoryTable, TransactionMethodTable, UserTable } from "../schemas";
import { faker } from '@faker-js/faker'
import { InferSelectModel } from "drizzle-orm";

const NUM_CATEGORIES_PER_USER = 5 as const;

const EXAMPLE_CATEGORIES = [
    "Groceries",
    "Rent/Mortgage",
    "Utilities",
    "Transportation",
    "Clothing",
    "Dining Out",
    "Entertainment",
    "Health & Fitness",
    "Insurance",
    "Travel",
    "Education",
    "Subscriptions",
    "Gifts",
    "Savings",
    "Investments",
    "Home Maintenance",
    "Pet Care",
    "Childcare",
    "Personal Care",
    "Charity/Donations",
    "Hobbies",
    "Electronics",
    "Furniture",
    "Loan Payments",
    "Taxes",
    "Business Expenses",
    "Auto Maintenance",
    "Legal Fees",
    "Professional Development",
    "Miscellaneous"
]

export default class CategoriesTableSeeder extends DatabaseTableSeeder {
    async seed(): Promise<void> {
        const users = await this.transaction.query.UserTable.findMany() as InferSelectModel<typeof UserTable>[];

        const categoryLabels = faker.helpers.uniqueArray(EXAMPLE_CATEGORIES, NUM_CATEGORIES_PER_USER)

        const categories = users.reduce((acc, user) => {
            categoryLabels.forEach((label) => {
                acc.push({
                    userId: user.id,
                    label,     
                });
            });

            return acc;
        }, []);

        await this.transaction.insert(CategoryTable).values(categories)        
    }
}
