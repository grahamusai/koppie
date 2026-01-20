import type { Config } from "drizzle-kit";

export default {
  schema: "./db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.DATABASE_URL || "",
    authToken: process.env.TURSO_AUTH_TOKEN || "",
  },
  dialect: "turso",
} satisfies Config;
