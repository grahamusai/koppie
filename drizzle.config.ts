import type { Config } from "drizzle-kit";
import { config } from "dotenv";

config({ path: ".env.local" });

export default {
  schema: "./db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.DATABASE_URL || "",
    authToken: process.env.TURSO_AUTH_TOKEN || "",
  },
  dialect: "turso",
} satisfies Config;
