"use client"

import type React from "react"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { createCustomer } from "../actions"
import { useRouter } from "next/navigation"

type CustomerType = "individual" | "business"
type CustomerStatus = "active" | "inactive" | "suspended"

export default function NewCustomerPage() {
    const [customerType, setCustomerType] = useState<CustomerType>("individual")
    const [status, setStatus] = useState<CustomerStatus>("active")
    const [isPending, startTransition] = useTransition()
    const router = useRouter()


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const data = {
            customerType,
            firstName: formData.get("firstName") as string,
            lastName: formData.get("lastName") as string,
            businessName: formData.get("businessName") as string,
            email: formData.get("email") as string,
            phone: formData.get("phone") as string,
            addressLine1: formData.get("addressLine1") as string,
            addressLine2: formData.get("addressLine2") as string,
            city: formData.get("city") as string,
            province: formData.get("province") as string,
            postalCode: formData.get("postalCode") as string,
            country: formData.get("country") as string || "South Africa",
            idNumber: formData.get("idNumber") as string,
            registrationNumber: formData.get("registrationNumber") as string,
            vatNumber: formData.get("vatNumber") as string,
            taxNumber: formData.get("taxNumber") as string,
            status,
            notes: formData.get("notes") as string,
        };

        startTransition(async () => {
            const result = await createCustomer(data)
            if (result.success) {
                router.push('/dashboard/customers')
            } else {
                alert('Failed to create customer. Please try again.')
            }
        })
    }

    return (
        <div className="min-h-screen bg-transparent">
            <div className="w-full py-8 px-10 md:py-12">
                <div className="mb-8">
                    <Link
                        href="/customers"
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Customers
                    </Link>
                    <h1 className="text-3xl md:text-4xl font-bold text-foreground text-balance">Add New Customer</h1>
                    <p className="text-muted-foreground mt-2">Create a comprehensive customer profile for your CRM</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-8">
                        {/* Customer Type Section */}
                        <Card className="p-6">
                            <div className="space-y-4">
                                <div className="pb-4 border-b border-border">
                                    <h2 className="text-xl font-semibold text-foreground">Customer Type</h2>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Select whether this is an individual or business customer
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label className='' htmlFor="customerType">Type *</Label>
                                    <Select value={customerType} onValueChange={(value) => setCustomerType(value as CustomerType)}>
                                        <SelectTrigger className='' id="customerType">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className=''>
                                            <SelectItem className='' value="individual">Individual</SelectItem>
                                            <SelectItem className='' value="business">Business</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </Card>

                        {/* Personal/Business Information */}
                        <Card className="p-6">
                            <div className="space-y-4">
                                <div className="pb-4 border-b border-border">
                                    <h2 className="text-xl font-semibold text-foreground">
                                        {customerType === "individual" ? "Personal Information" : "Business Information"}
                                    </h2>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        {customerType === "individual"
                                            ? "Enter the customer's personal details"
                                            : "Enter the business details"}
                                    </p>
                                </div>

                                {customerType === "individual" ? (
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label className='' htmlFor="firstName">First Name</Label>
                                            <Input className='' type='text' id="firstName" name="firstName" placeholder="John" maxLength={100} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className='' htmlFor="lastName">Last Name</Label>
                                            <Input className='' type='text' id="lastName" name="lastName" placeholder="Doe" maxLength={100} />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <Label className='' htmlFor="businessName">Business Name</Label>
                                        <Input className='' type='text' id="businessName" name="businessName" placeholder="Acme Corporation" maxLength={255} />
                                    </div>
                                )}
                            </div>
                        </Card>

                        {/* Contact Information */}
                        <Card className="p-6">
                            <div className="space-y-4">
                                <div className="pb-4 border-b border-border">
                                    <h2 className="text-xl font-semibold text-foreground">Contact Information</h2>
                                    <p className="text-sm text-muted-foreground mt-1">How can we reach this customer?</p>
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label className='' htmlFor="email">Email Address *</Label>
                                        <Input
                                            className=''
                                            id="email"
                                            name="email"
                                            type="email"
                                            placeholder="john@example.com"
                                            required
                                            maxLength={255}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className='' htmlFor="phone">Phone Number</Label>
                                        <Input className='' type='tel' id="phone" name="phone" placeholder="+27 12 345 6789" maxLength={50} />
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Address Information */}
                        <Card className="p-6">
                            <div className="space-y-4">
                                <div className="pb-4 border-b border-border">
                                    <h2 className="text-xl font-semibold text-foreground">Address</h2>
                                    <p className="text-sm text-muted-foreground mt-1">Physical address details</p>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label className='' htmlFor="addressLine1">Address Line 1</Label>
                                        <Input className='' type='text' id="addressLine1" name="addressLine1" placeholder="123 Main Street" maxLength={255} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className='' htmlFor="addressLine2">Address Line 2</Label>
                                        <Input className='' type='text' id="addressLine2" name="addressLine2" placeholder="Apt 4B" maxLength={255} />
                                    </div>
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label className='' htmlFor="city">City</Label>
                                            <Input className='' type='text' id="city" name="city" placeholder="Cape Town" maxLength={100} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className='' htmlFor="province">Province</Label>
                                            <Input className='' type='text' id="province" name="province" placeholder="Western Cape" maxLength={100} />
                                        </div>
                                    </div>
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label className='' htmlFor="postalCode">Postal Code</Label>
                                            <Input className='' type='text' id="postalCode" name="postalCode" placeholder="8001" maxLength={20} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className='' htmlFor="country">Country</Label>
                                            <Input className='' type='text' id="country" name="country" defaultValue="South Africa" maxLength={100} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* South African Specific Information */}
                        <Card className="p-6">
                            <div className="space-y-4">
                                <div className="pb-4 border-b border-border">
                                    <h2 className="text-xl font-semibold text-foreground">South African Details</h2>
                                    <p className="text-sm text-muted-foreground mt-1">Tax and registration information</p>
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                    {customerType === "individual" && (
                                        <div className="space-y-2">
                                            <Label className='' htmlFor="idNumber">ID Number</Label>
                                            <Input className='' type='text' id="idNumber" name="idNumber" placeholder="0000000000000" maxLength={20} />
                                        </div>
                                    )}
                                    {customerType === "business" && (
                                        <div className="space-y-2">
                                            <Label className='' htmlFor="registrationNumber">Registration Number</Label>
                                            <Input
                                                className=''
                                                type='text'
                                                id="registrationNumber"
                                                name="registrationNumber"
                                                placeholder="2021/123456/07"
                                                maxLength={50}
                                            />
                                        </div>
                                    )}
                                    <div className="space-y-2">
                                        <Label className='' htmlFor="vatNumber">VAT Number</Label>
                                        <Input className='' type='text' id="vatNumber" name="vatNumber" placeholder="4123456789" maxLength={20} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className='' htmlFor="taxNumber">Tax Number</Label>
                                        <Input className='' type='text' id="taxNumber" name="taxNumber" placeholder="0123456789" maxLength={20} />
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Status and Notes */}
                        <Card className="p-6">
                            <div className="space-y-4">
                                <div className="pb-4 border-b border-border">
                                    <h2 className="text-xl font-semibold text-foreground">Additional Information</h2>
                                    <p className="text-sm text-muted-foreground mt-1">Status and internal notes</p>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label className='' htmlFor="status">Status *</Label>
                                        <Select value={status} onValueChange={(value) => setStatus(value as CustomerStatus)}>
                                            <SelectTrigger className='' id="status">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className=''>
                                                <SelectItem className='' value="active">Active</SelectItem>
                                                <SelectItem className='' value="inactive">Inactive</SelectItem>
                                                <SelectItem className='' value="suspended">Suspended</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className='' htmlFor="notes">Notes</Label>
                                        <Textarea
                                            className=''
                                            id="notes"
                                            name="notes"
                                            placeholder="Add any additional notes about this customer..."
                                            rows={4}
                                        />
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Form Actions */}
                        <div className="flex flex-col sm:flex-row gap-3 justify-end pt-4">
                            <Button type="button" variant="outline" size="lg" asChild className="sm:order-1 bg-transparent">
                                <Link href="/customers">Cancel</Link>
                            </Button>
                            <Button type="submit" size="lg" disabled={isPending} className="sm:order-2">
                                {isPending ? "Creating Customer..." : "Create Customer"}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}
