import {
    sqliteTable,
    text,
    integer,
} from "drizzle-orm/sqlite-core";

export const customers = sqliteTable("customers", {
    id: text("id").primaryKey(),

    customerType: text("customer_type").notNull(),

    // Individual
    firstName: text("first_name"),
    lastName: text("last_name"),

    // Business
    businessName: text("business_name"),

    // Contact
    email: text("email").notNull(),
    phone: text("phone"),

    // Address
    addressLine1: text("address_line1"),
    addressLine2: text("address_line2"),
    city: text("city"),
    province: text("province"),
    postalCode: text("postal_code"),
    country: text("country").default("South Africa"),

    // SA-specific
    idNumber: text("id_number"),
    registrationNumber: text("registration_number"),
    vatNumber: text("vat_number"),
    taxNumber: text("tax_number"),

    status: text("status").default("active").notNull(),

    notes: text("notes"),

    // Ownership / auditing
    createdBy: text("created_by"), // supabase auth.users.id
    createdAt: integer("created_at", { mode: 'timestamp' })
        .defaultNow()
        .notNull(),
    updatedAt: integer("updated_at", { mode: 'timestamp' })
        .defaultNow()
        .notNull(),
});

export const projects = sqliteTable("projects", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    description: text("description"),
    customerId: text("customer_id").references(() => customers.id).notNull(),
    status: text("status").default("active").notNull(),
    priority: text("priority").default("medium"),
    startDate: integer("start_date", { mode: 'timestamp' }),
    endDate: integer("end_date", { mode: 'timestamp' }),
    budget: integer("budget"),
    notes: text("notes"),

    // Ownership / auditing
    createdBy: text("created_by"),
    createdAt: integer("created_at", { mode: 'timestamp' })
        .defaultNow()
        .notNull(),
    updatedAt: integer("updated_at", { mode: 'timestamp' })
        .defaultNow()
        .notNull(),
});
