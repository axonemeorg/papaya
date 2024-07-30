import { generateIdFromEntropySize } from "lucia";
import DatabaseTableSeeder from "../lib/DatabaseTableSeeder";
import { UserTable } from "../schemas";
import { hash } from "@node-rs/argon2";

export default class UsersTableSeeder extends DatabaseTableSeeder {
    async seed(): Promise<void> {
        const usernames = [
            'curtis'
        ];

        const users = await Promise.all(usernames.map(async (username) => {
            const userId = generateIdFromEntropySize(10);
            const passwordHash = await hash(username, {
                memoryCost: 19456,
                timeCost: 2,
                outputLen: 64,
                parallelism: 1
            });

            return {
                id: userId,
                passwordHash,
                username
            }
        }))

        await this.transaction.insert(UserTable).values(users)        
    }
}
