import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, FileText, Briefcase, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface OverviewTabProps {
  clientId: string
}

export function OverviewTab({ clientId }: OverviewTabProps) {
  // Mock data - in real app, fetch based on clientId
  const stats = {
    totalInvoices: 18,
    outstandingBalance: 45230.5,
    activeJobs: 3,
    lastActivity: "2 hours ago",
  }

  const recentNotes = [
    { id: 1, content: "Follow up on quote for office renovation", date: "2024-12-18", author: "John Smith" },
    {
      id: 2,
      content: "Client requested payment plan for outstanding balance",
      date: "2024-12-15",
      author: "Sarah Jones",
    },
    {
      id: 3,
      content: "Site visit completed, client satisfied with progress",
      date: "2024-12-10",
      author: "Mike Brown",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Invoices</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalInvoices}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Outstanding Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              R {stats.outstandingBalance.toLocaleString("en-ZA", { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Jobs</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">{stats.activeJobs}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Last Activity</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.lastActivity}</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentNotes.map((note) => (
              <div key={note.id} className="flex flex-col gap-2 border-b pb-4 last:border-b-0 last:pb-0">
                <p className="text-sm leading-relaxed">{note.content}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{note.author}</span>
                  <span>•</span>
                  <span>{note.date}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Customer Health */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Health</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Payment History</span>
              <Badge variant="default">Good</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Response Time</span>
              <Badge variant="default">Fast</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Overall Status</span>
              <Badge className="bg-accent text-accent-foreground">Healthy</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
