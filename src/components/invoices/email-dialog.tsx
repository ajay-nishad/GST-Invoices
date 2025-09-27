'use client'

import { useState } from 'react'
import { Mail, Send, X, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useToastEnhanced } from '@/hooks/use-toast-enhanced'

interface EmailDialogProps {
  isOpen: boolean
  onClose: () => void
  invoiceId: string
  invoiceNumber: string
  customerEmail?: string
  customerName?: string
  onEmailSent?: () => void
}

export function EmailDialog({
  isOpen,
  onClose,
  invoiceId,
  invoiceNumber,
  customerEmail,
  customerName,
  onEmailSent,
}: EmailDialogProps) {
  const [recipientEmail, setRecipientEmail] = useState(customerEmail || '')
  const [recipientName, setRecipientName] = useState(customerName || '')
  const [template, setTemplate] = useState('classic')
  const [customMessage, setCustomMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { success, error } = useToastEnhanced()

  const handleSendEmail = async () => {
    if (!recipientEmail.trim()) {
      error('Email Required', 'Please enter a recipient email address')
      return
    }

    if (!recipientEmail.includes('@')) {
      error('Invalid Email', 'Please enter a valid email address')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(`/api/invoices/${invoiceId}/email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipientEmail: recipientEmail.trim(),
          recipientName: recipientName.trim(),
          template,
          customMessage: customMessage.trim(),
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to send email')
      }

      success(
        'Invoice Sent Successfully',
        `Invoice ${invoiceNumber} has been sent to ${recipientEmail}`,
        {
          label: 'View Logs',
          onClick: () => {
            // TODO: Navigate to email logs or show logs
            console.log('View email logs')
          },
        }
      )

      onEmailSent?.()
      onClose()

      // Reset form
      setRecipientEmail(customerEmail || '')
      setRecipientName(customerName || '')
      setCustomMessage('')
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to send email'
      error('Failed to Send Email', errorMessage, {
        label: 'Retry',
        onClick: handleSendEmail,
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Send Invoice
              </CardTitle>
              <CardDescription>
                Send invoice {invoiceNumber} via email
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              disabled={isLoading}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="recipient-email">Recipient Email *</Label>
            <Input
              id="recipient-email"
              type="email"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              placeholder="customer@example.com"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="recipient-name">Recipient Name</Label>
            <Input
              id="recipient-name"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              placeholder="Customer Name"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="template">PDF Template</Label>
            <Select
              value={template}
              onValueChange={setTemplate}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="classic">Classic</SelectItem>
                <SelectItem value="minimal">Minimal</SelectItem>
                <SelectItem value="modern">Modern</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="custom-message">Custom Message (Optional)</Label>
            <Textarea
              id="custom-message"
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="Add a personal message to include in the email..."
              rows={3}
              disabled={isLoading}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSendEmail}
              disabled={isLoading || !recipientEmail.trim()}
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send Email
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
