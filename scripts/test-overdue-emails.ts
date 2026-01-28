import { db } from '@/db';
import { invoices, customers, reminderLog } from '@/db/schema';
import { sendReminderEmail } from '@/lib/email';
import { eq } from 'drizzle-orm';

/**
 * Test script to verify overdue email functionality
 * Run with: bun scripts/test-overdue-emails.ts
 * 
 * Note: This requires a working connection to your Turso database
 */

async function testOverdueEmails() {
  console.log('🧪 Starting overdue email test...\n');

  try {
    // Test database connection first
    console.log('1️⃣ Testing database connection...');
    try {
      const testQuery = await db.select().from(customers).limit(1);
      console.log('✅ Database connection successful\n');
    } catch (connError) {
      console.error('❌ Database connection failed:', connError);
      console.log('\n📋 Troubleshooting:');
      console.log('  - Check that DATABASE_URL is set correctly in .env.local');
      console.log('  - Check that TURSO_AUTH_TOKEN is set correctly in .env.local');
      console.log('  - Verify your Turso database is running and accessible');
      console.log('  - Check your network connection\n');
      process.exit(1);
    }

    // 1. Create a test customer
    console.log('2️⃣ Creating test customer...');
    const customerId = `test-customer-${Date.now()}`;
    
    await db.insert(customers).values({
      id: customerId,
      customerType: 'individual',
      firstName: 'Test',
      lastName: 'Customer',
      email: 'test@example.com',
      phone: '555-0123',
      addressLine1: '123 Test St',
      city: 'Test City',
      province: 'Test Province',
      postalCode: '12345',
      country: 'South Africa',
      status: 'active',
      createdBy: 'test-script',
    });
    console.log(`✅ Customer created: ${customerId}\n`);

    // 2. Create test invoices with different scenarios
    console.log('3️⃣ Creating test invoices...');
    
    const now = new Date();
    const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
    const fiveDaysAgo = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000);
    
    const invoiceIds = [];

    // Invoice 1: Overdue, never reminded
    const inv1Id = `test-invoice-1-${Date.now()}`;
    await db.insert(invoices).values({
      id: inv1Id,
      invoiceNumber: 'TEST-001',
      customerId,
      amount: 50000, // $500
      status: 'overdue',
      issueDate: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      dueDate: fiveDaysAgo,
      description: 'Test invoice - overdue, never reminded',
      createdBy: 'test-script',
    });
    invoiceIds.push(inv1Id);
    console.log(`  ✓ Invoice 1 (overdue, never reminded): ${inv1Id}`);

    // Invoice 2: Overdue, last reminder 5 days ago (should get reminder)
    const inv2Id = `test-invoice-2-${Date.now()}`;
    await db.insert(invoices).values({
      id: inv2Id,
      invoiceNumber: 'TEST-002',
      customerId,
      amount: 75000, // $750
      status: 'overdue',
      issueDate: new Date(now.getTime() - 45 * 24 * 60 * 60 * 1000).toISOString(),
      dueDate: fiveDaysAgo,
      description: 'Test invoice - overdue, last reminder 5 days ago',
      createdBy: 'test-script',
    });
    invoiceIds.push(inv2Id);
    console.log(`  ✓ Invoice 2 (overdue, last reminder 5 days ago): ${inv2Id}`);

    // Invoice 3: Overdue, last reminder 1 day ago (should NOT get reminder)
    const inv3Id = `test-invoice-3-${Date.now()}`;
    await db.insert(invoices).values({
      id: inv3Id,
      invoiceNumber: 'TEST-003',
      customerId,
      amount: 100000, // $1000
      status: 'overdue',
      issueDate: new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      dueDate: fiveDaysAgo,
      description: 'Test invoice - overdue, last reminder 1 day ago',
      createdBy: 'test-script',
    });
    invoiceIds.push(inv3Id);
    console.log(`  ✓ Invoice 3 (overdue, last reminder 1 day ago): ${inv3Id}\n`);

    // 3. Test email sending
    console.log('4️⃣ Testing email sending...');
    
    const testInvoice = {
      id: inv1Id,
      number: 'TEST-001',
      customerEmail: 'test@example.com',
      total: '$500.00',
      dueDate: fiveDaysAgo,
      reminderCount: 0,
    };

    try {
      console.log(`  Sending test email to: ${testInvoice.customerEmail}`);
      await sendReminderEmail(testInvoice);
      console.log(`  ✅ Email sent successfully!\n`);
    } catch (error) {
      console.error(`  ❌ Email sending failed:`, error);
      console.log(`  Make sure RESEND_API_KEY is valid in .env.local\n`);
    }

    // 4. Verify data in database
    console.log('5️⃣ Verifying test data in database...');
    const createdInvoices = await db.select()
      .from(invoices)
      .where(eq(invoices.customerId, customerId));
    
    console.log(`  ✓ Found ${createdInvoices.length} invoices for test customer`);
    createdInvoices.forEach((inv, idx) => {
      console.log(`    ${idx + 1}. ${inv.invoiceNumber} - Status: ${inv.status}, Amount: ${inv.amount}`);
    });
    console.log();

    // 5. Cleanup
    console.log('6️⃣ Cleaning up test data...');
    await db.delete(invoices).where(eq(invoices.customerId, customerId));
    await db.delete(customers).where(eq(customers.id, customerId));
    console.log('  ✅ Test data cleaned up\n');

    console.log('✨ Test completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('  1. Check your email inbox for the test reminder');
    console.log('  2. Verify the cron endpoint: GET /api/cron/check-overdue');
    console.log('  3. Test with: curl -H "Authorization: Bearer YOUR_CRON_SECRET" http://localhost:3000/api/cron/check-overdue');

  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

testOverdueEmails();
