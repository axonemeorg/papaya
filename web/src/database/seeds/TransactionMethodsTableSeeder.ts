import { PaymentType } from "@/types/enum";
import icons from '@/constants/icons';
import DatabaseTableSeeder from "../lib/DatabaseTableSeeder";
import { TransactionMethodTable, UserTable } from "../schemas";
import { faker } from '@faker-js/faker'
import { InferSelectModel } from "drizzle-orm";
import { colorNameLabels, colorShadeLabels } from "@/components/color/ColorPicker";

const NUM_METHODS_PER_USER = 3 as const;

export default class TransactionMethodsTableSeeder extends DatabaseTableSeeder {
    async seed(): Promise<void> {
        const colorNames = Object.keys(colorNameLabels)
        const shades = Object.keys(colorShadeLabels)
        const users = await this.transaction.query.UserTable.findMany() as InferSelectModel<typeof UserTable>[];

        const transactionMethods = users.reduce((acc, user) => {
            for (let i = 0; i < NUM_METHODS_PER_USER; i ++) {
                const iconIndex = Math.floor(Math.random() * icons.length);
                const shadeIndex = Math.floor(Math.random() * shades.length);
                const colorNameIndex = Math.floor(Math.random() * colorNames.length);

                acc.push({
                    userId: user.id,
                    defaultPaymentType: faker.helpers.arrayElement(PaymentType.options),
                    label: faker.lorem.words(2),
                    avatarVariant: 'PICTORIAL',
                    avatarContent: icons[iconIndex].name,
                    avatarPrimaryColor: [colorNames[colorNameIndex], shades[shadeIndex]].join('.'),
                    avatarSecondaryColor: undefined,
                });
            }

            return acc;
        }, [])

        await this.transaction.insert(TransactionMethodTable).values(transactionMethods)        
    }
}
