"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { createInvoice } from "../actions"
import { useRouter } from "next/navigation"

type Customer = {
    id: string
    name: string
    email: string
}

type Project = {
    id: string
    name: string
    customerName: string
}

type InvoiceStatus = "draft" | "sent" | "paid" | "overdue"

interface NewInvoiceFormProps {
    customers: Customer[]
    projects: Project[]
}

export default function NewInvoiceForm({ customers, projects }: NewInvoiceFormProps) {
    const [status, setStatus] = useState<InvoiceStatus>("draft")
    const [customerSearch, setCustomerSearch] = useState("")
    const [projectSearch, setProjectSearch] = useState("")
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    // Filter customers based on search
    const filteredCustomers = customers.filter(customer =>
        customer.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
        customer.email.toLowerCase().includes(customerSearch.toLowerCase())
    )

    // Filter projects based on search
    const filteredProjects = projects.filter(project =>
        project.name.toLowerCase().includes(projectSearch.toLowerCase()) ||
        project.customerName.toLowerCase().includes(projectSearch.toLowerCase())
    )

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const formData = new FormData(e.currentTarget)
        const data = {
            invoiceNumber: formData.get("invoiceNumber") as string,
            customerId: formData.get("customerId") as string,
            projectId: (formData.get("projectId") as string) || undefined,
            amount: formData.get("amount") as string,
            status,
            issueDate: formData.get("issueDate") as string,
            dueDate: (formData.get("dueDate") as string) || undefined,
            description: (formData.get("description") as string) || undefined,
            notes: (formData.get("notes") as string) || undefined,
        }

        startTransition(async () => {
            const result = await createInvoice(data)
            if (result.success) {
                router.push('/dashboard/invoices')
            } else {
                alert('Failed to create invoice. Please try again.')
            }
        })
    }

    // Auto-generate invoice number
    const generateInvoiceNumber = () => {
        const now = new Date()
        const year = now.getFullYear()
        const month = String(now.getMonth() + 1).padStart(2, '0')
        const day = String(now.getDate()).padStart(2, '0')
        const timestamp = now.getTime().toString().slice(-4)
        return `INV-${year}${month}${day}-${timestamp}`
    }

    return (
        <Card className="p-6 max-w-full">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="invoiceNumber">Invoice Number *</Label>
                    <div className="flex gap-2">
                        <Input
                            id="invoiceNumber"
                            name="invoiceNumber"
                            type="text"
                            placeholder="INV-20241201-0001"
                            defaultValue={generateInvoiceNumber()}
                            required
                        />
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                const input = document.getElementById('invoiceNumber') as HTMLInputElement
                                if (input) input.value = generateInvoiceNumber()
                            }}
                        >
                            Generate
                        </Button>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="customerId">Customer *</Label>
                    <div className="space-y-2">
                        <Input
                            type="text"
                            placeholder="Search customers by name or email..."
                            value={customerSearch}
                            onChange={(e) => setCustomerSearch(e.target.value)}
                            className="mb-2"
                        />
                        <Select name="customerId" required>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a customer" />
                            </SelectTrigger>
                            <SelectContent>
                                {filteredCustomers.length === 0 ? (
                                    <div className="p-2 text-sm text-muted-foreground">
                                        {customerSearch ? "No customers found matching your search" : "No customers available"}
                                    </div>
                                ) : (
                                    filteredCustomers.map((customer) => (
                                        <SelectItem key={customer.id} value={customer.id}>
                                            {customer.name} ({customer.email})
                                        </SelectItem>
                                    ))
                                )}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="projectId">Project (Optional)</Label>
                    <div className="space-y-2">
                        <Input
                            type="text"
                            placeholder="Search projects..."
                            value={projectSearch}
                            onChange={(e) => setProjectSearch(e.target.value)}
                            className="mb-2"
                        />
                        <Select name="projectId">
                            <SelectTrigger>
                                <SelectValue placeholder="Select a project (optional)" />
                            </SelectTrigger>
                            <SelectContent>
                                {filteredProjects.length === 0 ? (
                                    <div className="p-2 text-sm text-muted-foreground">
                                        {projectSearch ? "No projects found matching your search" : "No projects available"}
                                    </div>
                                ) : (
                                    filteredProjects.map((project) => (
                                        <SelectItem key={project.id} value={project.id}>
                                            {project.name} - {project.customerName}
                                        </SelectItem>
                                    ))
                                )}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="amount">Amount (ZAR) *</Label>
                        <Input
                            id="amount"
                            name="amount"
                            type="number"
                            placeholder="0.00"
                            step="0.01"
                            min="0"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select value={status} onValueChange={(value) => setStatus(value as InvoiceStatus)}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="draft">Draft</SelectItem>
                                <SelectItem value="sent">Sent</SelectItem>
                                <SelectItem value="paid">Paid</SelectItem>
                                <SelectItem value="overdue">Overdue</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="issueDate">Issue Date *</Label>
                        <Input
                            id="issueDate"
                            name="issueDate"
                            type="date"
                            defaultValue={new Date().toISOString().split('T')[0]}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="dueDate">Due Date</Label>
                        <Input
                            id="dueDate"
                            name="dueDate"
                            type="date"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                        id="description"
                        name="description"
                        placeholder="Invoice description..."
                        rows={3}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                        id="notes"
                        name="notes"
                        placeholder="Additional notes..."
                        rows={3}
                    />
                </div>

                <div className="flex gap-4">
                    <Button type="submit" disabled={isPending}>
                        {isPending ? "Creating..." : "Create Invoice"}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => router.back()}>
                        Cancel
                    </Button>
                </div>
            </form>
        </Card>
    )
}