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

// Register fonts for better typography
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
    padding: 30,
    fontFamily: 'Roboto',
    position: 'relative',
  },
  watermark: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%) rotate(-45deg)',
    fontSize: 24,
    color: '#E5E7EB',
    opacity: 0.3,
    zIndex: -1,
    fontFamily: 'Roboto',
  },
  guestWatermark: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%) rotate(-45deg)',
    fontSize: 20,
    color: '#DC2626',
    opacity: 0.4,
    zIndex: -1,
    fontFamily: 'Roboto',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    borderBottom: '2 solid #E5E7EB',
    paddingBottom: 20,
  },
  logo: {
    width: 80,
    height: 80,
    objectFit: 'contain',
  },
  companyInfo: {
    flex: 1,
    marginLeft: 20,
  },
  companyName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 5,
  },
  companyDetails: {
    fontSize: 10,
    color: '#6B7280',
    lineHeight: 1.4,
  },
  invoiceTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'right',
  },
  invoiceNumber: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'right',
    marginTop: 5,
  },
  invoiceDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  billToSection: {
    flex: 1,
  },
  billToTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 10,
  },
  billToDetails: {
    fontSize: 11,
    color: '#4B5563',
    lineHeight: 1.4,
  },
  invoiceMetaSection: {
    flex: 1,
    textAlign: 'right',
  },
  invoiceMetaRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 5,
  },
  invoiceMetaLabel: {
    fontSize: 11,
    color: '#6B7280',
    width: 80,
    textAlign: 'right',
    marginRight: 10,
  },
  invoiceMetaValue: {
    fontSize: 11,
    color: '#1F2937',
    width: 100,
    textAlign: 'right',
  },
  itemsTable: {
    marginBottom: 30,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    padding: 10,
    borderBottom: '1 solid #D1D5DB',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 10,
    borderBottom: '1 solid #E5E7EB',
    minHeight: 40,
  },
  tableCell: {
    fontSize: 10,
    color: '#1F2937',
    textAlign: 'left',
    paddingRight: 5,
  },
  tableCellHeader: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#374151',
    textAlign: 'left',
    paddingRight: 5,
  },
  tableCellRight: {
    fontSize: 10,
    color: '#1F2937',
    textAlign: 'right',
    paddingRight: 5,
  },
  tableCellHeaderRight: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#374151',
    textAlign: 'right',
    paddingRight: 5,
  },
  itemName: {
    flex: 3,
  },
  itemHsn: {
    flex: 1.5,
  },
  itemQty: {
    flex: 1,
  },
  itemUnit: {
    flex: 1,
  },
  itemPrice: {
    flex: 1.5,
  },
  itemTax: {
    flex: 1,
  },
  itemDiscount: {
    flex: 1,
  },
  itemTotal: {
    flex: 1.5,
  },
  totalsSection: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 30,
  },
  totalsTable: {
    width: 300,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderBottom: '1 solid #E5E7EB',
  },
  totalRowFinal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: '#F3F4F6',
    borderBottom: '2 solid #1F2937',
    borderTop: '2 solid #1F2937',
  },
  totalLabel: {
    fontSize: 11,
    color: '#6B7280',
  },
  totalValue: {
    fontSize: 11,
    color: '#1F2937',
  },
  totalLabelFinal: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  totalValueFinal: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  amountInWords: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#F9FAFB',
    border: '1 solid #E5E7EB',
  },
  amountInWordsLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 5,
  },
  amountInWordsText: {
    fontSize: 11,
    color: '#1F2937',
    textTransform: 'capitalize',
  },
  notesSection: {
    marginBottom: 20,
  },
  notesTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 5,
  },
  notesText: {
    fontSize: 10,
    color: '#4B5563',
    lineHeight: 1.4,
  },
  termsSection: {
    marginBottom: 30,
  },
  termsTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 5,
  },
  termsText: {
    fontSize: 10,
    color: '#4B5563',
    lineHeight: 1.4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 'auto',
    paddingTop: 20,
    borderTop: '1 solid #E5E7EB',
  },
  signature: {
    flex: 1,
  },
  signatureLabel: {
    fontSize: 11,
    color: '#6B7280',
    marginBottom: 30,
  },
  signatureLine: {
    width: 200,
    height: 1,
    backgroundColor: '#D1D5DB',
  },
  qrCode: {
    width: 80,
    height: 80,
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
  isGuestMode?: boolean
  watermark?: boolean
  qrCodeData?: string
}

