"use client"

import React, { useState, useEffect } from 'react'
import { getReportsData } from './actions'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
    Area,
    AreaChart
} from 'recharts'
import {
    Users,
    FolderKanban,
    Receipt,
    CheckSquare,
    TrendingUp,
    DollarSign,
    Calendar,
    Activity
} from 'lucide-react'



const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

export default function ReportsPage() {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const reportsData = await getReportsData()
                // Cast the data to ReportsData type or ensure getReportsData returns the correct type
                setData(reportsData)
            } catch (error) {
                console.error("Error fetching reports:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    if (loading) {
        return (
            <div className="p-6">
                <div className="flex justify-center items-center h-64">
                    <div className="text-muted-foreground">Loading reports...</div>
                </div>
            </div>
        )
    }

    if (!data) {
        return (
            <div className="p-6">
                <div className="text-center text-muted-foreground">Failed to load reports data</div>
            </div>
        )
    }

    const formatCurrency = (amount) => {
        return `R${amount.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
                    <p className="text-muted-foreground mt-1">Comprehensive overview of your CRM data</p>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card  >
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent  >
                        <div className="text-2xl font-bold">{data.summary.customers.total}</div>
                        <p className="text-xs text-muted-foreground">
                            {data.summary.customers.active} active • {data.summary.customers.business} business
                        </p>
                    </CardContent>
                </Card>

                <Card  >
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
                        <FolderKanban className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent  >
                        <div className="text-2xl font-bold">{data.summary.projects.total}</div>
                        <p className="text-xs text-muted-foreground">
                            {data.summary.projects.active} active • {data.summary.projects.completed} completed
                        </p>
                    </CardContent>
                </Card>

                <Card  >
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent  >
                        <div className="text-2xl font-bold">
                            {data.summary.invoices.totalAmount
                                ? formatCurrency(Number(data.summary.invoices.totalAmount) / 100)
                                : 'R0.00'
                            }
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {data.summary.invoices.paid} paid • {data.summary.invoices.pending} pending
                        </p>
                    </CardContent>
                </Card>

                <Card  >
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
                        <CheckSquare className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent  >
                        <div className="text-2xl font-bold">{data.summary.tasks.total}</div>
                        <p className="text-xs text-muted-foreground">
                            {data.summary.tasks.completed} completed • {data.summary.tasks.inProgress} in progress
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts and Analytics */}
            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList  >
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="customers">Customers</TabsTrigger>
                    <TabsTrigger value="projects">Projects</TabsTrigger>
                    <TabsTrigger value="invoices">Invoices</TabsTrigger>
                    <TabsTrigger value="tasks">Tasks</TabsTrigger>
                    <TabsTrigger value="activity">Recent Activity</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <Card  >
                            <CardHeader  >
                                <CardTitle  >Monthly Revenue Trend</CardTitle>
                            </CardHeader>
                            <CardContent  >
                                <ResponsiveContainer width="100%" height={300}>
                                    <AreaChart data={data.charts.monthlyInvoices}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="month" />
                                        <YAxis />
                                        <Tooltip formatter={(value) => formatCurrency(value)} />
                                        <Area type="monotone" dataKey="amount" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        <Card  >
                            <CardHeader>
                                <CardTitle>Project Status Distribution</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={data.charts.projectStatus}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={(entry) => `${entry.status}: ${entry.count}`}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="count"
                                        >
                                            {data.charts.projectStatus.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="customers" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Customer Types</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={data.charts.customerType}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="type" />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="count" fill="#8884d8" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Customer Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span>Total Customers</span>
                                    <Badge variant="secondary">{data.summary.customers.total}</Badge>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span>Active Customers</span>
                                    <Badge variant="default">{data.summary.customers.active}</Badge>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span>Business Customers</span>
                                    <Badge variant="outline">{data.summary.customers.business}</Badge>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span>Individual Customers</span>
                                    <Badge variant="outline">{data.summary.customers.individual}</Badge>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="projects" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Project Status Overview</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={data.charts.projectStatus}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="status" />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="count" fill="#82ca9d" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Project Metrics</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span>Total Projects</span>
                                    <Badge variant="secondary">{data.summary.projects.total}</Badge>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span>Active Projects</span>
                                    <Badge variant="default">{data.summary.projects.active}</Badge>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span>Completed Projects</span>
                                    <Badge variant="secondary">{data.summary.projects.completed}</Badge>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span>High Priority</span>
                                    <Badge variant="destructive">{data.summary.projects.highPriority}</Badge>
                                </div>
                                {data.summary.projects.totalBudget && (
                                    <div className="flex justify-between items-center">
                                        <span>Total Budget</span>
                                        <Badge variant="outline">{formatCurrency(Number(data.summary.projects.totalBudget))}</Badge>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="invoices" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Monthly Invoice Trend</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={data.charts.monthlyInvoices}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="month" />
                                        <YAxis />
                                        <Tooltip />
                                        <Line type="monotone" dataKey="count" stroke="#8884d8" strokeWidth={2} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Invoice Status</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span>Total Invoices</span>
                                    <Badge variant="secondary">{data.summary.invoices.total}</Badge>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span>Paid</span>
                                    <Badge variant="default">{data.summary.invoices.paid}</Badge>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span>Pending</span>
                                    <Badge variant="secondary">{data.summary.invoices.pending}</Badge>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span>Overdue</span>
                                    <Badge variant="destructive">{data.summary.invoices.overdue}</Badge>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span>Total Revenue</span>
                                    <Badge variant="outline">
                                        {data.summary.invoices.totalAmount
                                            ? formatCurrency(Number(data.summary.invoices.totalAmount) / 100)
                                            : 'R0.00'
                                        }
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="tasks" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Task Priority Distribution</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={data.charts.taskPriority}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={(entry) => `${entry.priority}: ${entry.count}`}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="count"
                                        >
                                            {data.charts.taskPriority.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        <Card  >
                            <CardHeader  >
                                <CardTitle>Task Status</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span>Total Tasks</span>
                                    <Badge variant="secondary">{data.summary.tasks.total}</Badge>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span>To Do</span>
                                    <Badge variant="outline">{data.summary.tasks.todo}</Badge>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span>In Progress</span>
                                    <Badge variant="default">{data.summary.tasks.inProgress}</Badge>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span>Completed</span>
                                    <Badge variant="secondary">{data.summary.tasks.completed}</Badge>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span>High Priority</span>
                                    <Badge variant="destructive">{data.summary.tasks.highPriority}</Badge>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="activity" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card  >
                            <CardHeader  >
                                <CardTitle className="text-sm">Recent Customers</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {data.recent.customers.slice(0, 5).map((customer) => (
                                    <div key={customer.id} className="flex justify-between items-center text-sm">
                                        <span className="truncate">{customer.customerType === 'business' ? customer.businessName : `${customer.firstName} ${customer.lastName}`}</span>
                                        <span className="text-muted-foreground">{customer.createdAt}</span>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        <Card  >
                            <CardHeader  >
                                <CardTitle className="text-sm">Recent Projects</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {data.recent.projects.slice(0, 5).map((project) => (
                                    <div key={project.id} className="flex justify-between items-center text-sm">
                                        <span className="truncate">{project.name}</span>
                                        <span className="text-muted-foreground">{project.createdDate}</span>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        <Card  >
                            <CardHeader  >
                                <CardTitle className="text-sm">Recent Invoices</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {data.recent.invoices.slice(0, 5).map((invoice) => (
                                    <div key={invoice.id} className="flex justify-between items-center text-sm">
                                        <span className="truncate">{invoice.invoiceNumber}</span>
                                        <span className="text-muted-foreground">{formatCurrency(invoice.amount)}</span>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        <Card  >
                            <CardHeader  >
                                <CardTitle className="text-sm">Recent Tasks</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {data.recent.tasks.slice(0, 5).map((task) => (
                                    <div key={task.id} className="flex justify-between items-center text-sm">
                                        <span className="truncate">{task.title}</span>
                                        <span className="text-muted-foreground">{task.columnTitle}</span>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}