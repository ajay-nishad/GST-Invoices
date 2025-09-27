import React from 'react'
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font,
} from '@react-pdf/renderer'

// Register fonts
Font.register({
  family: 'Roboto',
  fonts: [
    {
      src: 'https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxK.woff2',
    },
    {
      src: 'https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmEU9fBBc4.woff2',
      fontWeight: 'bold',
    },
  ],
})

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 40,
    fontFamily: 'Roboto',
    position: 'relative',
  },
  watermark: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%) rotate(-45deg)',
    fontSize: 20,
    color: '#E5E7EB',
    opacity: 0.2,
    zIndex: -1,
    fontFamily: 'Roboto',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 40,
    paddingBottom: 20,
    borderBottom: '1 solid #E5E7EB',
  },
  companyInfo: {
    flex: 1,
  },
  companyName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  companyDetails: {
    fontSize: 9,
    color: '#6B7280',
    lineHeight: 1.3,
  },
  invoiceInfo: {
    alignItems: 'flex-end',
  },
  invoiceTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 5,
  },
  invoiceNumber: {
    fontSize: 12,
    color: '#6B7280',
  },
  customerSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  customerInfo: {
    fontSize: 10,
    color: '#374151',
    lineHeight: 1.4,
  },
  itemsTable: {
    marginBottom: 30,
  },
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottom: '2 solid #1F2937',
  },
  tableHeaderText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottom: '1 solid #F3F4F6',
  },
  tableCell: {
    fontSize: 9,
    color: '#374151',
    lineHeight: 1.3,
  },
  itemName: {
    flex: 3,
    fontWeight: 'bold',
  },
  itemHsn: {
    flex: 1,
    textAlign: 'center',
    fontFamily: 'Courier',
  },
  itemQty: {
    flex: 0.8,
    textAlign: 'center',
  },
  itemPrice: {
    flex: 1.2,
    textAlign: 'right',
  },
  itemTax: {
    flex: 0.8,
    textAlign: 'center',
  },
  itemTotal: {
    flex: 1.2,
    textAlign: 'right',
    fontWeight: 'bold',
  },
  totalsSection: {
    alignItems: 'flex-end',
    marginBottom: 40,
  },
  totalsTable: {
    width: 250,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  totalLabel: {
    fontSize: 10,
    color: '#6B7280',
  },
  totalValue: {
    fontSize: 10,
    color: '#374151',
  },
  finalTotal: {
    borderTop: '1 solid #1F2937',
    paddingTop: 8,
    marginTop: 8,
  },
  finalTotalLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  finalTotalValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  notesSection: {
    marginBottom: 30,
  },
  notesTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 6,
  },
  notesText: {
    fontSize: 9,
    color: '#374151',
    lineHeight: 1.4,
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  signature: {
    flex: 1,
  },
  signatureLabel: {
    fontSize: 9,
    color: '#6B7280',
    marginBottom: 30,
  },
  signatureLine: {
    borderBottom: '1 solid #374151',
    width: 120,
  },
  qrCode: {
    width: 60,
    height: 60,
    objectFit: 'contain',
  },
  amountInWords: {
    fontSize: 9,
    color: '#6B7280',
    fontStyle: 'italic',
    marginTop: 8,
    textAlign: 'right',
  },
})

interface InvoiceData {
  business: {
    name: string
    gst_number?: string
    pan_number?: string
    address: string
    city: string
    state: string
    pincode: string
    country: string
    phone: string
    email: string
    website?: string
    logo_url?: string
  }
  customer: {
    name: string
    email?: string
    phone?: string
    gst_number?: string
    address?: string
    city?: string
    state?: string
    pincode?: string
    country?: string
  }
  invoice: {
    invoice_number: string
    invoice_date: string
    due_date: string
    status: string
    notes?: string
    terms?: string
    payment_terms?: string
  }
  items: Array<{
    name: string
    description?: string
    hsn_sac_code: string
    quantity: number
    unit: string
    price: number
    tax_rate: number
    discount_percent: number
    discount_amount: number
  }>
  calculations: {
    subtotal: number
    totalDiscount: number
    totalTax: number
    cgstAmount: number
    sgstAmount: number
    igstAmount: number
    roundOff: number
    totalAmount: number
  }
  isFreePlan?: boolean
  qrCodeData?: string
}

interface MinimalTemplateProps {
  data: InvoiceData
}

