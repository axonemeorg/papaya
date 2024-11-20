import { generateEmbedding } from "@/actions/embeddings";
import DatabaseTableSeeder from "../lib/DatabaseTableSeeder";
import { AvatarVariantEnum, CategoryTable, TransactionMethodTable, UserTable } from "../schemas";
import { faker } from '@faker-js/faker'
import { InferSelectModel } from "drizzle-orm";
import * as muiColors from '@mui/material/colors';

import icons from '@/constants/icons';
import { colorNameLabels, colorShadeLabels } from "@/components/pickers/ColorPicker";

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
        const colorNames = Object.keys(colorNameLabels)
        const shades = Object.keys(colorShadeLabels)

        const embeddedCategoryEntries: [string, number[]][] = await Promise.all(
            EXAMPLE_CATEGORIES.map(async (label) => {
                return [label, await generateEmbedding(label)]
            })
        );
        
        const embeddedCategories = Object.fromEntries(embeddedCategoryEntries);

        const users = await this.transaction.query.UserTable.findMany() as InferSelectModel<typeof UserTable>[];

        const categoryLabels = faker.helpers.uniqueArray(EXAMPLE_CATEGORIES, NUM_CATEGORIES_PER_USER)

        const categories = users.reduce((acc: any[], user) => {
            categoryLabels.forEach((label) => {
                const iconIndex = Math.floor(Math.random() * icons.length);
                const shadeIndex = Math.floor(Math.random() * shades.length);
                const colorNameIndex = Math.floor(Math.random() * colorNames.length);

                acc.push({
                    userId: user.id,
                    label,
                    description: label,
                    descriptionEmbedding: embeddedCategories[label],
                    avatarVariant: 'PICTORIAL',
                    avatarContent: icons[iconIndex].name,
                    avatarPrimaryColor: faker.color.rgb(),
                    // avatarPrimaryColor: muiColors[[colorNames[colorNameIndex], shades[shadeIndex]].join('.')],
                });
            });

            return acc;
        }, []);

        await this.transaction.insert(CategoryTable).values(categories)        
    }
}
