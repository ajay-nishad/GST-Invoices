'use client'

import { useState } from 'react'
import { FileText, Download, FileSpreadsheet, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface TemplateSelectorProps {
  invoiceId: string
  invoiceNumber: string
  onExport: (format: 'pdf' | 'excel', template?: string) => void
}

export function TemplateSelector({
  invoiceId,
  invoiceNumber,
  onExport,
}: TemplateSelectorProps) {
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async (format: 'pdf' | 'excel', template?: string) => {
    setIsExporting(true)
    try {
      await onExport(format, template)
    } finally {
      setIsExporting(false)
    }
  }

  const templates = [
    {
      id: 'classic',
      name: 'Classic',
      description: 'Traditional invoice layout with detailed breakdown',
      features: [
        'Company logo',
        'Detailed GST breakdown',
        'Signature area',
        'QR code support',
      ],
    },
    {
      id: 'minimal',
      name: 'Minimal',
      description: 'Clean and simple design for modern businesses',
      features: [
        'Clean layout',
        'Essential information only',
        'Professional look',
      ],
    },
    {
      id: 'modern',
      name: 'Modern',
      description: 'Contemporary design with colored sections',
      features: [
        'Dark header',
        'Colored sections',
        'Modern typography',
        'Enhanced visual appeal',
      ],
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="h-5 w-5 mr-2" />
          Export Invoice
        </CardTitle>
        <CardDescription>
          Choose a template and export format for invoice #{invoiceNumber}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* PDF Export */}
        <div>
          <h4 className="text-sm font-medium mb-3">PDF Templates</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {templates.map((template) => (
              <Card
                key={template.id}
                className="border-2 hover:border-indigo-300 transition-colors"
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">{template.name}</CardTitle>
                  <CardDescription className="text-xs">
                    {template.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-1">
                      {template.features.map((feature, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs"
                        >
                          {feature}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleExport('pdf', template.id)}
                        disabled={isExporting}
                        className="flex-1"
                      >
                        <Download className="h-3 w-3 mr-1" />
                        Download
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          window.open(
                            `/api/export/pdf?template=${template.id}&invoiceId=${invoiceId}&preview=true`,
                            '_blank'
                          )
                        }
                        disabled={isExporting}
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Excel Export */}
        <div className="border-t pt-4">
          <h4 className="text-sm font-medium mb-3">Excel Export</h4>
          <Card className="border-2">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="font-medium">Invoice Data</h5>
                  <p className="text-sm text-gray-600">
                    Export invoice summary and line items to Excel
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    <Badge variant="outline" className="text-xs">
                      Summary Sheet
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      Items Sheet
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      Calculations
                    </Badge>
                  </div>
                </div>
                <Button
                  onClick={() => handleExport('excel')}
                  disabled={isExporting}
                  className="ml-4"
                >
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Export Excel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Export Status */}
        {isExporting && (
          <div className="text-center py-4">
            <div className="inline-flex items-center text-sm text-indigo-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600 mr-2"></div>
              Generating export...
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
