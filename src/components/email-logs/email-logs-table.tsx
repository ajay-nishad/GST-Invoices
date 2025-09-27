'use client'

import { useState } from 'react'
import {
  Mail,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  RotateCcw,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useToastEnhanced } from '@/hooks/use-toast-enhanced'

interface EmailLog {
  id: string
  recipient_email: string
  recipient_name: string
  subject: string
  email_type: string
  status: 'pending' | 'sent' | 'failed' | 'delivered' | 'bounced'
  error_message?: string
  sent_at?: string
  delivered_at?: string
  retry_count: number
  max_retries: number
  created_at: string
  invoices: {
    invoice_number: string
    total_amount: number
  }
}

interface EmailLogsTableProps {
  emailLogs: EmailLog[]
}

export function EmailLogsTable({ emailLogs }: EmailLogsTableProps) {
  const [retryingIds, setRetryingIds] = useState<Set<string>>(new Set())
  const { success, error } = useToastEnhanced()

  const getStatusIcon = (status: EmailLog['status']) => {
    switch (status) {
      case 'sent':
      case 'delivered':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'failed':
      case 'bounced':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: EmailLog['status']) => {
    const variants = {
      sent: 'default',
      delivered: 'default',
      failed: 'destructive',
      bounced: 'destructive',
      pending: 'secondary',
    } as const

    return (
      <Badge variant={variants[status] || 'secondary'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const handleRetry = async (logId: string) => {
    setRetryingIds((prev) => new Set(prev).add(logId))

    try {
      const response = await fetch(`/api/invoices/email/retry`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ logId }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to retry email')
      }

      success('Email Retry Initiated', 'The email will be retried shortly')

      // Refresh the page to show updated status
      window.location.reload()
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to retry email'
      error('Retry Failed', errorMessage)
    } finally {
      setRetryingIds((prev) => {
        const newSet = new Set(prev)
        newSet.delete(logId)
        return newSet
      })
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount)
  }

  if (emailLogs.length === 0) {
    return (
      <div className="text-center py-8">
        <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No emails sent yet
        </h3>
        <p className="text-gray-500">
          Start by sending your first invoice via email
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice</TableHead>
            <TableHead>Recipient</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Sent At</TableHead>
            <TableHead>Retries</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {emailLogs.map((log) => (
            <TableRow key={log.id}>
              <TableCell>
                <div>
                  <div className="font-medium">
                    {log.invoices.invoice_number}
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatAmount(log.invoices.total_amount)}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <div className="font-medium">
                    {log.recipient_name || 'N/A'}
                  </div>
                  <div className="text-sm text-gray-500">
                    {log.recipient_email}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="max-w-xs truncate" title={log.subject}>
                  {log.subject}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {getStatusIcon(log.status)}
                  {getStatusBadge(log.status)}
                </div>
                {log.error_message && (
                  <div
                    className="text-xs text-red-600 mt-1 max-w-xs truncate"
                    title={log.error_message}
                  >
                    {log.error_message}
                  </div>
                )}
              </TableCell>
              <TableCell>
                {log.sent_at ? (
                  <div>
                    <div>{formatDate(log.sent_at)}</div>
                    {log.delivered_at && (
                      <div className="text-xs text-green-600">
                        Delivered: {formatDate(log.delivered_at)}
                      </div>
                    )}
                  </div>
                ) : (
                  <span className="text-gray-400">Not sent</span>
                )}
              </TableCell>
              <TableCell>
                <div className="text-center">
                  {log.retry_count}/{log.max_retries}
                </div>
              </TableCell>
              <TableCell>
                {log.status === 'failed' &&
                  log.retry_count < log.max_retries && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRetry(log.id)}
                      disabled={retryingIds.has(log.id)}
                    >
                      {retryingIds.has(log.id) ? (
                        <RotateCcw className="h-3 w-3 animate-spin" />
                      ) : (
                        <RotateCcw className="h-3 w-3" />
                      )}
                      <span className="ml-1">Retry</span>
                    </Button>
                  )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
