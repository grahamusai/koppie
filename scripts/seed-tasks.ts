import { db } from "@/lib/db";
import { taskColumns, tasks } from "@/db/schema";

async function seedTasks() {
  try {
    // Create default columns
    const columns = [
      { id: "todo", title: "To Do", position: 1 },
      { id: "in-progress", title: "In Progress", position: 2 },
      { id: "under-review", title: "Under Review", position: 3 },
      { id: "done", title: "Done", position: 4 },
    ];

    for (const column of columns) {
      await db.insert(taskColumns).values(column).onConflictDoNothing();
    }

    // Create sample tasks
    const sampleTasks = [
      {
        id: "1",
        title: "Design new landing page",
        description: "Create wireframes and mockups for the new landing page",
        assignee: "Sarah Johnson",
        dueDate: new Date("2026-01-15").toString(), // Convert to string
        priority: "high",
        columnId: "todo",
        position: 1,
        archived: false,
      },
      {
        id: "2",
        title: "Update CRM documentation",
        description: "Add new features to the documentation",
        assignee: "Mike Chen",
        dueDate: new Date("2026-01-18").toString(),
        priority: "medium",
        columnId: "todo",
        position: 2,
        archived: false,
      },
      {
        id: "3",
        title: "Implement user authentication",
        description: "Set up OAuth and JWT tokens",
        assignee: "Alex Rivera",
        dueDate: new Date("2026-01-12").toString(),
        priority: "high",
        columnId: "in-progress",
        position: 1,
        archived: false,
      },
      {
        id: "4",
        title: "Database optimization",
        description: "Improve query performance",
        assignee: "Emma Davis",
        dueDate: new Date("2026-01-10").toString(),
        priority: "medium",
        columnId: "under-review",
        position: 1,
        archived: false,
      },
      {
        id: "5",
        title: "Setup CI/CD pipeline",
        description: "Configure automated deployments",
        assignee: "David Park",
        dueDate: new Date("2026-01-08").toString(),
        priority: "low",
        columnId: "done",
        position: 1,
        archived: false,
      },
    ];

    for (const task of sampleTasks) {
      await db.insert(tasks).values(task).onConflictDoNothing();
    }

    console.log("Tasks seeded successfully!");
  } catch (error) {
    console.error("Error seeding tasks:", error);
  }
}

seedTasks();
