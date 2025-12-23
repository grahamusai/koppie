import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined');
}

// Use singleton pattern for the pool in development to prevent 
// "too many connections" errors during hot-reloading
const globalForDb = global as unknown as { dbPool: pg.Pool };

const pool = globalForDb.dbPool || new Pool({
  connectionString: process.env.DATABASE_URL,
});

if (process.env.NODE_ENV !== 'production') globalForDb.dbPool = pool;

export const db = drizzle(pool);
