"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { createProject } from "../actions"
import { useRouter } from "next/navigation"

type Customer = {
    id: string
    name: string
    email: string
}

type ProjectStatus = "active" | "inactive" | "completed" | "on-hold"
type ProjectPriority = "low" | "medium" | "high"

interface NewProjectFormProps {
    customers: Customer[]
}

export default function NewProjectForm({ customers }: NewProjectFormProps) {
    const [status, setStatus] = useState<ProjectStatus>("active")
    const [priority, setPriority] = useState<ProjectPriority>("medium")
    const [isPending, startTransition] = useTransition()
    const [customerSearch, setCustomerSearch] = useState("")
    const router = useRouter()

    // Filter customers based on search
    const filteredCustomers = customers.filter(customer =>
        customer.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
        customer.email.toLowerCase().includes(customerSearch.toLowerCase())
    )

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const formData = new FormData(e.currentTarget)
        const data = {
            name: formData.get("name") as string,
            description: formData.get("description") as string,
            customerId: formData.get("customerId") as string,
            status,
            priority,
            startDate: formData.get("startDate") as string,
            endDate: formData.get("endDate") as string,
            budget: formData.get("budget") as string,
            notes: formData.get("notes") as string,
        }

        startTransition(async () => {
            const result = await createProject(data)
            if (result.success) {
                router.push('/dashboard/projects')
            } else {
                alert('Failed to create project. Please try again.')
            }
        })
    }

    return (
        <Card className="p-6 max-w-full">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <Label className='' htmlFor="name">Project Name *</Label>
                    <Input
                    className=''
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Enter project name"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label className='' htmlFor="description">Description</Label>
                    <Textarea
                    className=''
                        id="description"
                        name="description"
                        placeholder="Project description..."
                        rows={3}
                    />
                </div>

                <div className="space-y-2">
                    <Label className='' htmlFor="customerId">Customer *</Label>
                    <div className="space-y-2">
                        <Input
                            type="text"
                            placeholder="Search customers by name or email..."
                            value={customerSearch}
                            onChange={(e) => setCustomerSearch(e.target.value)}
                            className="mb-2"
                        />
                        <Select name="customerId" required>
                            <SelectTrigger className=''>
                                <SelectValue placeholder="Select a customer" />
                            </SelectTrigger>
                            <SelectContent className=''>
                                {filteredCustomers.length === 0 ? (
                                    <div className="p-2 text-sm text-muted-foreground">
                                        {customerSearch ? "No customers found matching your search" : "No customers available"}
                                    </div>
                                ) : (
                                    filteredCustomers.map((customer) => (
                                        <SelectItem className='' key={customer.id} value={customer.id}>
                                            {customer.name} ({customer.email})
                                        </SelectItem>
                                    ))
                                )}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label className='' htmlFor="status">Status</Label>
                        <Select value={status} onValueChange={(value) => setStatus(value as ProjectStatus)}>
                            <SelectTrigger className=''>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className=''>
                                <SelectItem className='' value="active">Active</SelectItem>
                                <SelectItem className='' value="inactive">Inactive</SelectItem>
                                <SelectItem className='' value="completed">Completed</SelectItem>
                                <SelectItem className='' value="on-hold">On Hold</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label className='' htmlFor="priority">Priority</Label>
                        <Select value={priority} onValueChange={(value) => setPriority(value as ProjectPriority)}>
                            <SelectTrigger className=''>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className=''>
                                <SelectItem className='' value="low">Low</SelectItem>
                                <SelectItem className='' value="medium">Medium</SelectItem>
                                <SelectItem className='' value="high">High</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label className='' htmlFor="startDate">Start Date</Label>
                        <Input
                        className=''
                            id="startDate"
                            name="startDate"
                            type="date"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className='' htmlFor="endDate">End Date</Label>
                        <Input
                        className=''
                            id="endDate"
                            name="endDate"
                            type="date"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label className='' htmlFor="budget">Budget (ZAR)</Label>
                    <Input
                    className=''
                        id="budget"
                        name="budget"
                        type="number"
                        placeholder="0"
                        min="0"
                    />
                </div>

                <div className="space-y-2">
                    <Label className='' htmlFor="notes">Notes</Label>
                    <Textarea
                    className=''
                        id="notes"
                        name="notes"
                        placeholder="Additional notes..."
                        rows={3}
                    />
                </div>

                <div className="flex gap-4">
                    <Button className='' type="submit" disabled={isPending}>
                        {isPending ? "Creating..." : "Create Project"}
                    </Button>
                    <Button className='' type="button" variant="outline" onClick={() => router.back()}>
                        Cancel
                    </Button>
                </div>
            </form>
        </Card>
    )
}