export const MinimalTemplate: React.FC<MinimalTemplateProps> = ({ data }) => {
  const {
    business,
    customer,
    invoice,
    items,
    calculations,
    isFreePlan,
    qrCodeData,
  } = data

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const numberToWords = (num: number): string => {
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

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Watermark for free plan */}
        {isFreePlan && (
          <Text style={styles.watermark}>
            Generated via Ajay&apos;s GST Invoice
          </Text>
        )}

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.companyInfo}>
            <Text style={styles.companyName}>{business.name}</Text>
            <Text style={styles.companyDetails}>
              {business.address}, {business.city}, {business.state} -{' '}
              {business.pincode}
              {'\n'}
              {business.phone} • {business.email}
              {business.gst_number && ` • GSTIN: ${business.gst_number}`}
            </Text>
          </View>
          <View style={styles.invoiceInfo}>
            <Text style={styles.invoiceTitle}>INVOICE</Text>
            <Text style={styles.invoiceNumber}>#{invoice.invoice_number}</Text>
          </View>
        </View>

        {/* Customer Section */}
        <View style={styles.customerSection}>
          <Text style={styles.sectionTitle}>Bill To:</Text>
          <Text style={styles.customerInfo}>
            {customer.name}
            {customer.email && ` • ${customer.email}`}
            {customer.phone && ` • ${customer.phone}`}
            {customer.gst_number && ` • GSTIN: ${customer.gst_number}`}
            {customer.address && `\n${customer.address}`}
            {customer.city &&
              customer.state &&
              `\n${customer.city}, ${customer.state}`}
            {customer.pincode && ` - ${customer.pincode}`}
          </Text>
        </View>

        {/* Items Table */}
        <View style={styles.itemsTable}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, { flex: 3 }]}>Item</Text>
            <Text
              style={[styles.tableHeaderText, { flex: 1, textAlign: 'center' }]}
            >
              HSN/SAC
            </Text>
            <Text
              style={[
                styles.tableHeaderText,
                { flex: 0.8, textAlign: 'center' },
              ]}
            >
              Qty
            </Text>
            <Text
              style={[
                styles.tableHeaderText,
                { flex: 1.2, textAlign: 'right' },
              ]}
            >
              Price
            </Text>
            <Text
              style={[
                styles.tableHeaderText,
                { flex: 0.8, textAlign: 'center' },
              ]}
            >
              Tax%
            </Text>
            <Text
              style={[
                styles.tableHeaderText,
                { flex: 1.2, textAlign: 'right' },
              ]}
            >
              Total
            </Text>
          </View>

          {items.map((item, index) => {
            const itemSubtotal = item.quantity * item.price
            const discountAmount =
              item.discount_percent > 0
                ? (itemSubtotal * item.discount_percent) / 100
                : item.discount_amount
            const taxableAmount = itemSubtotal - discountAmount
            const taxAmount = (taxableAmount * item.tax_rate) / 100
            const itemTotal = taxableAmount + taxAmount

            return (
              <View key={index} style={styles.tableRow}>
                <Text style={[styles.tableCell, styles.itemName]}>
                  {item.name}
                </Text>
                <Text style={[styles.tableCell, styles.itemHsn]}>
                  {item.hsn_sac_code}
                </Text>
                <Text style={[styles.tableCell, styles.itemQty]}>
                  {item.quantity}
                </Text>
                <Text style={[styles.tableCell, styles.itemPrice]}>
                  {formatCurrency(item.price)}
                </Text>
                <Text style={[styles.tableCell, styles.itemTax]}>
                  {item.tax_rate}%
                </Text>
                <Text style={[styles.tableCell, styles.itemTotal]}>
                  {formatCurrency(itemTotal)}
                </Text>
              </View>
            )
          })}
        </View>

        {/* Totals Section */}
        <View style={styles.totalsSection}>
          <View style={styles.totalsTable}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Subtotal:</Text>
              <Text style={styles.totalValue}>
                {formatCurrency(calculations.subtotal)}
              </Text>
            </View>

            {calculations.totalDiscount > 0 && (
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Discount:</Text>
                <Text style={styles.totalValue}>
                  -{formatCurrency(calculations.totalDiscount)}
                </Text>
              </View>
            )}

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Tax:</Text>
              <Text style={styles.totalValue}>
                {formatCurrency(calculations.totalTax)}
              </Text>
            </View>

            {calculations.roundOff !== 0 && (
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Round Off:</Text>
                <Text style={styles.totalValue}>
                  {calculations.roundOff > 0 ? '+' : ''}
                  {formatCurrency(calculations.roundOff)}
                </Text>
              </View>
            )}

            <View style={[styles.totalRow, styles.finalTotal]}>
              <Text style={styles.finalTotalLabel}>Total:</Text>
              <Text style={styles.finalTotalValue}>
                {formatCurrency(calculations.totalAmount)}
              </Text>
            </View>

            <Text style={styles.amountInWords}>
              {numberToWords(calculations.totalAmount)}
            </Text>
          </View>
        </View>

        {/* Notes */}
        {invoice.notes && (
          <View style={styles.notesSection}>
            <Text style={styles.notesTitle}>Notes:</Text>
            <Text style={styles.notesText}>{invoice.notes}</Text>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.signature}>
            <Text style={styles.signatureLabel}>Authorized Signature</Text>
            <View style={styles.signatureLine} />
          </View>
          {qrCodeData && <Image style={styles.qrCode} src={qrCodeData} />}
        </View>
      </Page>
    </Document>
  )
}
