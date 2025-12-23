import { db } from "../lib/db";
import { customers } from "../db/schema";
import { sql } from "drizzle-orm";

async function main() {
    console.log("Testing connection...");
    try {
        // Basic query
        const result = await db.select().from(customers).limit(1);
        console.log("Connection successful! Customers found:", result.length);
        process.exit(0);

        // Attempt to insert? No, just select is enough for connectivity.
    } catch (error) {
        console.error("Connection/Query failed:", error);
        process.exit(1);
    }
}

main();
