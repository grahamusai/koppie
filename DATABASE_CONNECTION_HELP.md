# Database Connection Troubleshooting

Your Turso database connection is being refused. This is a network connectivity issue.

## Quick Diagnosis

Run this to test connectivity:
```bash
bun run db:studio
```

If this fails with `ECONNREFUSED`, your machine cannot reach the Turso server.

## Solutions

### Option 1: Check Your Network (Most Common)

1. **Are you on a corporate/restricted network?**
   - Try connecting from a different network (mobile hotspot, home WiFi)
   - Ask your IT department if they're blocking outbound connections to `3.133.248.140:5432`

2. **Is your VPN blocking it?**
   - Try disconnecting your VPN
   - Some VPNs block database connections

3. **Is your firewall blocking it?**
   - Check Windows Firewall settings
   - Try temporarily disabling it to test

### Option 2: Verify Your Credentials

Check `.env.local` has these values:
```
DATABASE_URL=libsql://koppie-grahamusai.aws-us-east-2.turso.io
TURSO_AUTH_TOKEN=eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9...
```

If they're missing or incorrect:
1. Go to https://app.turso.io
2. Find your database
3. Click "Copy connection string" and update `DATABASE_URL`
4. Generate a new auth token if needed

### Option 3: Test Email Sending Without Database

While you fix the database connection, you can still test the email functionality:

```bash
bun scripts/test-email-only.ts
```

This tests that your Resend API key works and emails can be sent.

## For Production

Once you get the connection working locally, the cron endpoint will work in production because:
- Vercel servers have unrestricted outbound connections
- The cron job will run on Vercel's infrastructure, not your local machine

## Still Having Issues?

1. Check Turso status: https://status.turso.io
2. Check your Turso database is running: https://app.turso.io
3. Try creating a new auth token in the Turso dashboard
4. Contact Turso support if the database is down
