'use server'

import { db } from "@/lib/db"
import { customers } from "@/db/schema"

export async function getCustomers() {
    try {
        const rawData = await db.select().from(customers)

        // Map database field with UI fields
        return rawData.map(c => ({
            id: c.id,
            name: c.customerType === 'business' ? c.businessName : `${c.firstName} ${c.lastName}`,
            email: c.email,
            phone: c.phone || "",
            company: c.businessName || "",
            type: c.customerType === 'business' ? 'Business' : 'Individual',
            status: c.status,
            createdDate: c.createdAt.toISOString().split('T')[0],

            // Fill missing fields with default values
            openItems: '',
            outstanding: 0,
            lastActivity: c.updatedAt.toISOString().split('T')[0],
            owner: "System"
        }))
    } catch (error) {
        const err = error
        console.error("DB Error cause:", err.cause)
        if (err.cause) {
            console.error("Cause message:", err.cause.message)
            console.error("Cause code:", err.cause.code)
        }
        throw new Error(`Failed to fetch customers: ${err.cause?.message || err.message || String(error)}`)
    }
}