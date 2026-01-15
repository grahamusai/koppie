"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Phone, Mail, FileText, DollarSign, Briefcase, MessageSquare } from "lucide-react"
import { useState } from "react"

interface ActivityTabProps {
  clientId: string
}

export function ActivityTab({ clientId }: ActivityTabProps) {
  const [note, setNote] = useState("")

  // Mock activity data
  const activities = [
    {
      id: 1,
      type: "note",
      title: "Note added",
      description: "Follow up on quote for office renovation",
      user: "John Smith",
      date: "2024-12-18 14:30",
    },
    {
      id: 2,
      type: "call",
      title: "Phone call",
      description: "Discussed payment schedule",
      user: "Sarah Jones",
      date: "2024-12-18 10:15",
    },
    {
      id: 3,
      type: "email",
      title: "Email sent",
      description: "Invoice #1234 sent to client",
      user: "System",
      date: "2024-12-17 16:45",
    },
    {
      id: 4,
      type: "payment",
      title: "Payment received",
      description: "R 15,000.00 via EFT",
      user: "System",
      date: "2024-12-15 09:20",
    },
    {
      id: 5,
      type: "job",
      title: "Job created",
      description: "Office Renovation - Phase 2",
      user: "Mike Brown",
      date: "2024-12-14 11:00",
    },
    {
      id: 6,
      type: "status",
      title: "Status changed",
      description: "Changed from Lead to Active Customer",
      user: "Sarah Jones",
      date: "2024-12-10 13:45",
    },
  ]

  const getIcon = (type: string) => {
    switch (type) {
      case "note":
        return <MessageSquare className="h-4 w-4" />
      case "call":
        return <Phone className="h-4 w-4" />
      case "email":
        return <Mail className="h-4 w-4" />
      case "payment":
        return <DollarSign className="h-4 w-4" />
      case "job":
        return <Briefcase className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const handleAddNote = () => {
    // In real app, save note to database
    console.log("Adding note:", note)
    setNote("")
  }

  return (
    <div className="space-y-6">
      {/* Add Note Section */}
      <Card className="">
        <CardHeader className="">
          <CardTitle>Add Note</CardTitle>
        </CardHeader>
        <CardContent className="">
          <div className="space-y-4">
            <Textarea
              placeholder="Write a note about this client..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
            />
            <Button onClick={handleAddNote} disabled={!note.trim()}>
              Add Note
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card className="">
        <CardHeader className="">
          <CardTitle>Activity Timeline</CardTitle>
        </CardHeader>
        <CardContent className="">
          <div className="relative space-y-4 pl-6">
            {/* Timeline line */}
            <div className="absolute left-2 top-2 bottom-2 w-px bg-border" />

            {activities.map((activity) => (
              <div key={activity.id} className="relative">
                {/* Timeline dot */}
                <div className="absolute -left-6 flex h-4 w-4 items-center justify-center rounded-full border-2 border-primary bg-card">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                </div>

                <div className="flex flex-col gap-1 pb-4">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted text-muted-foreground">
                      {getIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{activity.title}</p>
                      <p className="text-sm text-muted-foreground line-clamp-1">{activity.description}</p>
                    </div>
                  </div>
                  <div className="ml-10 flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{activity.user}</span>
                    <span>•</span>
                    <span>{activity.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
