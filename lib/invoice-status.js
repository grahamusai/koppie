// lib/invoice-status.ts
export function getInvoiceStatus(invoice) {
  const now = new Date();
  
  if (invoice.status === 'paid') return 'paid';
  if (invoice.status === 'draft') return 'draft';
  
  if (invoice.dueDate < now) return 'overdue';
  if (invoice.status === 'sent') return 'due';
  
  return invoice.status;
}

// Update invoice status when viewing/loading
export async function updateInvoiceStatus(invoiceId) {
  const invoice = await db.select()
    .from(invoices)
    .where(eq(invoices.id, invoiceId))
    .limit(1);
    
  if (!invoice[0]) return;
  
  const currentStatus = getInvoiceStatus(invoice[0]);
  
  if (currentStatus !== invoice[0].status) {
    await db.update(invoices)
      .set({ status: currentStatus })
      .where(eq(invoices.id, invoiceId));
  }
}