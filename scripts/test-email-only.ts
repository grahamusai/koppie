import { sendReminderEmail } from '@/lib/email';

/**
 * Test script to verify email sending without database connection
 * Run with: bun scripts/test-email-only.ts
 */

async function testEmailOnly() {
  console.log('🧪 Testing email sending (no database required)...\n');

  try {
    // Create a mock invoice object
    const mockInvoice = {
      id: 'test-invoice-123',
      number: 'INV-2025-001',
      customerEmail: 'test@example.com',
      total: '$1,500.00',
      dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      reminderCount: 1,
    };

    console.log('📧 Sending test email with the following data:');
    console.log(`  Invoice #: ${mockInvoice.number}`);
    console.log(`  To: ${mockInvoice.customerEmail}`);
    console.log(`  Amount: ${mockInvoice.total}`);
    console.log(`  Due Date: ${mockInvoice.dueDate.toLocaleDateString()}`);
    console.log(`  Days Overdue: ${Math.floor((Date.now() - mockInvoice.dueDate.getTime()) / (1000 * 60 * 60 * 24))}`);
    console.log();

    await sendReminderEmail(mockInvoice);
    
    console.log('✅ Email sent successfully!\n');
    console.log('📋 Next steps:');
    console.log('  1. Check your email inbox (test@example.com) for the reminder');
    console.log('  2. Check Resend dashboard at https://resend.com for delivery status');
    console.log('  3. Verify RESEND_API_KEY in .env.local is correct if email doesn\'t arrive\n');

  } catch (error) {
    console.error('❌ Email sending failed:', error);
    console.log('\n🔧 Troubleshooting:');
    console.log('  - Verify RESEND_API_KEY is set in .env.local');
    console.log('  - Check that the API key is valid at https://resend.com');
    console.log('  - Verify NEXT_PUBLIC_APP_URL is set in .env.local');
    console.log('  - Check Resend dashboard for any errors\n');
    process.exit(1);
  }
}

testEmailOnly();
