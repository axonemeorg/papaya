import { generateEmbedding } from "@/actions/embeddings";
import DatabaseTableSeeder from "../lib/DatabaseTableSeeder";
import { CategoryTable, TransactionMethodTable, UserTable } from "../schemas";
import { faker } from '@faker-js/faker'
import { InferSelectModel } from "drizzle-orm";

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
];

const NUM_CATEGORIES_PER_USER: number = EXAMPLE_CATEGORIES.length;

export default class CategoriesTableSeeder extends DatabaseTableSeeder {
    async seed(): Promise<void> {

        const embeddedCategoryEntries: [string, number[]][] = await Promise.all(
            EXAMPLE_CATEGORIES.map(async (label) => {
                return [label, await generateEmbedding(label)]
            })
        );

        
        const embeddedCategories = Object.fromEntries(embeddedCategoryEntries);
        console.log(embeddedCategories);

        const users = await this.transaction.query.UserTable.findMany() as InferSelectModel<typeof UserTable>[];

        const categoryLabels = faker.helpers.uniqueArray(EXAMPLE_CATEGORIES, NUM_CATEGORIES_PER_USER)

        const categories = users.reduce((acc, user) => {
            categoryLabels.forEach((label) => {
                acc.push({
                    userId: user.id,
                    label,
                    labelEmbedding: embeddedCategories[label]
                });
            });

            return acc;
        }, []);

        await this.transaction.insert(CategoryTable).values(categories)        
    }
}
