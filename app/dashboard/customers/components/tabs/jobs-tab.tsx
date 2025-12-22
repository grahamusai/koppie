import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"

interface JobsTabProps {
  clientId: string
}

export function JobsTab({ clientId }: JobsTabProps) {
  // Mock jobs data
  const jobs = [
    {
      id: 1,
      title: "Office Renovation - Phase 2",
      status: "in-progress",
      value: 85000,
      startDate: "2024-12-01",
      endDate: "2025-02-28",
    },
    {
      id: 2,
      title: "Kitchen Remodel",
      status: "in-progress",
      value: 45000,
      startDate: "2024-11-15",
      endDate: "2025-01-15",
    },
    {
      id: 3,
      title: "Bathroom Upgrade",
      status: "completed",
      value: 28000,
      startDate: "2024-10-01",
      endDate: "2024-11-30",
    },
    {
      id: 4,
      title: "Exterior Painting",
      status: "pending",
      value: 15000,
      startDate: "2025-01-15",
      endDate: "2025-02-15",
    },
    {
      id: 5,
      title: "Roof Repair",
      status: "completed",
      value: 32000,
      startDate: "2024-09-01",
      endDate: "2024-09-30",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "in-progress":
        return "default"
      case "completed":
        return "secondary"
      case "pending":
        return "outline"
      default:
        return "outline"
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Jobs & Projects</h2>
        <Button>Create New Job</Button>
      </div>

      <div className="grid gap-4">
        {jobs.map((job) => (
          <Card key={job.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-base">{job.title}</CardTitle>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{job.startDate}</span>
                    <span>→</span>
                    <span>{job.endDate}</span>
                  </div>
                </div>
                <Badge variant={getStatusColor(job.status)} className="capitalize">
                  {job.status.replace("-", " ")}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Value</p>
                  <p className="text-lg font-semibold">R {job.value.toLocaleString("en-ZA")}</p>
                </div>
                <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                  Open
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
