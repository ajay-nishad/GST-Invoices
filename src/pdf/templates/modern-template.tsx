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
    padding: 0,
    fontFamily: 'Roboto',
    position: 'relative',
  },
  watermark: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%) rotate(-45deg)',
    fontSize: 22,
    color: '#E5E7EB',
    opacity: 0.25,
    zIndex: -1,
    fontFamily: 'Roboto',
  },
  header: {
    backgroundColor: '#1F2937',
    padding: 30,
    color: '#FFFFFF',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  companyInfo: {
    flex: 1,
  },
  companyName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  companyDetails: {
    fontSize: 10,
    color: '#D1D5DB',
    lineHeight: 1.4,
  },
  invoiceInfo: {
    alignItems: 'flex-end',
  },
  invoiceTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  invoiceNumber: {
    fontSize: 12,
    color: '#D1D5DB',
  },
  content: {
    padding: 30,
  },
  customerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    padding: 20,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
  },
  billTo: {
    flex: 1,
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
  invoiceDetails: {
    flex: 1,
    marginLeft: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 10,
    color: '#6B7280',
    fontWeight: 'bold',
  },
  detailValue: {
    fontSize: 10,
    color: '#374151',
  },
  itemsTable: {
    marginBottom: 30,
    border: '1 solid #E5E7EB',
    borderRadius: 8,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    padding: 12,
  },
  tableHeaderText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#374151',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 12,
    borderBottom: '1 solid #F3F4F6',
    minHeight: 40,
  },
  tableRowEven: {
    backgroundColor: '#FAFAFA',
  },
  tableCell: {
    fontSize: 9,
    color: '#374151',
    lineHeight: 1.3,
  },
  itemName: {
    flex: 2.5,
    fontWeight: 'bold',
  },
  itemDescription: {
    flex: 2,
    color: '#6B7280',
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
  itemUnit: {
    flex: 0.8,
    textAlign: 'center',
  },
  itemPrice: {
    flex: 1,
    textAlign: 'right',
  },
  itemTax: {
    flex: 0.8,
    textAlign: 'center',
  },
  itemDiscount: {
    flex: 1,
    textAlign: 'right',
    color: '#DC2626',
  },
  itemTotal: {
    flex: 1.2,
    textAlign: 'right',
    fontWeight: 'bold',
  },
  totalsSection: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 30,
  },
  totalsTable: {
    width: 320,
    border: '1 solid #E5E7EB',
    borderRadius: 8,
    overflow: 'hidden',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottom: '1 solid #F3F4F6',
  },
  totalLabel: {
    fontSize: 10,
    color: '#6B7280',
  },
  totalValue: {
    fontSize: 10,
    color: '#374151',
    fontWeight: 'bold',
  },
  finalTotal: {
    backgroundColor: '#1F2937',
    borderBottom: 'none',
  },
  finalTotalLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  finalTotalValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  gstBreakdown: {
    padding: 12,
    backgroundColor: '#F0F9FF',
    borderTop: '1 solid #E5E7EB',
  },
  gstTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#1E40AF',
    marginBottom: 6,
  },
  gstRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  gstLabel: {
    fontSize: 8,
    color: '#1E40AF',
  },
  gstValue: {
    fontSize: 8,
    color: '#1E40AF',
    fontWeight: 'bold',
  },
  notesSection: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
    border: '1 solid #F59E0B',
  },
  notesTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#92400E',
    marginBottom: 6,
  },
  notesText: {
    fontSize: 9,
    color: '#92400E',
    lineHeight: 1.4,
  },
  termsSection: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#F0FDF4',
    borderRadius: 8,
    border: '1 solid #10B981',
  },
  termsTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#065F46',
    marginBottom: 6,
  },
  termsText: {
    fontSize: 9,
    color: '#065F46',
    lineHeight: 1.4,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  signature: {
    flex: 1,
  },
  signatureLabel: {
    fontSize: 10,
    color: '#6B7280',
    marginBottom: 40,
  },
  signatureLine: {
    borderBottom: '2 solid #1F2937',
    width: 150,
  },
  qrCode: {
    width: 80,
    height: 80,
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

interface ModernTemplateProps {
  data: InvoiceData
}

export const ModernTemplate: React.FC<ModernTemplateProps> = ({ data }) => {
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
      month: 'long',
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
          <View style={styles.headerContent}>
            <View style={styles.companyInfo}>
              <Text style={styles.companyName}>{business.name}</Text>
              <Text style={styles.companyDetails}>
                {business.address}, {business.city}, {business.state} -{' '}
                {business.pincode}
                {'\n'}
                {business.phone} • {business.email}
                {business.website && ` • ${business.website}`}
                {business.gst_number && `\nGSTIN: ${business.gst_number}`}
                {business.pan_number && ` • PAN: ${business.pan_number}`}
              </Text>
            </View>
            <View style={styles.invoiceInfo}>
              <Text style={styles.invoiceTitle}>INVOICE</Text>
              <Text style={styles.invoiceNumber}>
                #{invoice.invoice_number}
              </Text>
            </View>
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Customer Section */}
          <View style={styles.customerSection}>
            <View style={styles.billTo}>
              <Text style={styles.sectionTitle}>Bill To:</Text>
              <Text style={styles.customerInfo}>
                {customer.name}
                {customer.email && `\n${customer.email}`}
                {customer.phone && `\n${customer.phone}`}
                {customer.gst_number && `\nGSTIN: ${customer.gst_number}`}
                {customer.address && `\n${customer.address}`}
                {customer.city &&
                  customer.state &&
                  `\n${customer.city}, ${customer.state}`}
                {customer.pincode && ` - ${customer.pincode}`}
                {customer.country && `\n${customer.country}`}
              </Text>
            </View>
            <View style={styles.invoiceDetails}>
              <Text style={styles.sectionTitle}>Invoice Details:</Text>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Invoice Date:</Text>
                <Text style={styles.detailValue}>
                  {formatDate(invoice.invoice_date)}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Due Date:</Text>
                <Text style={styles.detailValue}>
                  {formatDate(invoice.due_date)}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Status:</Text>
                <Text style={styles.detailValue}>
                  {invoice.status.toUpperCase()}
                </Text>
              </View>
              {invoice.payment_terms && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Payment Terms:</Text>
                  <Text style={styles.detailValue}>
                    {invoice.payment_terms}
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Items Table */}
          <View style={styles.itemsTable}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderText, { flex: 2.5 }]}>Item</Text>
              <Text style={[styles.tableHeaderText, { flex: 2 }]}>
                Description
              </Text>
              <Text
                style={[
                  styles.tableHeaderText,
                  { flex: 1, textAlign: 'center' },
                ]}
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
                  { flex: 0.8, textAlign: 'center' },
                ]}
              >
                Unit
              </Text>
              <Text
                style={[
                  styles.tableHeaderText,
                  { flex: 1, textAlign: 'right' },
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
                  { flex: 1, textAlign: 'right' },
                ]}
              >
                Discount
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
                <View
                  key={index}
                  style={[
                    styles.tableRow,
                    index % 2 === 1 ? styles.tableRowEven : {},
                  ]}
                >
                  <Text style={[styles.tableCell, styles.itemName]}>
                    {item.name}
                  </Text>
                  <Text style={[styles.tableCell, styles.itemDescription]}>
                    {item.description || '-'}
                  </Text>
                  <Text style={[styles.tableCell, styles.itemHsn]}>
                    {item.hsn_sac_code}
                  </Text>
                  <Text style={[styles.tableCell, styles.itemQty]}>
                    {item.quantity}
                  </Text>
                  <Text style={[styles.tableCell, styles.itemUnit]}>
                    {item.unit}
                  </Text>
                  <Text style={[styles.tableCell, styles.itemPrice]}>
                    {formatCurrency(item.price)}
                  </Text>
                  <Text style={[styles.tableCell, styles.itemTax]}>
                    {item.tax_rate}%
                  </Text>
                  <Text style={[styles.tableCell, styles.itemDiscount]}>
                    {item.discount_percent > 0
                      ? `${item.discount_percent}%`
                      : formatCurrency(discountAmount)}
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
                  <Text style={styles.totalLabel}>Total Discount:</Text>
                  <Text style={styles.totalValue}>
                    -{formatCurrency(calculations.totalDiscount)}
                  </Text>
                </View>
              )}

              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Taxable Amount:</Text>
                <Text style={styles.totalValue}>
                  {formatCurrency(
                    calculations.subtotal - calculations.totalDiscount
                  )}
                </Text>
              </View>

              {/* GST Breakdown */}
              {(calculations.cgstAmount > 0 ||
                calculations.sgstAmount > 0 ||
                calculations.igstAmount > 0) && (
                <View style={styles.gstBreakdown}>
                  <Text style={styles.gstTitle}>GST Breakdown:</Text>
                  {calculations.cgstAmount > 0 &&
                  calculations.sgstAmount > 0 ? (
                    <>
                      <View style={styles.gstRow}>
                        <Text style={styles.gstLabel}>CGST (9%):</Text>
                        <Text style={styles.gstValue}>
                          {formatCurrency(calculations.cgstAmount)}
                        </Text>
                      </View>
                      <View style={styles.gstRow}>
                        <Text style={styles.gstLabel}>SGST (9%):</Text>
                        <Text style={styles.gstValue}>
                          {formatCurrency(calculations.sgstAmount)}
                        </Text>
                      </View>
                    </>
                  ) : calculations.igstAmount > 0 ? (
                    <View style={styles.gstRow}>
                      <Text style={styles.gstLabel}>IGST (18%):</Text>
                      <Text style={styles.gstValue}>
                        {formatCurrency(calculations.igstAmount)}
                      </Text>
                    </View>
                  ) : null}
                  <View style={styles.gstRow}>
                    <Text style={styles.gstLabel}>Total Tax:</Text>
                    <Text style={styles.gstValue}>
                      {formatCurrency(calculations.totalTax)}
                    </Text>
                  </View>
                </View>
              )}

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
                <Text style={styles.finalTotalLabel}>Total Amount:</Text>
                <Text style={styles.finalTotalValue}>
                  {formatCurrency(calculations.totalAmount)}
                </Text>
              </View>

              <Text style={styles.amountInWords}>
                Amount in words: {numberToWords(calculations.totalAmount)}
              </Text>
            </View>
          </View>

          {/* Notes and Terms */}
          {invoice.notes && (
            <View style={styles.notesSection}>
              <Text style={styles.notesTitle}>Notes:</Text>
              <Text style={styles.notesText}>{invoice.notes}</Text>
            </View>
          )}

          {invoice.terms && (
            <View style={styles.termsSection}>
              <Text style={styles.termsTitle}>Terms & Conditions:</Text>
              <Text style={styles.termsText}>{invoice.terms}</Text>
            </View>
          )}
        </View>

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
