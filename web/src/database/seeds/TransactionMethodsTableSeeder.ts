import { PaymentType } from "@/types/enum";
import DatabaseTableSeeder from "../lib/DatabaseTableSeeder";
import { TransactionMethodTable, UserTable } from "../schemas";
import { faker } from '@faker-js/faker'
import { InferSelectModel } from "drizzle-orm";

const NUM_METHODS_PER_USER = 3 as const;

export default class TransactionMethodsTableSeeder extends DatabaseTableSeeder {
    async seed(): Promise<void> {
        const users = await this.transaction.query.UserTable.findMany() as InferSelectModel<typeof UserTable>[];

        const transactionMethods = users.reduce((acc, user) => {
            for (let i = 0; i < NUM_METHODS_PER_USER; i ++) {
                acc.push({
                    userId: user.id,
                    defaultPaymentType: faker.helpers.arrayElement(PaymentType.options),
                    label: faker.lorem.words(2)
                });
            }

            return acc;
        }, [])

        await this.transaction.insert(TransactionMethodTable).values(transactionMethods)        
    }
}
