'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { InvoiceCalculations } from '@/lib/schemas/invoice'
import { IndianRupee, Calculator } from 'lucide-react'

interface InvoiceTotalsProps {
  calculations: InvoiceCalculations
}

export function InvoiceTotals({ calculations }: InvoiceTotalsProps) {
  const {
    subtotal,
    totalDiscount,
    totalTax,
    cgstAmount,
    sgstAmount,
    igstAmount,
    roundOff,
    totalAmount,
  } = calculations

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calculator className="h-5 w-5 mr-2" />
          Invoice Totals
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal:</span>
            <span className="font-medium">
              <IndianRupee className="inline h-3 w-3 mr-1" />
              {subtotal.toLocaleString()}
            </span>
          </div>

          {totalDiscount > 0 && (
            <div className="flex justify-between text-red-600">
              <span>Discount:</span>
              <span className="font-medium">
                -<IndianRupee className="inline h-3 w-3 mr-1" />
                {totalDiscount.toLocaleString()}
              </span>
            </div>
          )}

          <div className="flex justify-between">
            <span className="text-gray-600">Taxable Amount:</span>
            <span className="font-medium">
              <IndianRupee className="inline h-3 w-3 mr-1" />
              {(subtotal - totalDiscount).toLocaleString()}
            </span>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <h4 className="font-medium text-gray-900">GST Breakdown</h4>

          {cgstAmount > 0 && sgstAmount > 0 ? (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">CGST (9%):</span>
                <span className="font-medium">
                  <IndianRupee className="inline h-3 w-3 mr-1" />
                  {cgstAmount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">SGST (9%):</span>
                <span className="font-medium">
                  <IndianRupee className="inline h-3 w-3 mr-1" />
                  {sgstAmount.toLocaleString()}
                </span>
              </div>
            </div>
          ) : igstAmount > 0 ? (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">IGST (18%):</span>
              <span className="font-medium">
                <IndianRupee className="inline h-3 w-3 mr-1" />
                {igstAmount.toLocaleString()}
              </span>
            </div>
          ) : (
            <div className="text-sm text-gray-500">No tax applicable</div>
          )}

          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Total Tax:</span>
            <span className="font-medium">
              <IndianRupee className="inline h-3 w-3 mr-1" />
              {totalTax.toLocaleString()}
            </span>
          </div>
        </div>

        <Separator />

        {roundOff !== 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Round Off:</span>
            <span
              className={`font-medium ${roundOff > 0 ? 'text-green-600' : 'text-red-600'}`}
            >
              {roundOff > 0 ? '+' : ''}
              <IndianRupee className="inline h-3 w-3 mr-1" />
              {roundOff.toLocaleString()}
            </span>
          </div>
        )}

        <div className="flex justify-between text-lg font-bold border-t pt-4">
          <span>Total Amount:</span>
          <span className="text-indigo-600">
            <IndianRupee className="inline h-4 w-4 mr-1" />
            {totalAmount.toLocaleString()}
          </span>
        </div>

        <div className="text-xs text-gray-500 mt-2">
          <p>Amount in words: {numberToWords(totalAmount)}</p>
        </div>
      </CardContent>
    </Card>
  )
}

// Helper function to convert numbers to words (simplified version)
function numberToWords(num: number): string {
  const ones = [
    '',
    'one',
    'two',
    'three',
    'four',
    'five',
    'six',
    'seven',
    'eight',
    'nine',
  ]
  const tens = [
    '',
    '',
    'twenty',
    'thirty',
    'forty',
    'fifty',
    'sixty',
    'seventy',
    'eighty',
    'ninety',
  ]
  const teens = [
    'ten',
    'eleven',
    'twelve',
    'thirteen',
    'fourteen',
    'fifteen',
    'sixteen',
    'seventeen',
    'eighteen',
    'nineteen',
  ]

  if (num === 0) return 'zero'

  const convertHundreds = (n: number): string => {
    let result = ''

    if (n >= 100) {
      result += ones[Math.floor(n / 100)] + ' hundred '
      n %= 100
    }

    if (n >= 20) {
      result += tens[Math.floor(n / 10)] + ' '
      n %= 10
    } else if (n >= 10) {
      result += teens[n - 10] + ' '
      return result.trim()
    }

    if (n > 0) {
      result += ones[n] + ' '
    }

    return result.trim()
  }

  const convertThousands = (n: number): string => {
    if (n >= 100000) {
      return (
        convertHundreds(Math.floor(n / 100000)) +
        ' lakh ' +
        convertHundreds(n % 100000)
      )
    } else if (n >= 1000) {
      return (
        convertHundreds(Math.floor(n / 1000)) +
        ' thousand ' +
        convertHundreds(n % 1000)
      )
    } else {
      return convertHundreds(n)
    }
  }

  const integerPart = Math.floor(num)
  const decimalPart = Math.round((num - integerPart) * 100)

  let result = convertThousands(integerPart) + ' rupees'

  if (decimalPart > 0) {
    result += ' and ' + convertHundreds(decimalPart) + ' paise'
  }

  return result + ' only'
}
