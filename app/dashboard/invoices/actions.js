'use server'

import { db } from "@/lib/db"
import { invoices, customers, projects } from "@/db/schema"
import { eq, desc } from "drizzle-orm"
import { revalidatePath } from "next/cache"

export async function getInvoices() {
    try {
        const rawData = await db
            .select({
                id: invoices.id,
                invoiceNumber: invoices.invoiceNumber,
                amount: invoices.amount,
                status: invoices.status,
                issueDate: invoices.issueDate,
                dueDate: invoices.dueDate,
                description: invoices.description,
                customerType: customers.customerType,
                customerFirstName: customers.firstName,
                customerLastName: customers.lastName,
                customerBusinessName: customers.businessName,
                customerEmail: customers.email,
                projectName: projects.name,
                createdDate: invoices.createdAt,
                updatedDate: invoices.updatedAt,
            })
            .from(invoices)
            .leftJoin(customers, eq(invoices.customerId, customers.id))
            .leftJoin(projects, eq(invoices.projectId, projects.id))
            .orderBy(desc(invoices.createdAt))

        return rawData.map(invoice => ({
            ...invoice,
            customerName: invoice.customerType === 'business'
                ? invoice.customerBusinessName
                : `${invoice.customerFirstName || ''} ${invoice.customerLastName || ''}`.trim(),
            issueDate: invoice.issueDate ? invoice.issueDate.toString().split('T')[0] : null,
            dueDate: invoice.dueDate ? invoice.dueDate.toString().split('T')[0] : null,
            createdDate: invoice.createdDate.toString().split('T')[0],
            updatedDate: invoice.updatedDate.toString().split('T')[0],
        }))
    } catch (error) {
        console.error("Error fetching invoices:", error)
        throw new Error(`Failed to fetch invoices: ${error.message}`)
    }
}

export async function createInvoice(formData) {
    try {
        const invoiceData = {
            id: crypto.randomUUID(),
            invoiceNumber: formData.invoiceNumber || `INV-${Date.now()}`,
            customerId: formData.customerId,
            projectId: formData.projectId || null,
            amount: Math.round(parseFloat(formData.amount) * 100), // Convert to cents
            status: formData.status || 'draft',
            issueDate: new Date(formData.issueDate),
            dueDate: formData.dueDate ? new Date(formData.dueDate) : null,
            description: formData.description || null,
            notes: formData.notes || null,
            createdBy: null,
        }

        await db.insert(invoices).values(invoiceData)

        revalidatePath('/dashboard/invoices')

        return { success: true }
    } catch (error) {
        console.error("Error creating invoice:", error)
        return { success: false, error: error.message }
    }
}