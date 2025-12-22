"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Upload, Download, Eye } from "lucide-react"
import { useState } from "react"

interface DocumentsTabProps {
  clientId: string
}

export function DocumentsTab({ clientId }: DocumentsTabProps) {
  const [uploading, setUploading] = useState(false)

  // Mock documents data
  const documents = [
    {
      id: 1,
      name: "Construction Contract - Phase 2.pdf",
      type: "Contract",
      uploadDate: "2024-12-01",
      size: "2.4 MB",
    },
    {
      id: 2,
      name: "Company Registration Certificate.pdf",
      type: "Legal",
      uploadDate: "2024-11-15",
      size: "856 KB",
    },
    {
      id: 3,
      name: "Tax Clearance Certificate.pdf",
      type: "Tax",
      uploadDate: "2024-11-10",
      size: "1.2 MB",
    },
    {
      id: 4,
      name: "Bank Details Form.pdf",
      type: "Banking",
      uploadDate: "2024-10-20",
      size: "324 KB",
    },
    {
      id: 5,
      name: "Proof of Payment - INV-2024-0015.pdf",
      type: "Payment",
      uploadDate: "2024-10-18",
      size: "158 KB",
    },
  ]

  const handleUpload = () => {
    setUploading(true)
    // Simulate upload
    setTimeout(() => {
      setUploading(false)
    }, 2000)
  }

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed border-border p-8 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
              <Upload className="h-6 w-6 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">Upload Documents</h3>
              <p className="text-sm text-muted-foreground">
                Store contracts, IDs, proof of payment, and application forms
              </p>
            </div>
            <Button onClick={handleUpload} disabled={uploading}>
              {uploading ? "Uploading..." : "Select Files"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Documents List */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Stored Documents</h2>

        <div className="grid gap-3">
          {documents.map((doc) => (
            <Card key={doc.id}>
              <CardContent className="py-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{doc.name}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{doc.type}</span>
                      <span>•</span>
                      <span>{doc.uploadDate}</span>
                      <span>•</span>
                      <span>{doc.size}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
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
