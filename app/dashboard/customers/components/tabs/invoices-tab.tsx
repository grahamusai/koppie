import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download, Send } from "lucide-react"

interface InvoicesTabProps {
  clientId: string
}

export function InvoicesTab({ clientId }: InvoicesTabProps) {
  // Mock invoices data
  const invoices = [
    {
      id: "INV-2024-0018",
      date: "2024-12-15",
      amount: 15230.5,
      status: "paid",
      paymentMethod: "EFT",
      paidDate: "2024-12-18",
    },
    {
      id: "INV-2024-0017",
      date: "2024-12-01",
      amount: 22000.0,
      status: "unpaid",
      paymentMethod: null,
      paidDate: null,
    },
    {
      id: "INV-2024-0016",
      date: "2024-11-15",
      amount: 18000.0,
      status: "paid",
      paymentMethod: "PayFast",
      paidDate: "2024-11-20",
    },
    {
      id: "INV-2024-0015",
      date: "2024-11-01",
      amount: 8000.0,
      status: "overdue",
      paymentMethod: null,
      paidDate: null,
    },
    {
      id: "INV-2024-0014",
      date: "2024-10-15",
      amount: 32000.0,
      status: "paid",
      paymentMethod: "EFT",
      paidDate: "2024-10-18",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "default"
      case "unpaid":
        return "secondary"
      case "overdue":
        return "destructive"
      default:
        return "outline"
    }
  }

  const summary = {
    total: invoices.reduce((sum, inv) => sum + inv.amount, 0),
    paid: invoices.filter((inv) => inv.status === "paid").reduce((sum, inv) => sum + inv.amount, 0),
    outstanding: invoices.filter((inv) => inv.status !== "paid").reduce((sum, inv) => sum + inv.amount, 0),
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Invoiced</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R {summary.total.toLocaleString("en-ZA", { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Paid</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">
              R {summary.paid.toLocaleString("en-ZA", { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Outstanding</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              R {summary.outstanding.toLocaleString("en-ZA", { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Invoices List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Invoice History</h2>
          <Button>Create Invoice</Button>
        </div>

        <div className="grid gap-4">
          {invoices.map((invoice) => (
            <Card key={invoice.id}>
              <CardContent className="pt-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-mono font-semibold">{invoice.id}</span>
                      <Badge variant={getStatusColor(invoice.status)} className="capitalize">
                        {invoice.status}
                      </Badge>
                      {invoice.paymentMethod && <Badge variant="outline">{invoice.paymentMethod}</Badge>}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>Issued: {invoice.date}</span>
                      {invoice.paidDate && (
                        <>
                          <span>•</span>
                          <span>Paid: {invoice.paidDate}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Amount</p>
                      <p className="text-xl font-bold">
                        R {invoice.amount.toLocaleString("en-ZA", { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                        <Download className="h-4 w-4" />
                        Download
                      </Button>
                      {invoice.status === "unpaid" || invoice.status === "overdue" ? (
                        <Button variant="default" size="sm" className="gap-2">
                          <Send className="h-4 w-4" />
                          Send Reminder
                        </Button>
                      ) : null}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