interface ClassicTemplateProps {
  data: InvoiceData
}

export const ClassicTemplate: React.FC<ClassicTemplateProps> = ({ data }) => {
  const {
    business,
    customer,
    invoice,
    items,
    calculations,
    isFreePlan,
    isGuestMode,
    watermark,
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
    const thousands = ['', 'thousand', 'lakh', 'crore']

    if (num === 0) return 'zero'

    function convertHundreds(n: number): string {
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
        return result
      }

      if (n > 0) {
        result += ones[n] + ' '
      }

      return result
    }

    let result = ''
    let groupIndex = 0

    while (num > 0) {
      const group = num % (groupIndex === 0 ? 1000 : 100)
      if (group !== 0) {
        result = convertHundreds(group) + thousands[groupIndex] + ' ' + result
      }
      num = Math.floor(num / (groupIndex === 0 ? 1000 : 100))
      groupIndex++
    }

    return result.trim()
  }

  const amountInWords = numberToWords(Math.floor(calculations.totalAmount))

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Watermark for free plan or guest mode */}
        {(isFreePlan || (isGuestMode && watermark)) && (
          <Text
            style={
              isGuestMode && watermark
                ? styles.guestWatermark
                : styles.watermark
            }
          >
            {isGuestMode && watermark
              ? 'DEMO VERSION - Sign up for full features'
              : 'Generated via Ajay&apos;s GST Invoice'}
          </Text>
        )}

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.companyInfo}>
            {business.logo_url && (
              <Image style={styles.logo} src={business.logo_url} />
            )}
            <Text style={styles.companyName}>{business.name}</Text>
            <Text style={styles.companyDetails}>
              {business.address}
              {'\n'}
              {business.city}, {business.state} - {business.pincode}
              {'\n'}Phone: {business.phone}
              {'\n'}Email: {business.email}
              {business.gst_number && `\nGSTIN: ${business.gst_number}`}
              {business.pan_number && `\nPAN: ${business.pan_number}`}
            </Text>
          </View>
          <View>
            <Text style={styles.invoiceTitle}>INVOICE</Text>
            <Text style={styles.invoiceNumber}>#{invoice.invoice_number}</Text>
          </View>
        </View>

        {/* Invoice Details */}
        <View style={styles.invoiceDetails}>
          <View style={styles.billToSection}>
            <Text style={styles.billToTitle}>Bill To:</Text>
            <Text style={styles.billToDetails}>
              {customer.name}
              {customer.email && `\n${customer.email}`}
              {customer.phone && `\n${customer.phone}`}
              {customer.address && `\n${customer.address}`}
              {customer.city &&
                customer.state &&
                `\n${customer.city}, ${customer.state}`}
              {customer.pincode && ` - ${customer.pincode}`}
              {customer.gst_number && `\nGSTIN: ${customer.gst_number}`}
            </Text>
          </View>

          <View style={styles.invoiceMetaSection}>
            <View style={styles.invoiceMetaRow}>
              <Text style={styles.invoiceMetaLabel}>Invoice Date:</Text>
              <Text style={styles.invoiceMetaValue}>
                {formatDate(invoice.invoice_date)}
              </Text>
            </View>
            <View style={styles.invoiceMetaRow}>
              <Text style={styles.invoiceMetaLabel}>Due Date:</Text>
              <Text style={styles.invoiceMetaValue}>
                {formatDate(invoice.due_date)}
              </Text>
            </View>
            <View style={styles.invoiceMetaRow}>
              <Text style={styles.invoiceMetaLabel}>Status:</Text>
              <Text style={styles.invoiceMetaValue}>
                {invoice.status.toUpperCase()}
              </Text>
            </View>
            {invoice.payment_terms && (
              <View style={styles.invoiceMetaRow}>
                <Text style={styles.invoiceMetaLabel}>Payment Terms:</Text>
                <Text style={styles.invoiceMetaValue}>
                  {invoice.payment_terms}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Items Table */}
        <View style={styles.itemsTable}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableCellHeader, styles.itemName]}>Item</Text>
            <Text style={[styles.tableCellHeader, styles.itemHsn]}>
              HSN/SAC
            </Text>
            <Text style={[styles.tableCellHeaderRight, styles.itemQty]}>
              Qty
            </Text>
            <Text style={[styles.tableCellHeader, styles.itemUnit]}>Unit</Text>
            <Text style={[styles.tableCellHeaderRight, styles.itemPrice]}>
              Price
            </Text>
            <Text style={[styles.tableCellHeaderRight, styles.itemTax]}>
              Tax%
            </Text>
            <Text style={[styles.tableCellHeaderRight, styles.itemDiscount]}>
              Disc%
            </Text>
            <Text style={[styles.tableCellHeaderRight, styles.itemTotal]}>
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
                <View style={styles.itemName}>
                  <Text style={styles.tableCell}>{item.name}</Text>
                  {item.description && (
                    <Text
                      style={[
                        styles.tableCell,
                        { fontSize: 8, color: '#6B7280', marginTop: 2 },
                      ]}
                    >
                      {item.description}
                    </Text>
                  )}
                </View>
                <Text style={[styles.tableCell, styles.itemHsn]}>
                  {item.hsn_sac_code}
                </Text>
                <Text style={[styles.tableCellRight, styles.itemQty]}>
                  {item.quantity}
                </Text>
                <Text style={[styles.tableCell, styles.itemUnit]}>
                  {item.unit}
                </Text>
                <Text style={[styles.tableCellRight, styles.itemPrice]}>
                  {formatCurrency(item.price)}
                </Text>
                <Text style={[styles.tableCellRight, styles.itemTax]}>
                  {item.tax_rate}%
                </Text>
                <Text style={[styles.tableCellRight, styles.itemDiscount]}>
                  {item.discount_percent}%
                </Text>
                <Text style={[styles.tableCellRight, styles.itemTotal]}>
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

            {calculations.cgstAmount > 0 && (
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>CGST:</Text>
                <Text style={styles.totalValue}>
                  {formatCurrency(calculations.cgstAmount)}
                </Text>
              </View>
            )}

            {calculations.sgstAmount > 0 && (
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>SGST:</Text>
                <Text style={styles.totalValue}>
                  {formatCurrency(calculations.sgstAmount)}
                </Text>
              </View>
            )}

            {calculations.igstAmount > 0 && (
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>IGST:</Text>
                <Text style={styles.totalValue}>
                  {formatCurrency(calculations.igstAmount)}
                </Text>
              </View>
            )}

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total Tax:</Text>
              <Text style={styles.totalValue}>
                {formatCurrency(calculations.totalTax)}
              </Text>
            </View>

            {calculations.roundOff !== 0 && (
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Round Off:</Text>
                <Text style={styles.totalValue}>
                  {formatCurrency(calculations.roundOff)}
                </Text>
              </View>
            )}

            <View style={styles.totalRowFinal}>
              <Text style={styles.totalLabelFinal}>Total Amount:</Text>
              <Text style={styles.totalValueFinal}>
                {formatCurrency(calculations.totalAmount)}
              </Text>
            </View>
          </View>
        </View>

        {/* Amount in Words */}
        <View style={styles.amountInWords}>
          <Text style={styles.amountInWordsLabel}>Amount in Words:</Text>
          <Text style={styles.amountInWordsText}>
            {amountInWords} rupees only
          </Text>
        </View>

        {/* Notes */}
        {invoice.notes && (
          <View style={styles.notesSection}>
            <Text style={styles.notesTitle}>Notes:</Text>
            <Text style={styles.notesText}>{invoice.notes}</Text>
          </View>
        )}

        {/* Terms & Conditions */}
        {invoice.terms && (
          <View style={styles.termsSection}>
            <Text style={styles.termsTitle}>Terms & Conditions:</Text>
            <Text style={styles.termsText}>{invoice.terms}</Text>
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
