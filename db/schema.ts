import {
    pgTable,
    text,
    integer,
    timestamp,
    boolean,
} from "drizzle-orm/pg-core";

export const customers = pgTable("customers", {
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
    createdAt: timestamp("created_at")
        .defaultNow()
        .notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .notNull(),
});

export const projects = pgTable("projects", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    description: text("description"),
    customerId: text("customer_id").references(() => customers.id).notNull(),
    status: text("status").default("active").notNull(),
    priority: text("priority").default("medium"),
    startDate: timestamp("start_date"),
    endDate: timestamp("end_date"),
    budget: integer("budget"),
    notes: text("notes"),

    // Ownership / auditing
    createdBy: text("created_by"),
    createdAt: timestamp("created_at")
        .defaultNow()
        .notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .notNull(),
});

export const invoices = pgTable("invoices", {
    id: text("id").primaryKey(),
    invoiceNumber: text("invoice_number").notNull(),
    customerId: text("customer_id").references(() => customers.id).notNull(),
    projectId: text("project_id").references(() => projects.id),
    amount: integer("amount").notNull(), // Stored in cents
    status: text("status").default("draft").notNull(),
    issueDate: timestamp("issue_date").notNull(),
    dueDate: timestamp("due_date"),
    description: text("description"),
    notes: text("notes"),

    // Ownership / auditing
    createdBy: text("created_by"),
    createdAt: timestamp("created_at")
        .defaultNow()
        .notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .notNull(),
});

export const taskColumns = pgTable("task_columns", {
    id: text("id").primaryKey(),
    title: text("title").notNull(),
    position: integer("position").notNull(),
    createdAt: timestamp("created_at")
        .defaultNow()
        .notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .notNull(),
});

export const tasks = pgTable("tasks", {
    id: text("id").primaryKey(),
    title: text("title").notNull(),
    description: text("description"),
    assignee: text("assignee"),
    dueDate: timestamp("due_date"),
    priority: text("priority").default("medium").notNull(),
    columnId: text("column_id").references(() => taskColumns.id).notNull(),
    position: integer("position").notNull(),
    archived: boolean("archived").default(false).notNull(),

    // Ownership / auditing
    createdBy: text("created_by"),
    createdAt: timestamp("created_at")
        .defaultNow()
        .notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .notNull(),
});
