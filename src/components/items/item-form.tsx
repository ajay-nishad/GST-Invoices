'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Package, IndianRupee, Percent, Hash } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { itemSchema, ItemFormData } from '@/lib/schemas/item'
import { createItem, updateItem } from '@/lib/actions/item'

interface ItemFormProps {
  item?: any
  onSuccess?: () => void
  onCancel?: () => void
}

export function ItemForm({ item, onSuccess, onCancel }: ItemFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ItemFormData>({
    resolver: zodResolver(itemSchema) as any,
    defaultValues: item
      ? {
          name: item.name || '',
          description: item.description || '',
          hsn_sac_code: item.hsn_sac_code || '',
          price: item.price || 0,
          tax_rate: item.tax_rate || 0,
          unit: item.unit || '',
          category: item.category || '',
          is_active: item.is_active !== undefined ? item.is_active : true,
        }
      : {
          price: 0,
          tax_rate: 0,
          is_active: true,
          description: '',
          category: '',
        },
  })

  const price = watch('price')
  const taxRate = watch('tax_rate')
  const taxAmount = (price * taxRate) / 100
  const totalPrice = price + taxAmount

  const onSubmit = async (data: ItemFormData) => {
    setIsLoading(true)
    try {
      if (item) {
        await updateItem({ id: item.id, ...data })
      } else {
        await createItem(data)
      }

      onSuccess?.()
    } catch (error) {
      console.error('Form submission error:', error)
      alert(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Package className="h-5 w-5 mr-2" />
          {item ? 'Edit Item' : 'Add New Item'}
        </CardTitle>
        <CardDescription>
          {item
            ? 'Update item information'
            : 'Enter item details to get started'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Item Name *</Label>
              <Input
                id="name"
                {...register('name')}
                placeholder="Enter item name"
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                {...register('category')}
                placeholder="e.g., Electronics, Services"
              />
              {errors.category && (
                <p className="text-sm text-red-600">
                  {errors.category.message}
                </p>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Brief description of the item"
              rows={3}
            />
            {errors.description && (
              <p className="text-sm text-red-600">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* HSN/SAC Code */}
          <div className="space-y-2">
            <Label htmlFor="hsn_sac_code">HSN/SAC Code *</Label>
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="hsn_sac_code"
                {...register('hsn_sac_code', { valueAsNumber: false })}
                placeholder="e.g., 8517, 9983"
                className="pl-10 font-mono"
              />
            </div>
            {errors.hsn_sac_code && (
              <p className="text-sm text-red-600">
                {errors.hsn_sac_code.message}
              </p>
            )}
          </div>

          {/* Price and Tax */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price (₹) *</Label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  {...register('price', { valueAsNumber: true })}
                  placeholder="0.00"
                  className="pl-10"
                />
              </div>
              {errors.price && (
                <p className="text-sm text-red-600">{errors.price.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="tax_rate">Tax Rate (%) *</Label>
              <div className="relative">
                <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="tax_rate"
                  type="number"
                  step="0.01"
                  {...register('tax_rate', { valueAsNumber: true })}
                  placeholder="18.00"
                  className="pl-10"
                />
              </div>
              {errors.tax_rate && (
                <p className="text-sm text-red-600">
                  {errors.tax_rate.message}
                </p>
              )}
            </div>
          </div>

          {/* Price Calculation */}
          {price > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <h4 className="font-medium text-gray-900">Price Calculation</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Base Price:</span>
                  <span className="ml-2 font-medium">₹{price.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-gray-600">Tax ({taxRate}%):</span>
                  <span className="ml-2 font-medium">
                    ₹{taxAmount.toFixed(2)}
                  </span>
                </div>
                <div className="col-span-2 pt-2 border-t">
                  <span className="text-gray-600">Total Price:</span>
                  <span className="ml-2 font-bold text-lg">
                    ₹{totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Unit */}
          <div className="space-y-2">
            <Label htmlFor="unit">Unit *</Label>
            <Input
              id="unit"
              {...register('unit')}
              placeholder="e.g., piece, kg, hour, service"
            />
            {errors.unit && (
              <p className="text-sm text-red-600">{errors.unit.message}</p>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-4">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : item ? 'Update Item' : 'Create Item'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
