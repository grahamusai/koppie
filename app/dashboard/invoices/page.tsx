"use client"

import React, { useState, useEffect } from 'react'
import { getInvoices } from './actions'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import Link from "next/link"

type Invoice = {
    id: string
    invoiceNumber: string
    amount: number
    status: string
    issueDate: string | null
    dueDate: string | null
    description: string | null
    customerName: string
    customerEmail: string
    projectName: string | null
    createdDate: string
    updatedDate: string
}

const Invoices = () => {
    const [invoices, setInvoices] = useState<Invoice[]>([])
    const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState<string>("all")

    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                const data = await getInvoices()
                setInvoices(data)
                setFilteredInvoices(data)
            } catch (error) {
                console.error("Error fetching invoices:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchInvoices()
    }, [])

    useEffect(() => {
        let filtered = invoices

        // Filter by search term (invoice number, customer name, project name)
        if (searchTerm) {
            filtered = filtered.filter(invoice =>
                invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (invoice.projectName && invoice.projectName.toLowerCase().includes(searchTerm.toLowerCase()))
            )
        }

        // Filter by status
        if (statusFilter !== "all") {
            filtered = filtered.filter(invoice => invoice.status === statusFilter)
        }

        setFilteredInvoices(filtered)
    }, [invoices, searchTerm, statusFilter])

    const clearFilters = () => {
        setSearchTerm("")
        setStatusFilter("all")
    }

    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'paid': return 'default'
            case 'sent': return 'secondary'
            case 'overdue': return 'destructive'
            case 'draft': return 'outline'
            default: return 'secondary'
        }
    }

    const formatAmount = (amount: number) => {
        return `R${(amount / 100).toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Invoices</h1>
                <Button   asChild>
                    <Link href="/dashboard/invoices/new">New Invoice</Link>
                </Button>
            </div>

            {/* Filters */}
            <Card className="p-4 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <Input
                            type='text'
                            placeholder="Search invoices, customers, projects..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full"
                        />
                    </div>
                    <div className="flex gap-2">
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-40">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="draft">Draft</SelectItem>
                                <SelectItem value="sent">Sent</SelectItem>
                                <SelectItem value="paid">Paid</SelectItem>
                                <SelectItem value="overdue">Overdue</SelectItem>
                            </SelectContent>
                        </Select>

                        <Button variant="outline" onClick={clearFilters}>
                            Clear
                        </Button>
                    </div>
                </div>
                <div className="mt-2 text-sm text-muted-foreground">
                    Showing {filteredInvoices.length} of {invoices.length} invoices
                </div>
            </Card>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Invoice #</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Project</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Issue Date</TableHead>
                            <TableHead>Due Date</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center py-8">
                                    Loading invoices...
                                </TableCell>
                            </TableRow>
                        ) : filteredInvoices.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                                    {invoices.length === 0 ? (
                                        <>No invoices found. <Link href="/dashboard/invoices/new" className="text-primary hover:underline">Create your first invoice</Link></>
                                    ) : (
                                        "No invoices match your filters"
                                    )}
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredInvoices.map((invoice) => (
                                <TableRow key={invoice.id}>
                                    <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                                    <TableCell>{invoice.customerName}</TableCell>
                                    <TableCell>{invoice.projectName || '-'}</TableCell>
                                    <TableCell className="font-medium">{formatAmount(invoice.amount)}</TableCell>
                                    <TableCell>
                                        <Badge variant={getStatusVariant(invoice.status)}>
                                            {invoice.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{invoice.issueDate || '-'}</TableCell>
                                    <TableCell>{invoice.dueDate || '-'}</TableCell>
                                    <TableCell>
                                        <Button variant="ghost" size="sm" asChild>
                                            <Link href={`/dashboard/invoices/${invoice.id}`}>View</Link>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

export default Invoices