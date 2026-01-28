import {eq, and, lte, isNull, or } from 'drizzle-orm';
import { db } from '@/db';
import { invoices, customers, reminderLog } from '@/db/schema';
import {sendReminderEmail} from '@/lib/email';


export async function GET(request) {
  // Verify cron secret to prevent unauthorized access
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  const now = new Date();
  
  // Find overdue invoices
  const overdueInvoices = await db.select()
    .from(invoices)
    .where(
      and(
        lte(invoices.dueDate, now),
        eq(invoices.status, 'sent'), // or 'due'
      )
    );

  // Update status to overdue
  for (const invoice of overdueInvoices) {
    await db.update(invoices)
      .set({ status: 'overdue' })
      .where(eq(invoices.id, invoice.id));
  }

  // Find invoices needing reminders (overdue + no reminder in last 3 days)
  const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
  
  const needsReminder = await db.select()
    .from(invoices)
    .where(
      and(
        eq(invoices.status, 'overdue'),
        or(
          isNull(invoices.lastReminderSent),
          lte(invoices.lastReminderSent, threeDaysAgo)
        )
      )
    );

  // Send reminders
  for (const invoice of needsReminder) {
    try {
      // Fetch customer email
      const customer = await db.select()
        .from(customers)
        .where(eq(customers.id, invoice.customerId))
        .limit(1);
      
      if (!customer[0]) {
        console.warn(`No customer found for invoice ${invoice.id}`);
        continue;
      }

      // Format invoice data for email
      const invoiceForEmail = {
        id: invoice.id,
        number: invoice.invoiceNumber,
        customerEmail: customer[0].email,
        total: `$${(invoice.amount / 100).toFixed(2)}`,
        dueDate: invoice.dueDate,
        reminderCount: invoice.reminderCount || 0,
      };

      await sendReminderEmail(invoiceForEmail);
      
      await db.update(invoices)
        .set({
          lastReminderSent: now,
          reminderCount: (invoice.reminderCount || 0) + 1
        })
        .where(eq(invoices.id, invoice.id));

      // Log the reminder
      await db.insert(reminderLog).values({
        invoiceId: invoice.id,
        sentAt: now,
        reminderType: `reminder_${(invoice.reminderCount || 0) + 1}`
      });
      
    } catch (error) {
      console.error(`Failed to send reminder for invoice ${invoice.id}:`, error);
    }
  }

  return Response.json({ 
    checked: overdueInvoices.length,
    remindersSent: needsReminder.length 
  });
}