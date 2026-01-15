"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { OverviewTab } from "./tabs/overview-tab"
import { ActivityTab } from "./tabs/activity-tab"
import { JobsTab } from "./tabs/jobs-tab"
import { InvoicesTab } from "./tabs/invoices-tab"
import { DocumentsTab } from "./tabs/documents-tab"

interface ClientTabsProps {
  clientId: string
}

export function ClientTabs({ clientId }: ClientTabsProps) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="border-1 border-gray-500 grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
          <TabsTrigger   value="overview">Overview</TabsTrigger>
          <TabsTrigger   value="activity">Activity</TabsTrigger>
          <TabsTrigger   value="jobs">Jobs</TabsTrigger>
          <TabsTrigger   value="invoices">Invoices</TabsTrigger>
          <TabsTrigger   value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <OverviewTab clientId={clientId} />
        </TabsContent>

        <TabsContent value="activity" className="mt-6">
          <ActivityTab clientId={clientId} />
        </TabsContent>

        <TabsContent value="jobs" className="mt-6">
          <JobsTab clientId={clientId} />
        </TabsContent>

        <TabsContent value="invoices" className="mt-6">
          <InvoicesTab clientId={clientId} />
        </TabsContent>

        <TabsContent value="documents" className="mt-6">
          <DocumentsTab clientId={clientId} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
