import { generateIdFromEntropySize } from "lucia";
import DatabaseTableSeeder from "../lib/DatabaseTableSeeder";
import { UserTable } from "../schemas";
import { hash } from "@node-rs/argon2";

export default class UsersTableSeeder extends DatabaseTableSeeder {
    async seed(): Promise<void> {
        
        const credentials = [
            {
                username: process.env.DEFAULT_USER_NAME,
                passwordText: process.env.DEFAULT_USER_PASSWORD,
            }
        ];

        const users: any[] = await Promise.all(credentials.map(async ({ username, passwordText }) => {
            const userId = generateIdFromEntropySize(10);
            // Default password is their username.
            const passwordHash = await hash(passwordText ?? '', {
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
