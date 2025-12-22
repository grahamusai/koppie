"use client"

import * as React from "react"
import { useRouter } from 'next/navigation'
import Link from "next/link"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export type Customer = {
  id: string
  name: string
  email: string
  phone: string
  company: string
  type: "Individual" | "Business"
  status: "Active" | "Prospect" | "Inactive"
  openItems: string
  outstanding: number
  lastActivity: string
  owner: string
  createdDate: string
}

export const columns: ColumnDef<Customer>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className=""
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className=""
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:underline"
        >
          Customer Name
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("type")}</div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("status")}</div>
    ),
  },
  {
    accessorKey: "openItems",
    header: "Open Items",
    cell: ({ row }) => (
      <div className="">{row.getValue("openItems")}</div>
    ),
  },
  {
    accessorKey: "outstanding",
    header: () => <div className="text-right">Outstanding</div>,
    cell: ({ row }) => {
      const outstanding = parseFloat(row.getValue("outstanding"))

      // Format the outstanding as a dollar amount
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(outstanding)

      return <div className="text-right font-medium">{formatted}</div>
    },
  },
  {
    accessorKey: "lastActivity",
    header: "Last Activity",
    cell: ({ row }) => (
      <div className="">{row.getValue("lastActivity")}</div>
    ),
  },
  {
    accessorKey: "owner",
    header: "Owner",
    cell: ({ row }) => (
      <div className="">{row.getValue("owner")}</div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const customer = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="">
            <DropdownMenuLabel inset className="">Actions</DropdownMenuLabel>
            <DropdownMenuItem
              inset className=""
              onClick={() => navigator.clipboard.writeText(customer.id)}
            >
              Copy customer ID
            </DropdownMenuItem>
            <DropdownMenuSeparator className="" />
            <DropdownMenuItem className='' inset> <Link href='/dashboard/customers/profile/01'>View</Link></DropdownMenuItem>
            <DropdownMenuItem className='' inset>Edit</DropdownMenuItem>
            <DropdownMenuItem className='' inset>Add activity</DropdownMenuItem>
            <DropdownMenuItem className='' inset>Create invoice / job</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

interface DataTableProps {
  data: Customer[]
  globalFilter: string
  statusFilter: string
  ownerFilter: string
  hasOutstanding: boolean
  createdDateFilter: string
}

export default function DataTable({
  data,
  globalFilter,
  statusFilter,
  ownerFilter,
  hasOutstanding,
  createdDateFilter,
}: DataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: () => {}, // Handled via props
    globalFilterFn: (row, columnId, filterValue) => {
      const searchableFields = ['name', 'email', 'phone', 'company'];
      return searchableFields.some(field =>
        row.getValue(field)?.toString().toLowerCase().includes(filterValue.toLowerCase())
      );
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
  })

  // Apply filters
  React.useEffect(() => {
    const filters: ColumnFiltersState = []
    if (statusFilter) {
      filters.push({ id: "status", value: statusFilter })
    }
    if (ownerFilter) {
      filters.push({ id: "owner", value: ownerFilter })
    }
    if (hasOutstanding) {
      filters.push({ id: "outstanding", value: (value: number) => value > 0 })
    }
    if (createdDateFilter) {
      filters.push({ id: "createdDate", value: createdDateFilter })
    }
    setColumnFilters(filters)
  }, [statusFilter, ownerFilter, hasOutstanding, createdDateFilter])

  return (
    <div className="w-full">
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            className=''
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            className=''
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}