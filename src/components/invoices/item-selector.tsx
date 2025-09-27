'use client'

import { useState, useEffect, useCallback } from 'react'
import { Search, Plus, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getItems } from '@/lib/actions/item'
import { InvoiceItem } from '@/lib/schemas/invoice'

interface Item {
  id: string
  name: string
  description?: string
  hsn_sac_code: string
  price: number
  tax_rate: number
  unit: string
  category?: string
}

interface ItemSelectorProps {
  onItemSelect: (item: InvoiceItem) => void
  onClose: () => void
}

export function ItemSelector({ onItemSelect, onClose }: ItemSelectorProps) {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true)
      const result = await getItems(search, 1, 50) // Get more items for selection
      setItems(result.data)
    } catch (error) {
      console.error('Failed to fetch items:', error)
      // Fallback to mock data
      const mockItems: Item[] = [
        {
          id: '1',
          name: 'Web Development Service',
          description: 'Custom website development and design',
          hsn_sac_code: '9983',
          price: 50000,
          tax_rate: 18,
          unit: 'project',
          category: 'Services',
        },
        {
          id: '2',
          name: 'Laptop Computer',
          description: 'High-performance laptop for business use',
          hsn_sac_code: '8471',
          price: 75000,
          tax_rate: 18,
          unit: 'piece',
          category: 'Electronics',
        },
        {
          id: '3',
          name: 'Consulting Services',
          description: 'Business consulting and advisory services',
          hsn_sac_code: '9983',
          price: 2500,
          tax_rate: 18,
          unit: 'hour',
          category: 'Services',
        },
      ]
      setItems(mockItems)
    } finally {
      setLoading(false)
    }
  }, [search])

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  const handleItemSelect = (item: Item) => {
    const invoiceItem: InvoiceItem = {
      item_id: item.id,
      name: item.name,
      description: item.description,
      hsn_sac_code: item.hsn_sac_code,
      quantity: 1,
      unit: item.unit,
      price: item.price,
      tax_rate: item.tax_rate,
      discount_percent: 0,
      discount_amount: 0,
    }
    onItemSelect(invoiceItem)
    onClose()
  }

  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.description?.toLowerCase().includes(search.toLowerCase()) ||
      item.hsn_sac_code.includes(search)
  )

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-4xl max-h-[80vh] overflow-hidden">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Select Item</CardTitle>
              <CardDescription>
                Choose an item to add to the invoice
              </CardDescription>
            </div>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search items by name, description, or HSN/SAC code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>

        <CardContent className="overflow-y-auto max-h-96">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No items found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredItems.map((item) => (
                <Card
                  key={item.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleItemSelect(item)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-gray-900">{item.name}</h3>
                      {item.category && (
                        <Badge variant="outline" className="text-xs">
                          {item.category}
                        </Badge>
                      )}
                    </div>

                    {item.description && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {item.description}
                      </p>
                    )}

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">HSN/SAC:</span>
                        <span className="ml-1 font-mono">
                          {item.hsn_sac_code}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Unit:</span>
                        <span className="ml-1">{item.unit}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Price:</span>
                        <span className="ml-1 font-medium">
                          ₹{item.price.toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Tax:</span>
                        <span className="ml-1">{item.tax_rate}%</span>
                      </div>
                    </div>

                    <Button
                      size="sm"
                      className="w-full mt-3"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleItemSelect(item)
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add to Invoice
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
