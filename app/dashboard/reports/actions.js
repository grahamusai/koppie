'use server'

import { db } from "@/lib/db"
import { customers, projects, invoices, tasks, taskColumns } from "@/db/schema"
import { eq, sql, desc, count, sum } from "drizzle-orm"



export async function getReportsData() {
    try {
        // Customer statistics
        const customerStats = await db
            .select({
                total: count(),
                active: sql<number>`count(case when ${customers.status} = 'active' then 1 end)`,
                business: sql<number>`count(case when ${customers.customerType} = 'business' then 1 end)`,
                individual: sql<number>`count(case when ${customers.customerType} = 'individual' then 1 end)`,
            })
            .from(customers)

        // Project statistics
        const projectStats = await db
            .select({
                total: count(),
                active: sql<number>`count(case when ${projects.status} = 'active' then 1 end)`,
                completed: sql<number>`count(case when ${projects.status} = 'completed' then 1 end)`,
                highPriority: sql<number>`count(case when ${projects.priority} = 'high' then 1 end)`,
                totalBudget: sum(projects.budget),
            })
            .from(projects)

        // Invoice statistics
        const invoiceStats = await db
            .select({
                total: count(),
                totalAmount: sum(invoices.amount),
                paid: sql<number>`count(case when ${invoices.status} = 'paid' then 1 end)`,
                pending: sql<number>`count(case when ${invoices.status} = 'sent' then 1 end)`,
                overdue: sql<number>`count(case when ${invoices.status} = 'overdue' then 1 end)`,
            })
            .from(invoices)

        // Task statistics
        const taskStats = await db
            .select({
                total: count(),
                completed: sql<number>`count(case when ${taskColumns.title} = 'Done' then 1 end)`,
                inProgress: sql<number>`count(case when ${taskColumns.title} = 'In Progress' then 1 end)`,
                todo: sql<number>`count(case when ${taskColumns.title} = 'To Do' then 1 end)`,
                highPriority: sql<number>`count(case when ${tasks.priority} = 'high' then 1 end)`,
            })
            .from(tasks)
            .leftJoin(taskColumns, eq(tasks.columnId, taskColumns.id))

        // Monthly invoice data for chart
        const monthlyInvoices = await db
            .select({
                month: sql`strftime('%Y-%m', ${invoices.issueDate})`,
                total: count(),
                amount: sum(invoices.amount),
            })
            .from(invoices)
            .groupBy(sql`strftime('%Y-%m', ${invoices.issueDate})`)
            .orderBy(sql`strftime('%Y-%m', ${invoices.issueDate})`)

        // Project status distribution
        const projectStatusData = await db
            .select({
                status: projects.status,
                count: count(),
            })
            .from(projects)
            .where(sql`${projects.status} is not null`)
            .groupBy(projects.status)

        // Task priority distribution
        const taskPriorityData = await db
            .select({
                priority: tasks.priority,
                count: count(),
            })
            .from(tasks)
            .where(sql`${tasks.priority} is not null`)
            .groupBy(tasks.priority)

        // Customer growth over time
        const customerGrowth = await db
            .select({
                month: sql`strftime('%Y-%m', ${customers.createdAt})`,
                count: count(),
            })
            .from(customers)
            .groupBy(sql`strftime('%Y-%m', ${customers.createdAt})`)
            .orderBy(sql`strftime('%Y-%m', ${customers.createdAt})`)

        // Invoice status distribution
        const invoiceStatusData = await db
            .select({
                status: invoices.status,
                count: count(),
            })
            .from(invoices)
            .where(sql`${invoices.status} is not null`)
            .groupBy(invoices.status)

        // Task completion over time
        const taskCompletion = await db
            .select({
                month: sql`strftime('%Y-%m', ${tasks.createdAt})`,
                created: count(),
                completed: sql<number>`count(case when ${taskColumns.title} = 'Done' then 1 end)`,
            })
            .from(tasks)
            .leftJoin(taskColumns, eq(tasks.columnId, taskColumns.id))
            .groupBy(sql`strftime('%Y-%m', ${tasks.createdAt})`)
            .orderBy(sql`strftime('%Y-%m', ${tasks.createdAt})`)
        const recentCustomers = await db
            .select()
            .from(customers)
            .orderBy(desc(customers.createdAt))
            .limit(5)

        const recentProjects = await db
            .select()
            .from(projects)
            .orderBy(desc(projects.createdAt))
            .limit(5)

        const recentInvoices = await db
            .select()
            .from(invoices)
            .orderBy(desc(invoices.createdAt))
            .limit(5)

        const recentTasks = await db
            .select({
                id: tasks.id,
                title: tasks.title,
                createdAt: tasks.createdAt,
                columnTitle: taskColumns.title,
            })
            .from(tasks)
            .leftJoin(taskColumns, eq(tasks.columnId, taskColumns.id))
            .orderBy(desc(tasks.createdAt))
            .limit(5)

        return {
            summary: {
                customers: {
                    total: customerStats[0].total,
                    active: customerStats[0].active,
                    business: customerStats[0].business,
                    individual: customerStats[0].individual,
                },
                projects: {
                    total: projectStats[0].total,
                    active: projectStats[0].active,
                    completed: projectStats[0].completed,
                    highPriority: projectStats[0].highPriority,
                    totalBudget: projectStats[0].totalBudget ? Number(projectStats[0].totalBudget) : null,
                },
                invoices: {
                    total: invoiceStats[0].total,
                    totalAmount: invoiceStats[0].totalAmount ? Number(invoiceStats[0].totalAmount) : null,
                    paid: invoiceStats[0].paid,
                    pending: invoiceStats[0].pending,
                    overdue: invoiceStats[0].overdue,
                },
                tasks: {
                    total: taskStats[0].total,
                    completed: taskStats[0].completed,
                    inProgress: taskStats[0].inProgress,
                    todo: taskStats[0].todo,
                    highPriority: taskStats[0].highPriority,
                },
            },
            charts: {
                customerGrowth: customerGrowth.map(item => ({
                    month: String(item.month),
                    count: item.count,
                })),
                customerType: [
                    { type: 'Business', count: customerStats[0].business },
                    { type: 'Individual', count: customerStats[0].individual },
                ],
                projectStatus: projectStatusData.map(item => ({
                    status: item.status,
                    count: item.count,
                })),
                invoiceStatus: invoiceStatusData.map(item => ({
                    status: item.status,
                    count: item.count,
                })),
                monthlyInvoices: monthlyInvoices.map(item => ({
                    month: item.month,
                    amount: item.amount ? Number(item.amount) / 100 : 0, // Convert from cents
                    count: item.total,
                })),
                revenueByMonth: monthlyInvoices.map(item => ({
                    month: item.month,
                    amount: item.amount ? Number(item.amount) / 100 : 0, // Convert from cents
                })),
                taskPriority: taskPriorityData.map(item => ({
                    priority: item.priority,
                    count: item.count,
                })),
                taskCompletion: taskCompletion.map(item => ({
                    month: String(item.month),
                    completed: item.completed,
                    created: item.created,
                })),
            },
            recent: {
                customers: recentCustomers.map(c => ({
                    ...c,
                    createdAt: c.createdAt.toString().split('T')[0],
                })),
                projects: recentProjects.map(p => ({
                    ...p,
                    createdAt: p.createdAt.toString().split('T')[0],
                })),
                invoices: recentInvoices.map(i => ({
                    ...i,
                    amount: i.amount ? Number(i.amount) / 100 : 0, // Convert from cents
                    issueDate: i.issueDate ? i.issueDate.toString().split('T')[0] : null,
                    createdAt: i.createdAt.toString().split('T')[0],
                })),
                tasks: recentTasks.map(t => ({
                    ...t,
                    createdAt: t.createdAt.toString().split('T')[0],
                })),
            },
        }
    } catch (error) {
        console.error("Error fetching reports data:", error)
        throw new Error(`Failed to fetch reports data: ${error.message}`)
    }
}