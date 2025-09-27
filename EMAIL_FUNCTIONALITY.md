# Email Functionality for GST Invoices

This document describes the email functionality implemented for sending invoice PDFs via email.

## Features

### 1. Send Invoice via Email

- **Location**: Invoice form with "Email Invoice" button
- **Functionality**:
  - Generate PDF server-side using existing templates (Classic, Minimal, Modern)
  - Send email with PDF attachment using Resend
  - Custom message support
  - Email template selection

### 2. Email Logging

- **Database Table**: `email_logs`
- **Tracks**:
  - Recipient information
  - Email status (pending, sent, failed, delivered, bounced)
  - Retry attempts
  - Error messages
  - Timestamps

### 3. Email Logs Management

- **Page**: `/email-logs`
- **Features**:
  - View all sent emails
  - Retry failed emails
  - Status tracking
  - Error message display

## API Endpoints

### POST `/api/invoices/[id]/email`

Send an invoice via email.

**Request Body**:

```json
{
  "recipientEmail": "customer@example.com",
  "recipientName": "Customer Name",
  "template": "classic",
  "customMessage": "Optional custom message"
}
```

**Response**:

```json
{
  "success": true,
  "message": "Invoice sent successfully",
  "emailId": "resend-email-id",
  "logId": "email-log-id"
}
```

### PUT `/api/invoices/email/retry`

Retry a failed email.

**Request Body**:

```json
{
  "logId": "email-log-id"
}
```

## Environment Variables

Add to your `.env.local`:

```bash
RESEND_API_KEY=your_resend_api_key
```

## Database Migration

Run the email logs migration:

```sql
-- See supabase/migrations/007_email_logs.sql
```

## Components

### EmailDialog

- Modal dialog for sending emails
- Form validation
- Template selection
- Custom message support

### EmailLogsTable

- Display email history
- Retry functionality
- Status indicators
- Error message display

### ToastProvider

- Enhanced toast notifications
- Success/error feedback
- Action buttons (retry, view logs)

## Usage

1. **Send Invoice**:
   - Open any saved invoice
   - Click "Email Invoice" button
   - Fill in recipient details
   - Select template and add custom message
   - Click "Send Email"

2. **View Email Logs**:
   - Navigate to "Email Logs" in sidebar
   - View all sent emails
   - Retry failed emails if needed

3. **Retry Failed Emails**:
   - Go to Email Logs page
   - Find failed emails
   - Click "Retry" button

## Error Handling

- Email sending failures are logged with error messages
- Automatic retry mechanism (up to 3 attempts)
- User-friendly error messages via toast notifications
- Database logging for audit trail

## Future Enhancements

- Email templates customization
- Bulk email sending
- Email scheduling
- Delivery status webhooks
- Email analytics
- Custom SMTP configuration
