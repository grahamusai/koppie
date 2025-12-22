import {
    pgTable,
    uuid,
    varchar,
    text,
    timestamp,
    pgEnum,
} from "drizzle-orm/pg-core";

export const customerTypeEnum = pgEnum("customer_type", [
    "individual",
    "business",
]);

export const customerStatusEnum = pgEnum("customer_status", [
    "active",
    "inactive",
    "suspended",
]);

export const customers = pgTable("customers", {
    id: uuid("id").defaultRandom().primaryKey(),

    customerType: customerTypeEnum("customer_type").notNull(),

    // Individual
    firstName: varchar("first_name", { length: 100 }),
    lastName: varchar("last_name", { length: 100 }),

    // Business
    businessName: varchar("business_name", { length: 255 }),

    // Contact
    email: varchar("email", { length: 255 }).notNull(),
    phone: varchar("phone", { length: 50 }),

    // Address
    addressLine1: varchar("address_line1", { length: 255 }),
    addressLine2: varchar("address_line2", { length: 255 }),
    city: varchar("city", { length: 100 }),
    province: varchar("province", { length: 100 }),
    postalCode: varchar("postal_code", { length: 20 }),
    country: varchar("country", { length: 100 }).default("South Africa"),

    // SA-specific
    idNumber: varchar("id_number", { length: 20 }),
    registrationNumber: varchar("registration_number", { length: 50 }),
    vatNumber: varchar("vat_number", { length: 20 }),
    taxNumber: varchar("tax_number", { length: 20 }),

    status: customerStatusEnum("status").default("active").notNull(),

    notes: text("notes"),

    // Ownership / auditing
    createdBy: uuid("created_by"), // supabase auth.users.id
    createdAt: timestamp("created_at", { withTimezone: true })
        .defaultNow()
        .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
        .defaultNow()
        .notNull(),
});
