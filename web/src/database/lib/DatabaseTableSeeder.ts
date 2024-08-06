
import db, { DbClient } from '@/database/client'

abstract class DatabaseTableSeeder {
    transaction: DbClient;

    constructor(transaction: DbClient = db) {
        this.transaction = transaction;
    }

    abstract seed(): Promise<void>;

    async _run(): Promise<void> {
        const startTime = Date.now();
        let endTime = Date.now();
        let statusIndicator = '✅'
        let seedError = null;

        try {
            await this.seed();
        } catch (error) {
            console.log(error)
            statusIndicator = '❌'
            seedError = error;
        } finally {
            endTime = Date.now();
        }
        
        const elapsedTime = endTime - startTime
        const elapsedTimeString = elapsedTime < 1000
            ? `${Math.round(elapsedTime)}ms`
            : `${(elapsedTime / 1000).toFixed(1)}s`

        console.log(`${statusIndicator} ${this.constructor.name} (ran in ${elapsedTimeString})`);
        if (seedError) {
            console.error(seedError.detail)
        }
        // console.log('\n');
    }
}

export default DatabaseTableSeeder;
