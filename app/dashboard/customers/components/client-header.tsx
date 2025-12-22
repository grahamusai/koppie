"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Phone, Mail, FileText, Briefcase, DollarSign } from "lucide-react"

interface Client {
  name: string
  email: string
  phone: string
  status: string
  type: string
}

interface ClientHeaderProps {
  client: Client
}

export function ClientHeader({ client }: ClientHeaderProps) {
  return (
    <div className="sticky top-0 z-10 border-b bg-card shadow-sm">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Client Info */}
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-primary/10 text-2xl font-semibold text-primary">
              {client.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-semibold tracking-tight text-balance">{client.name}</h1>
                <Badge variant={client.status === "active" ? "default" : "secondary"} className="capitalize">
                  {client.status}
                </Badge>
                <Badge variant="outline" className="capitalize">
                  {client.type}
                </Badge>
              </div>
              <div className="mt-2 flex flex-col gap-1 text-sm text-muted-foreground sm:flex-row sm:items-center sm:gap-4">
                <div className="flex items-center gap-1.5">
                  <Mail className="h-4 w-4" />
                  <span>{client.email}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone className="h-4 w-4" />
                  <span>{client.phone}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <Phone className="h-4 w-4" />
              Call
            </Button>
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <Mail className="h-4 w-4" />
              Email
            </Button>
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <FileText className="h-4 w-4" />
              Add Note
            </Button>
            <Button variant="default" size="sm" className="gap-2">
              <Briefcase className="h-4 w-4" />
              Create Job
            </Button>
            <Button variant="default" size="sm" className="gap-2">
              <DollarSign className="h-4 w-4" />
              New Invoice
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
