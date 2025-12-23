"use client"

import * as React from "react"
import { ChevronDown, CirclePlus } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import DataTable, { type Customer } from "./components/datatable"


export default function CustomersView({data}: {data: Customer[]}) {
    const [globalFilter, setGlobalFilter] = React.useState("")
    const [statusFilter, setStatusFilter] = React.useState<string>("")
    const [ownerFilter, setOwnerFilter] = React.useState<string>("")
    const [hasOutstanding, setHasOutstanding] = React.useState(false)
    const [createdDateFilter, setCreatedDateFilter] = React.useState<string>("")

    return (
        <div className="w-full">
            <div className="flex items-center justify-between">
                <div className="py-10">
                    <h1 className="text-4xl font-bold mb-2">Customers</h1>
                    <p>View and Manage all your Customers</p>
                </div>
                <Link href="/dashboard/customers/new">
                    <Button className="ml-auto">
                        <CirclePlus className="mr-2 h-4 w-4" />
                        New Customer
                    </Button>
                </Link>
            </div>


            <div className="flex flex-col space-y-4 py-4">
                <div className="flex items-center space-x-2">
                    <Input
                        type="text"
                        placeholder="Search customers..."
                        value={globalFilter}
                        onChange={(event) => setGlobalFilter(event.target.value)}
                        className="max-w-sm"
                    />
                </div>
                <div className="flex items-center space-x-4">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent className=''>
                            <SelectItem className='' value="all-statuses">All Statuses</SelectItem>
                            <SelectItem className='' value="Active">Active</SelectItem>
                            <SelectItem className='' value="Prospect">Prospect</SelectItem>
                            <SelectItem className='' value="Inactive">Inactive</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={ownerFilter} onValueChange={setOwnerFilter}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter by owner" />
                        </SelectTrigger>
                        <SelectContent className=''>
                            <SelectItem className='' value="Alice Smith">Alice Smith</SelectItem>
                            <SelectItem className='' value="all-owners">All Owners</SelectItem>
                            <SelectItem className='' value="Bob Johnson">Bob Johnson</SelectItem>
                            <SelectItem className='' value="Charlie Brown">Charlie Brown</SelectItem>
                        </SelectContent>
                    </Select>
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            className=''
                            id="hasOutstanding"
                            checked={hasOutstanding}
                            onCheckedChange={(checked) => setHasOutstanding(!!checked)}
                        />
                        <label htmlFor="hasOutstanding" className="text-sm font-medium">
                            Has outstanding balance
                        </label>
                    </div>
                    <Input
                        type="date"
                        placeholder="Created date"
                        value={createdDateFilter}
                        onChange={(event) => setCreatedDateFilter(event.target.value)}
                        className="w-[180px]"
                    />
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="ml-auto">
                                Columns <ChevronDown />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className=''>
                            {/* Column visibility logic can be added here if needed, but it's now in DataTable */}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
            <DataTable
                data={data}
                globalFilter={globalFilter}
                statusFilter={statusFilter}
                ownerFilter={ownerFilter}
                hasOutstanding={hasOutstanding}
                createdDateFilter={createdDateFilter}
            />
        </div>
    )
}