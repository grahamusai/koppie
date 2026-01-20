'use server'

import { db } from "@/lib/db"
import { tasks, taskColumns } from "@/db/schema"
import { eq, asc, max } from "drizzle-orm"
import { revalidatePath } from "next/cache"

export async function getTaskColumns() {
    try {
        const columns = await db
            .select()
            .from(taskColumns)
            .orderBy(asc(taskColumns.position))

        const columnsWithTasks = await Promise.all(
            columns.map(async (column) => {
                const columnTasks = await db
                    .select()
                    .from(tasks)
                    .where(eq(tasks.columnId, column.id))
                    .orderBy(asc(tasks.position))

                return {
                    ...column,
                    tasks: columnTasks.map(task => ({
                        ...task,
                        dueDate: task.dueDate ? task.dueDate.toString().split('T')[0] : null,
                        createdAt: task.createdAt.toString(),
                        updatedAt: task.updatedAt.toString(),
                    }))
                }
            })
        )

        return columnsWithTasks
    } catch (error) {
        console.error("Error fetching task columns:", error)
        throw new Error(`Failed to fetch task columns: ${error.message}`)
    }
}

export async function createTask(formData) {
    try {
        // Get the highest position in the target column
        const [{ maxPosition }] = await db
            .select({ maxPosition: max(tasks.position) })
            .from(tasks)
            .where(eq(tasks.columnId, formData.columnId))

        const taskData = {
            id: crypto.randomUUID(),
            title: formData.title,
            description: formData.description || null,
            assignee: formData.assignee || null,
            dueDate: formData.dueDate ? new Date(formData.dueDate) : null,
            priority: formData.priority || 'medium',
            columnId: formData.columnId,
            position: (maxPosition || 0) + 1,
            archived: false,
            createdBy: null,
        }

        await db.insert(tasks).values(taskData)

        revalidatePath('/dashboard/tasks')

        return { success: true }
    } catch (error) {
        console.error("Error creating task:", error)
        return { success: false, error: error.message }
    }
}

export async function updateTask(taskId, formData) {
    try {
        const updateData = {
            title: formData.title,
            description: formData.description || null,
            assignee: formData.assignee || null,
            dueDate: formData.dueDate ? new Date(formData.dueDate) : null,
            priority: formData.priority || 'medium',
            updatedAt: new Date(),
        }

        await db.update(tasks).set(updateData).where(eq(tasks.id, taskId))

        revalidatePath('/dashboard/tasks')

        return { success: true }
    } catch (error) {
        console.error("Error updating task:", error)
        return { success: false, error: error.message }
    }
}

export async function moveTask(taskId, newColumnId, newPosition) {
    try {
        // Update the task's column and position
        await db.update(tasks)
            .set({
                columnId: newColumnId,
                position: newPosition,
                updatedAt: new Date(),
            })
            .where(eq(tasks.id, taskId))

        revalidatePath('/dashboard/tasks')

        return { success: true }
    } catch (error) {
        console.error("Error moving task:", error)
        return { success: false, error: error.message }
    }
}

export async function archiveTask(taskId) {
    try {
        await db.update(tasks)
            .set({
                archived: true,
                updatedAt: new Date(),
            })
            .where(eq(tasks.id, taskId))

        revalidatePath('/dashboard/tasks')

        return { success: true }
    } catch (error) {
        console.error("Error archiving task:", error)
        return { success: false, error: error.message }
    }
}

export async function deleteTask(taskId) {
    try {
        await db.delete(tasks).where(eq(tasks.id, taskId))

        revalidatePath('/dashboard/tasks')

        return { success: true }
    } catch (error) {
        console.error("Error deleting task:", error)
        return { success: false, error: error.message }
    }
}

export async function createColumn(title) {
    try {
        // Get the highest position
        const [{ maxPosition }] = await db
            .select({ maxPosition: max(taskColumns.position) })
            .from(taskColumns)

        const columnData = {
            id: crypto.randomUUID(),
            title,
            position: (maxPosition || 0) + 1,
        }

        await db.insert(taskColumns).values(columnData)

        revalidatePath('/dashboard/tasks')

        return { success: true }
    } catch (error) {
        console.error("Error creating column:", error)
        return { success: false, error: error.message }
    }
}