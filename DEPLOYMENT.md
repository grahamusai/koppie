# Deployment Guide for Koppie

This guide outlines the steps to deploy the Koppie application to Vercel with a production database.

## Prerequisites
- GitHub account and repository
- Vercel account
- Production database (e.g., Supabase, Neon) with PostgreSQL

## Step 1: Prepare the Codebase for Production
Switch from local SQLite to PostgreSQL for production.

### Update Configuration Files
1. **drizzle.config.ts**:
   ```typescript
   import { config } from 'dotenv';
   import { defineConfig } from 'drizzle-kit';

   config({ path: '.env.local' });

   export default defineConfig({
       schema: './db/schema.ts',
       out: './drizzle',
       dialect: 'postgresql',
       dbCredentials: {
           url: process.env.DATABASE_URL!,
       },
   });
   ```

2. **db/schema.ts**:
   ```typescript
   import {
       pgTable,
       uuid,
       varchar,
       text,
       timestamp,
       pgEnum,
   } from "drizzle-orm/pg-core";

   // ... (rest of the schema with pgTable, etc.)
   ```

3. **lib/db.ts**:
   ```typescript
   import { drizzle } from 'drizzle-orm/node-postgres';
   import pg from 'pg';

   const { Pool } = pg;

   if (!process.env.DATABASE_URL) {
     throw new Error('DATABASE_URL is not defined');
   }

   const globalForDb = global as unknown as { dbPool: pg.Pool };
   const pool = globalForDb.dbPool || new Pool({
     connectionString: process.env.DATABASE_URL,
   });

   if (process.env.NODE_ENV !== 'production') globalForDb.dbPool = pool;

   export const db = drizzle(pool);
   ```

### Set Environment Variables
- Update `.env.local` with production `DATABASE_URL` (from Supabase/Neon).
- For Vercel, set `DATABASE_URL` in the Vercel dashboard (Project Settings > Environment Variables).

## Step 2: Push Database Schema
Run this locally or in CI/CD to create tables in production DB:
```bash
bunx drizzle-kit push
```

## Step 3: Deploy to Vercel
1. Push code to GitHub.
2. Connect GitHub repo to Vercel.
3. In Vercel project settings:
   - Set build command: `npm run build` (or `bun run build` if using Bun).
   - Set environment variables (e.g., `DATABASE_URL`).
4. Deploy: Vercel will build and deploy automatically on pushes.

## Step 4: Post-Deployment
- Verify the app loads at the Vercel URL.
- Check database connection in logs.
- If needed, run migrations: Add `bunx drizzle-kit push` to Vercel's build script or run manually.

## Troubleshooting
- If DB connection fails, check `DATABASE_URL` and network (IPv6 issues).
- For data migration, export from local SQLite and import to production DB.

## Notes
- Local development uses SQLite; production uses PostgreSQL.
- Test locally with production config before deploying.