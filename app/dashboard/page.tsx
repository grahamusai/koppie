'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { getCustomers } from './customers/actions'
import { getProjects } from './projects/actions'
import { getInvoices } from './invoices/actions'
import { getTaskColumns } from './tasks/actions'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
    Users,
    FolderKanban,
    Receipt,
    CheckSquare,
    TrendingUp,
    DollarSign,
    Calendar,
    Bell,
    Plus,
    ArrowRight,
    AlertCircle,
    CheckCircle,
    Clock,
    XCircle
} from 'lucide-react'

type DashboardStats = {
    customers: {
        total: number
        active: number
        recent: number
    }
    projects: {
        total: number
        active: number
        completed: number
        recent: number
    }
    invoices: {
        total: number
        totalAmount: number
        paid: number
        pending: number
        overdue: number
        recent: number
    }
    tasks: {
        total: number
        completed: number
        inProgress: number
        todo: number
        recent: number
    }
}

type RecentActivity = {
    customers: any[]
    projects: any[]
    invoices: any[]
    tasks: any[]
}

export default function DashboardPage() {
    const [stats, setStats] = useState<DashboardStats | null>(null)
    const [recentActivity, setRecentActivity] = useState<RecentActivity | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [customersData, projectsData, invoicesData, tasksData] = await Promise.all([
                    getCustomers(),
                    getProjects(),
                    getInvoices(),
                    getTaskColumns()
                ])

                // Calculate stats
                const now = new Date()
                const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

                const dashboardStats: DashboardStats = {
                    customers: {
                        total: customersData.length,
                        active: customersData.filter(c => c.status === 'Active').length,
                        recent: customersData.filter(c => new Date(c.createdDate) > lastWeek).length
                    },
                    projects: {
                        total: projectsData.length,
                        active: projectsData.filter(p => p.status === 'active').length,
                        completed: projectsData.filter(p => p.status === 'completed').length,
                        recent: projectsData.filter(p => new Date(p.createdDate) > lastWeek).length
                    },
                    invoices: {
                        total: invoicesData.length,
                        totalAmount: invoicesData.reduce((sum, inv) => sum + (inv.amount || 0), 0),
                        paid: invoicesData.filter(inv => inv.status === 'paid').length,
                        pending: invoicesData.filter(inv => inv.status === 'sent').length,
                        overdue: invoicesData.filter(inv => inv.status === 'overdue').length,
                        recent: invoicesData.filter(inv => new Date(inv.createdDate) > lastWeek).length
                    },
                    tasks: {
                        total: tasksData.reduce((sum, col) => sum + col.tasks.length, 0),
                        completed: tasksData.find(col => col.title === 'Done')?.tasks.length || 0,
                        inProgress: tasksData.find(col => col.title === 'In Progress')?.tasks.length || 0,
                        todo: tasksData.find(col => col.title === 'To Do')?.tasks.length || 0,
                        recent: tasksData.reduce((sum, col) =>
                            sum + col.tasks.filter(task => new Date(task.createdAt) > lastWeek).length, 0)
                    }
                }

                // Get recent activity (last 3 from each)
                const recentActivityData: RecentActivity = {
                    customers: customersData.slice(0, 3),
                    projects: projectsData.slice(0, 3),
                    invoices: invoicesData.slice(0, 3),
                    tasks: tasksData.flatMap(col => col.tasks.slice(0, 2)).slice(0, 3)
                }

                setStats(dashboardStats)
                setRecentActivity(recentActivityData)
            } catch (error) {
                console.error("Error fetching dashboard data:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchDashboardData()
    }, [])

    const formatCurrency = (amount: number) => {
        return `R${(amount / 100).toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    }

    const getCompletionPercentage = () => {
        if (!stats) return 0
        const totalTasks = stats.tasks.total
        const completedTasks = stats.tasks.completed
        return totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
    }

    if (loading) {
        return (
            <div className="p-6">
                <div className="flex justify-center items-center h-64">
                    <div className="text-muted-foreground">Loading dashboard...</div>
                </div>
            </div>
        )
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground mt-1">Welcome back! Here's what's happening with your business.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button   variant="outline" size="sm">
                        <Bell className="h-4 w-4 mr-2" />
                        Notifications
                    </Button>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card  >
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent  >
                        <div className="text-2xl font-bold">{stats?.customers.total || 0}</div>
                        <p className="text-xs text-muted-foreground">
                            {stats?.customers.active || 0} active • +{stats?.customers.recent || 0} this week
                        </p>
                    </CardContent>
                </Card>

                <Card  >
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
                        <FolderKanban className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent  >
                        <div className="text-2xl font-bold">{stats?.projects.active || 0}</div>
                        <p className="text-xs text-muted-foreground">
                            of {stats?.projects.total || 0} total • +{stats?.projects.recent || 0} this week
                        </p>
                    </CardContent>
                </Card>

                <Card  >
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Revenue This Month</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent  >
                        <div className="text-2xl font-bold">
                            {stats ? formatCurrency(stats.invoices.totalAmount) : 'R0.00'}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {stats?.invoices.paid || 0} paid • {stats?.invoices.pending || 0} pending
                        </p>
                    </CardContent>
                </Card>

                <Card  >
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Task Completion</CardTitle>
                        <CheckSquare className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent  >
                        <div className="text-2xl font-bold">{getCompletionPercentage()}%</div>
                        <Progress value={getCompletionPercentage()} className="mt-2" />
                        <p className="text-xs text-muted-foreground mt-1">
                            {stats?.tasks.completed || 0} of {stats?.tasks.total || 0} tasks done
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Recent Activity */}
                <Card className="md:col-span-2">
                    <CardHeader  >
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5" />
                            Recent Activity
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {recentActivity && (
                            <>
                                {/* Recent Customers */}
                                {recentActivity.customers.slice(0, 2).map((customer) => (
                                    <div key={customer.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                                        <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                            <Users className="h-4 w-4 text-blue-600" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate">
                                                New customer: {customer.name}
                                            </p>
                                            <p className="text-xs text-muted-foreground">{customer.createdDate}</p>
                                        </div>
                                    </div>
                                ))}

                                {/* Recent Projects */}
                                {recentActivity.projects.slice(0, 2).map((project) => (
                                    <div key={project.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                                        <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                            <FolderKanban className="h-4 w-4 text-green-600" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate">
                                                New project: {project.name}
                                            </p>
                                            <p className="text-xs text-muted-foreground">{project.createdDate}</p>
                                        </div>
                                    </div>
                                ))}

                                {/* Recent Invoices */}
                                {recentActivity.invoices.slice(0, 2).map((invoice) => (
                                    <div key={invoice.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                                        <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                                            <Receipt className="h-4 w-4 text-purple-600" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate">
                                                Invoice {invoice.invoiceNumber}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {formatCurrency(invoice.amount)} • {invoice.issueDate}
                                            </p>
                                        </div>
                                    </div>
                                ))}

                                {/* Recent Tasks */}
                                {recentActivity.tasks.slice(0, 2).map((task) => (
                                    <div key={task.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                                        <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                                            <CheckSquare className="h-4 w-4 text-orange-600" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate">
                                                New task: {task.title}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {new Date(task.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </>
                        )}

                        <div className="pt-2">
                            <Button variant="ghost" className="w-full justify-between" asChild>
                                <Link href="/dashboard/reports">
                                    View All Activity
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card  >
                    <CardHeader  >
                        <CardTitle  >Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <Button className="w-full justify-start" asChild>
                            <Link href="/dashboard/customers/new">
                                <Plus className="h-4 w-4 mr-2" />
                                Add Customer
                            </Link>
                        </Button>
                        <Button className="w-full justify-start" variant="outline" asChild>
                            <Link href="/dashboard/projects/new">
                                <Plus className="h-4 w-4 mr-2" />
                                New Project
                            </Link>
                        </Button>
                        <Button className="w-full justify-start" variant="outline" asChild>
                            <Link href="/dashboard/invoices/new">
                                <Plus className="h-4 w-4 mr-2" />
                                Create Invoice
                            </Link>
                        </Button>
                        <Button className="w-full justify-start" variant="outline" asChild>
                            <Link href="/dashboard/tasks">
                                <CheckSquare className="h-4 w-4 mr-2" />
                                Manage Tasks
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Notifications/Announcements Section */}
            <Card  >
                <CardHeader  >
                    <CardTitle className="flex items-center gap-2">
                        <Bell className="h-5 w-5" />
                        Notifications & Announcements
                    </CardTitle>
                </CardHeader>
                <CardContent  >
                    <div className="space-y-4">
                        {/* Overdue Invoices Alert */}
                        {stats && stats.invoices.overdue > 0 && (
                            <div className="flex items-start gap-3 p-4 rounded-lg bg-red-50 border border-red-200">
                                <XCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                                <div className="flex-1">
                                    <h4 className="text-sm font-medium text-red-800">Overdue Invoices</h4>
                                    <p className="text-sm text-red-700 mt-1">
                                        You have {stats.invoices.overdue} overdue invoice{stats.invoices.overdue !== 1 ? 's' : ''} that need attention.
                                    </p>
                                    <Button variant="outline" size="sm" className="mt-2" asChild>
                                        <Link href="/dashboard/invoices">View Invoices</Link>
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Pending Tasks Alert */}
                        {stats && stats.tasks.todo > 5 && (
                            <div className="flex items-start gap-3 p-4 rounded-lg bg-yellow-50 border border-yellow-200">
                                <Clock className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                                <div className="flex-1">
                                    <h4 className="text-sm font-medium text-yellow-800">Task Backlog</h4>
                                    <p className="text-sm text-yellow-700 mt-1">
                                        You have {stats.tasks.todo} tasks in your backlog. Consider prioritizing them.
                                    </p>
                                    <Button variant="outline" size="sm" className="mt-2" asChild>
                                        <Link href="/dashboard/tasks">Manage Tasks</Link>
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Welcome Message for New Users */}
                        {stats && stats.customers.total === 0 && (
                            <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-50 border border-blue-200">
                                <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                <div className="flex-1">
                                    <h4 className="text-sm font-medium text-blue-800">Welcome to Koppie CRM!</h4>
                                    <p className="text-sm text-blue-700 mt-1">
                                        Get started by adding your first customer or creating a project.
                                    </p>
                                    <div className="flex gap-2 mt-2">
                                        <Button   variant="outline" size="sm" asChild>
                                            <Link href="/dashboard/customers/new">Add Customer</Link>
                                        </Button>
                                        <Button   variant="outline" size="sm" asChild>
                                            <Link href="/dashboard/projects/new">New Project</Link>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Default announcement when no alerts */}
                        {stats && stats.invoices.overdue === 0 && stats.tasks.todo <= 5 && stats.customers.total > 0 && (
                            <div className="flex items-start gap-3 p-4 rounded-lg bg-green-50 border border-green-200">
                                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                                <div className="flex-1">
                                    <h4 className="text-sm font-medium text-green-800">All Systems Operational</h4>
                                    <p className="text-sm text-green-700 mt-1">
                                        Great job! Your business is running smoothly. Keep up the good work!
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Placeholder for future announcements */}
                        <div className="text-center py-8 text-muted-foreground">
                            <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">No new announcements at this time.</p>
                            <p className="text-xs mt-1">System updates and important notices will appear here.</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}