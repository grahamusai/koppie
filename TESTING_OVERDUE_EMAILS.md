# Testing Overdue Email Functionality

## Quick Start

### Option 1: Run the Test Script (Recommended)

```bash
bun scripts/test-overdue-emails.ts
```

This script will:
1. Test database connection
2. Create a test customer
3. Create test invoices with different reminder scenarios
4. Send a test email via Resend
5. Verify data in the database
6. Clean up test data

**If you get a connection error:**
- Make sure your Turso database is accessible from your network
- Verify `DATABASE_URL` and `TURSO_AUTH_TOKEN` in `.env.local`
- Check that you're not behind a restrictive firewall

### Option 2: Manual Testing via cURL

1. **Start your dev server:**
   ```bash
   bun run dev
   ```

2. **Call the cron endpoint:**
   ```bash
   curl -H "Authorization: Bearer 7f3d8e9a2c1b4f6e8d9a3c5b7e1f4a6c8b2d9e3f5a7c1b4d6e8f9a2c3b5d7e1f" \
     http://localhost:3000/api/cron/check-overdue
   ```

   Expected response:
   ```json
   {
     "checked": 0,
     "remindersSent": 0
   }
   ```

3. **Check the response:**
   - `checked`: Number of invoices marked as overdue
   - `remindersSent`: Number of reminder emails sent

## What Was Fixed

### 1. Schema Updates
- Added `lastReminderSent` field to track when reminders were sent
- Added `reminderCount` field to track how many reminders have been sent
- Run migration: `bun run db:push`

### 2. Email Handling
- Fixed Date object handling in `lib/email.js`
- Now properly converts timestamps to Date objects

### 3. Cron Route
- Added missing `customers` and `reminderLog` imports
- Fetches customer email from the customers table
- Properly formats invoice data before sending email

## Testing Checklist

- [ ] Run the test script successfully
- [ ] Check your email inbox for test reminder
- [ ] Verify cron endpoint returns correct counts
- [ ] Check database for reminder_log entries
- [ ] Verify `lastReminderSent` and `reminderCount` are updated

## Troubleshooting

### Email not sending?
- Check `RESEND_API_KEY` in `.env.local`
- Verify the API key is valid at https://resend.com
- Check Resend dashboard for delivery status

### Cron endpoint returns 401?
- Verify `CRON_SECRET` in `.env.local`
- Make sure the Authorization header matches exactly

### No invoices found?
- Ensure you have invoices with `status: 'overdue'`
- Check that `dueDate` is in the past
- Verify `lastReminderSent` is null or older than 3 days

## Production Setup

For production, set up a scheduled cron job to call this endpoint:

- **Vercel Cron**: Use `vercel.json` (already configured)
- **External Service**: Use services like EasyCron or AWS EventBridge
- **Call frequency**: Recommended every 6-12 hours

Example with external cron service:
```
GET https://yourdomain.com/api/cron/check-overdue
Header: Authorization: Bearer YOUR_CRON_SECRET
```
