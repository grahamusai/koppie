"use client"


import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Plus, GripVertical, MoreHorizontal, Calendar, User, Edit, Archive, Trash2, X } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { getTaskColumns, createTask, updateTask, moveTask, archiveTask, deleteTask, createColumn } from "./actions"



export default function TasksPage() {
  const [columns, setColumns] = useState([])
  const [loading, setLoading] = useState(true)
  const [draggedTask, setDraggedTask] = useState(null)
  const [showAddTaskDialog, setShowAddTaskDialog] = useState(false)
  const [showEditTaskDialog, setShowEditTaskDialog] = useState(false)
  const [selectedColumnId, setSelectedColumnId] = useState("")
  const [editingTask, setEditingTask] = useState(null)
  const [showAddColumnDialog, setShowAddColumnDialog] = useState(false)

  useEffect(() => {
    fetchColumns()
  }, [])

  const fetchColumns = async () => {
    try {
      const data = await getTaskColumns()
      setColumns(data)
    } catch (error) {
      console.error("Error fetching columns:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDragStart = (task, columnId) => {
    setDraggedTask({ task, columnId })
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDrop = async (targetColumnId) => {
    if (!draggedTask) return

    // Find the target column and calculate new position
    const targetColumn = columns.find(col => col.id === targetColumnId)
    if (!targetColumn) return

    const newPosition = targetColumn.tasks.length + 1

    try {
      await moveTask(draggedTask.task.id, targetColumnId, newPosition)
      await fetchColumns() // Refresh data
    } catch (error) {
      console.error("Error moving task:", error)
    }

    setDraggedTask(null)
  }

  const handleAddTask = async (formData) => {
    try {
      const data = {
        title: formData.get("title"),
        description: formData.get("description"),
        assignee: formData.get("assignee"),
        dueDate: formData.get("dueDate"),
        priority: formData.get("priority"),
        columnId: selectedColumnId,
      }

      await createTask(data)
      await fetchColumns()
      setShowAddTaskDialog(false)
    } catch (error) {
      console.error("Error creating task:", error)
    }
  }

  const handleEditTask = async (formData) => {
    if (!editingTask) return

    try {
      const data = {
        title: formData.get("title"),
        description: formData.get("description"),
        assignee: formData.get("assignee"),
        dueDate: formData.get("dueDate"),
        priority: formData.get("priority"),
      }

      await updateTask(editingTask.id, data)
      await fetchColumns()
      setShowEditTaskDialog(false)
      setEditingTask(null)
    } catch (error) {
      console.error("Error updating task:", error)
    }
  }

  const handleArchiveTask = async (taskId) => {
    try {
      await archiveTask(taskId)
      await fetchColumns()
    } catch (error) {
      console.error("Error archiving task:", error)
    }
  }

  const handleDeleteTask = async (taskId) => {
    if (!confirm("Are you sure you want to delete this task?")) return

    try {
      await deleteTask(taskId)
      await fetchColumns()
    } catch (error) {
      console.error("Error deleting task:", error)
    }
  }

  const handleAddColumn = async (formData) => {
    try {
      const title = formData.get("title")
      await createColumn(title)
      await fetchColumns()
      setShowAddColumnDialog(false)
    } catch (error) {
      console.error("Error creating column:", error)
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-500/10 text-red-600 dark:text-red-400"
      case "medium":
        return "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"
      case "low":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <div className="min-h-screen p-6">
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Tasks</h1>
            <p className="text-muted-foreground mt-1">Manage your team's work with kanban boards</p>
          </div>
          <Dialog open={showAddColumnDialog} onOpenChange={setShowAddColumnDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Column
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Column</DialogTitle>
              </DialogHeader>
              <form action={handleAddColumn} className="space-y-4">
                <div>
                  <Label htmlFor="column-title">Column Title</Label>
                  <Input type='text' id="column-title" name="title" placeholder="e.g., In Review" required />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setShowAddColumnDialog(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Add Column</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-muted-foreground">Loading tasks...</div>
          </div>
        ) : (
          <div className="flex gap-6 overflow-x-auto pb-6">
            {columns.map((column) => (
              <div
                key={column.id}
                className="flex-shrink-0 w-[350px]"
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(column.id)}
              >
                <div className="bg-muted/30 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <h2 className="font-semibold text-foreground">{column.title}</h2>
                      <Badge variant="secondary" className="rounded-full">
                        {column.tasks.length}
                      </Badge>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => {
                          setSelectedColumnId(column.id)
                          setShowAddTaskDialog(true)
                        }}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Task
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="space-y-3 min-h-[200px]">
                    {column.tasks.map((task) => (
                      <Card
                        key={task.id}
                        draggable
                        onDragStart={() => handleDragStart(task, column.id)}
                        className="cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow"
                      >
                        <CardHeader className="p-4 pb-3">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-start gap-2 flex-1">
                              <GripVertical className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-sm text-foreground leading-snug">{task.title}</h3>
                              </div>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-6 w-6 flex-shrink-0">
                                  <MoreHorizontal className="h-3.5 w-3.5" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => {
                                  setEditingTask(task)
                                  setShowEditTaskDialog(true)
                                }}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleArchiveTask(task.id)}>
                                  <Archive className="h-4 w-4 mr-2" />
                                  Archive
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDeleteTask(task.id)}
                                  className="text-destructive"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          {task.description && (
                            <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{task.description}</p>
                          )}
                          <div className="flex items-center justify-between gap-2">
                            <Badge className={getPriorityColor(task.priority)} variant="secondary">
                              {task.priority}
                            </Badge>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                              {task.dueDate && (
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  <span>{task.dueDate}</span>
                                </div>
                              )}
                              {task.assignee && (
                                <div className="flex items-center gap-1">
                                  <User className="h-3 w-3" />
                                  <span className="truncate max-w-[80px]">{task.assignee}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <Button
                    variant="ghost"
                    className="w-full mt-3 justify-start text-muted-foreground"
                    onClick={() => {
                      setSelectedColumnId(column.id)
                      setShowAddTaskDialog(true)
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add task
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Task Dialog */}
      <Dialog open={showAddTaskDialog} onOpenChange={setShowAddTaskDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
          </DialogHeader>
          <form action={handleAddTask} className="space-y-4">
            <div>
              <Label htmlFor="task-title">Title *</Label>
              <Input type='text' id="task-title" name="title" placeholder="Task title" required />
            </div>
            <div>
              <Label htmlFor="task-description">Description</Label>
              <Textarea id="task-description" name="description" placeholder="Task description" />
            </div>
            <div>
              <Label htmlFor="task-assignee">Assignee</Label>
              <Input type='' id="task-assignee" name="assignee" placeholder="Assignee name" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="task-due-date">Due Date</Label>
                <Input id="task-due-date" name="dueDate" type="date" />
              </div>
              <div>
                <Label htmlFor="task-priority">Priority</Label>
                <Select name="priority" defaultValue="medium">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setShowAddTaskDialog(false)}>
                Cancel
              </Button>
              <Button type="submit">Add Task</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Task Dialog */}
      <Dialog open={showEditTaskDialog} onOpenChange={setShowEditTaskDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          {editingTask && (
            <form action={handleEditTask} className="space-y-4">
              <div>
                <Label htmlFor="edit-task-title">Title *</Label>
                <Input
                  type=''
                  id="edit-task-title"
                  name="title"
                  placeholder="Task title"
                  defaultValue={editingTask.title}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-task-description">Description</Label>
                <Textarea
                  id="edit-task-description"
                  name="description"
                  placeholder="Task description"
                  defaultValue={editingTask.description || ""}
                />
              </div>
              <div>
                <Label htmlFor="edit-task-assignee">Assignee</Label>
                <Input
                  type=''
                  id="edit-task-assignee"
                  name="assignee"
                  placeholder="Assignee name"
                  defaultValue={editingTask.assignee || ""}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-task-due-date">Due Date</Label>
                  <Input
                    id="edit-task-due-date"
                    name="dueDate"
                    type="date"
                    defaultValue={editingTask.dueDate || ""}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-task-priority">Priority</Label>
                  <Select name="priority" defaultValue={editingTask.priority}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setShowEditTaskDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit">Update Task</Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
