// lib/email.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendReminderEmail(invoice) {
  const dueDate = invoice.dueDate instanceof Date ? invoice.dueDate : new Date(invoice.dueDate);
  
  await resend.emails.send({
    from: 'invoices@yourdomain.com',
    to: invoice.customerEmail,
    subject: `Payment Reminder: Invoice #${invoice.number} is overdue`,
    html: `
      <h2>Payment Reminder</h2>
      <p>This is a friendly reminder that Invoice #${invoice.number} is now overdue.</p>
      <p><strong>Amount Due:</strong> ${invoice.total}</p>
      <p><strong>Due Date:</strong> ${dueDate.toLocaleDateString()}</p>
      <p><strong>Days Overdue:</strong> ${getDaysOverdue(dueDate)}</p>
      <p>Please submit payment at your earliest convenience.</p>
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/invoices/${invoice.id}">
        View Invoice
      </a>
    `
  });
}

function getDaysOverdue(dueDate) {
  return Math.floor((Date.now() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
}
