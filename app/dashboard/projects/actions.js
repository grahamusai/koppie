'use server'

import { db } from "@/lib/db"
import { projects, customers } from "@/db/schema"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

export async function getProjects() {
    try {
        const rawData = await db
            .select({
                id: projects.id,
                name: projects.name,
                description: projects.description,
                status: projects.status,
                priority: projects.priority,
                startDate: projects.startDate,
                endDate: projects.endDate,
                budget: projects.budget,
                customerType: customers.customerType,
                customerFirstName: customers.firstName,
                customerLastName: customers.lastName,
                customerBusinessName: customers.businessName,
                customerEmail: customers.email,
                createdDate: projects.createdAt,
                updatedDate: projects.updatedAt,
            })
            .from(projects)
            .leftJoin(customers, eq(projects.customerId, customers.id))

        return rawData.map(p => ({
            ...p,
            customerName: p.customerType === 'business' 
                ? p.customerBusinessName 
                : `${p.customerFirstName || ''} ${p.customerLastName || ''}`.trim(),
            startDate: p.startDate ? p.startDate.toISOString().split('T')[0] : null,
            endDate: p.endDate ? p.endDate.toISOString().split('T')[0] : null,
            createdDate: p.createdDate.toISOString().split('T')[0],
            updatedDate: p.updatedDate.toISOString().split('T')[0],
        }))
    } catch (error) {
        console.error("Error fetching projects:", error)
        throw new Error(`Failed to fetch projects: ${error.message}`)
    }
}

export async function createProject(formData) {
    try {
        const projectData = {
            id: crypto.randomUUID(),
            name: formData.name,
            description: formData.description || null,
            customerId: formData.customerId,
            status: formData.status || 'active',
            priority: formData.priority || 'medium',
            startDate: formData.startDate ? new Date(formData.startDate) : null,
            endDate: formData.endDate ? new Date(formData.endDate) : null,
            budget: formData.budget ? parseInt(formData.budget) : null,
            notes: formData.notes || null,
            createdBy: null,
        }

        await db.insert(projects).values(projectData)
        
        revalidatePath('/dashboard/projects')
        
        return { success: true }
    } catch (error) {
        console.error("Error creating project:", error)
        return { success: false, error: error.message }
    }
}