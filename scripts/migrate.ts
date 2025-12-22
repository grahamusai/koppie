import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { migrate } from 'drizzle-orm/neon-http/migrator';
import { config } from 'dotenv';

config({ path: '.env.local' });

if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined');
}

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql);

async function main() {
    console.log('Starting migration...');
    try {
        await migrate(db, { migrationsFolder: 'drizzle' });
        console.log('Migration completed successfully!');
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
}

main();
