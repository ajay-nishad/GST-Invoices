'use client'

import { useState } from 'react'
import { Trash2, Edit2, Save, X, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { InvoiceItem } from '@/lib/schemas/invoice'
import { ItemSelector } from './item-selector'

interface InvoiceLineItemsProps {
  items: InvoiceItem[]
  onUpdateItem: (index: number, item: Partial<InvoiceItem>) => void
  onRemoveItem: (index: number) => void
  onAddItem: (item: InvoiceItem) => void
}

export function InvoiceLineItems({
  items,
  onUpdateItem,
  onRemoveItem,
  onAddItem,
}: InvoiceLineItemsProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [showItemSelector, setShowItemSelector] = useState(false)
  const [editingItem, setEditingItem] = useState<Partial<InvoiceItem>>({})

  const handleEdit = (index: number) => {
    setEditingIndex(index)
    setEditingItem(items[index])
  }

  const handleSave = (index: number) => {
    onUpdateItem(index, editingItem)
    setEditingIndex(null)
    setEditingItem({})
  }

  const handleCancel = () => {
    setEditingIndex(null)
    setEditingItem({})
  }

  const handleItemSelect = (item: InvoiceItem) => {
    onAddItem(item)
    setShowItemSelector(false)
  }

  const calculateItemTotal = (item: InvoiceItem) => {
    const subtotal = item.quantity * item.price
    const discountAmount =
      item.discount_percent > 0
        ? (subtotal * item.discount_percent) / 100
        : item.discount_amount
    const taxableAmount = subtotal - discountAmount
    const taxAmount = (taxableAmount * item.tax_rate) / 100
    return taxableAmount + taxAmount
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Invoice Items</h3>
        <Button onClick={() => setShowItemSelector(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
          <p className="text-gray-500 mb-4">No items added yet</p>
          <Button onClick={() => setShowItemSelector(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add First Item
          </Button>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Item</TableHead>
                <TableHead className="w-[100px]">HSN/SAC</TableHead>
                <TableHead className="w-[80px]">Qty</TableHead>
                <TableHead className="w-[100px]">Unit</TableHead>
                <TableHead className="w-[120px]">Price</TableHead>
                <TableHead className="w-[80px]">Tax %</TableHead>
                <TableHead className="w-[100px]">Discount</TableHead>
                <TableHead className="w-[120px]">Total</TableHead>
                <TableHead className="w-[80px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>
                    {editingIndex === index ? (
                      <div className="space-y-2">
                        <Input
                          value={editingItem.name || ''}
                          onChange={(e) =>
                            setEditingItem({
                              ...editingItem,
                              name: e.target.value,
                            })
                          }
                          placeholder="Item name"
                        />
                        <Input
                          value={editingItem.description || ''}
                          onChange={(e) =>
                            setEditingItem({
                              ...editingItem,
                              description: e.target.value,
                            })
                          }
                          placeholder="Description"
                        />
                      </div>
                    ) : (
                      <div>
                        <div className="font-medium">{item.name}</div>
                        {item.description && (
                          <div className="text-sm text-gray-500">
                            {item.description}
                          </div>
                        )}
                      </div>
                    )}
                  </TableCell>

                  <TableCell>
                    {editingIndex === index ? (
                      <Input
                        value={editingItem.hsn_sac_code || ''}
                        onChange={(e) =>
                          setEditingItem({
                            ...editingItem,
                            hsn_sac_code: e.target.value,
                          })
                        }
                        className="font-mono"
                      />
                    ) : (
                      <span className="font-mono text-sm">
                        {item.hsn_sac_code}
                      </span>
                    )}
                  </TableCell>

                  <TableCell>
                    {editingIndex === index ? (
                      <Input
                        type="number"
                        step="0.01"
                        value={editingItem.quantity || ''}
                        onChange={(e) =>
                          setEditingItem({
                            ...editingItem,
                            quantity: parseFloat(e.target.value) || 0,
                          })
                        }
                      />
                    ) : (
                      <span>{item.quantity}</span>
                    )}
                  </TableCell>

                  <TableCell>
                    {editingIndex === index ? (
                      <Input
                        value={editingItem.unit || ''}
                        onChange={(e) =>
                          setEditingItem({
                            ...editingItem,
                            unit: e.target.value,
                          })
                        }
                      />
                    ) : (
                      <span>{item.unit}</span>
                    )}
                  </TableCell>

                  <TableCell>
                    {editingIndex === index ? (
                      <Input
                        type="number"
                        step="0.01"
                        value={editingItem.price || ''}
                        onChange={(e) =>
                          setEditingItem({
                            ...editingItem,
                            price: parseFloat(e.target.value) || 0,
                          })
                        }
                      />
                    ) : (
                      <span>₹{item.price.toLocaleString()}</span>
                    )}
                  </TableCell>

                  <TableCell>
                    {editingIndex === index ? (
                      <Input
                        type="number"
                        step="0.01"
                        value={editingItem.tax_rate || ''}
                        onChange={(e) =>
                          setEditingItem({
                            ...editingItem,
                            tax_rate: parseFloat(e.target.value) || 0,
                          })
                        }
                      />
                    ) : (
                      <span>{item.tax_rate}%</span>
                    )}
                  </TableCell>

                  <TableCell>
                    {editingIndex === index ? (
                      <div className="space-y-1">
                        <Input
                          type="number"
                          step="0.01"
                          value={editingItem.discount_percent || ''}
                          onChange={(e) =>
                            setEditingItem({
                              ...editingItem,
                              discount_percent: parseFloat(e.target.value) || 0,
                              discount_amount: 0,
                            })
                          }
                          placeholder="%"
                        />
                        <Input
                          type="number"
                          step="0.01"
                          value={editingItem.discount_amount || ''}
                          onChange={(e) =>
                            setEditingItem({
                              ...editingItem,
                              discount_amount: parseFloat(e.target.value) || 0,
                              discount_percent: 0,
                            })
                          }
                          placeholder="₹"
                        />
                      </div>
                    ) : (
                      <div>
                        {item.discount_percent > 0 && (
                          <Badge variant="outline">
                            {item.discount_percent}%
                          </Badge>
                        )}
                        {item.discount_amount > 0 && (
                          <div className="text-sm">
                            ₹{item.discount_amount.toLocaleString()}
                          </div>
                        )}
                      </div>
                    )}
                  </TableCell>

                  <TableCell>
                    <span className="font-medium">
                      ₹{calculateItemTotal(item).toLocaleString()}
                    </span>
                  </TableCell>

                  <TableCell>
                    {editingIndex === index ? (
                      <div className="flex space-x-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSave(index)}
                        >
                          <Save className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleCancel}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex space-x-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(index)}
                        >
                          <Edit2 className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onRemoveItem(index)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {showItemSelector && (
        <ItemSelector
          onItemSelect={handleItemSelect}
          onClose={() => setShowItemSelector(false)}
        />
      )}
    </div>
  )
}
