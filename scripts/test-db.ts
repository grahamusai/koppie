import { db } from "../lib/db";
import { test } from "../db/schema";
import { sql } from "drizzle-orm";

async function main() {
    console.log("Testing connection...");
    try {
        // Basic query
        const result = await db.execute(sql`SELECT 1`);
        console.log("Connection successful! Result:", result);

        // Attempt to insert? No, just select is enough for connectivity.
    } catch (error) {
        console.error("Connection failed:", error);
        process.exit(1);
    }
}

main();
