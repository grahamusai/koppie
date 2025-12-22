import { ClientHeader } from "../../components/client-header"
import { ClientTabs } from "../../components/client-tabs"

export default function ClientProfilePage({ params }: { params: { id: string } }) {
  // In a real app, you'd fetch the client data based on params.id
  const client = {
    id: params.id,
    name: "Thabo Mbeki Construction",
    email: "thabo@mbekiconstruction.co.za",
    phone: "+27 82 555 1234",
    status: "active",
    type: "Business",
    totalInvoices: 18,
    outstandingBalance: 45230.5,
    activeJobs: 3,
    lastActivity: "2 hours ago",
  }

  return (
    <div className="min-h-screen bg-background">
      <ClientHeader client={client} />
      <ClientTabs clientId={client.id} />
    </div>
  )
}
