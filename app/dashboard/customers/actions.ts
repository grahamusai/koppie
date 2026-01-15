'use server'

import { db } from "@/lib/db"
import { customers } from "@/db/schema"
import { revalidatePath } from "next/cache"
import { Customer } from "./components/datatable"

export async function getCustomers(): Promise<Customer[]> {
    try {
        const rawData = await db.select().from(customers)

        // Map database field with UI fields
        return rawData.map(c => ({
            id: c.id,
            name: c.customerType === 'business' ? c.businessName : `${c.firstName} ${c.lastName}`,
            email: c.email,
            phone: c.phone || "",
            company: c.businessName || "",
            type: (c.customerType === 'business' ? 'Business' : 'Individual') as "Business" | "Individual",
            status: (c.status === 'active' ? 'Active' : c.status === 'prospect' ? 'Prospect' : 'Inactive') as "Active" | "Prospect" | "Inactive",
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

export async function createCustomer(formData) {
    try {
        const customerData = {
            id: crypto.randomUUID(),
            customerType: formData.customerType,
            firstName: formData.firstName || null,
            lastName: formData.lastName || null,
            businessName: formData.businessName || null,
            email: formData.email,
            phone: formData.phone || null,
            addressLine1: formData.addressLine1 || null,
            addressLine2: formData.addressLine2 || null,
            city: formData.city || null,
            province: formData.province || null,
            postalCode: formData.postalCode || null,
            country: formData.country || "South Africa",
            idNumber: formData.idNumber || null,
            registrationNumber: formData.registrationNumber || null,
            vatNumber: formData.vatNumber || null,
            taxNumber: formData.taxNumber || null,
            status: formData.status,
            notes: formData.notes || null,
            createdBy: null, // For now, set to null since we're not using auth in local mode
        }

        await db.insert(customers).values(customerData)
        
        revalidatePath('/dashboard/customers')
        
        return { success: true }
    } catch (error) {
        console.error("Error creating customer:", error)
        return { success: false, error: error.message }
    }
}