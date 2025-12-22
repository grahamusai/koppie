import { db } from "../lib/db";
import { sql } from "drizzle-orm";

async function checkTables() {
    try {
        const result = await db.execute(sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public';
    `);
        console.log("Tables in public schema:", result.rows);
    } catch (error) {
        console.error("Error checking tables:", error);
    }
}

checkTables();
