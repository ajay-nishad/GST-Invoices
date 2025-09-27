'use client'

import { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Upload, X, Building2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { businessSchema, BusinessFormData } from '@/lib/schemas/business'
import { createBusiness, updateBusiness } from '@/lib/actions/business'
import { uploadBusinessLogo } from '@/lib/actions/storage'

interface BusinessFormProps {
  onSubmit?: (data: any) => Promise<void>
  isLoading?: boolean
  business?: any
  onSuccess?: () => void
  onCancel?: () => void
}

export function BusinessForm({
  business,
  onSuccess,
  onCancel,
  onSubmit: externalOnSubmit,
  isLoading: externalLoading,
}: BusinessFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(
    business?.logo_url || null
  )
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<BusinessFormData>({
    resolver: zodResolver(businessSchema) as any,
    defaultValues: business
      ? {
          name: business.name || '',
          gst_number: business.gst_number || '',
          pan_number: business.pan_number || '',
          address: business.address || '',
          city: business.city || '',
          state: business.state || '',
          pincode: business.pincode || '',
          country: business.country || 'India',
          phone: business.phone || '',
          email: business.email || '',
          website: business.website || '',
          description: business.description || '',
          is_primary: business.is_primary || false,
          logo_url: business.logo_url || '',
        }
      : {
          country: 'India',
          is_primary: false,
          website: '',
          description: '',
          logo_url: '',
        },
  })

  const isPrimary = watch('is_primary')

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file')
        return
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB')
        return
      }

      setLogoFile(file)

      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeLogo = () => {
    setLogoFile(null)
    setLogoPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const onSubmit = async (data: BusinessFormData) => {
    if (externalOnSubmit) {
      await externalOnSubmit(data)
      return
    }
    if (!externalLoading) setIsLoading(true)
    try {
      let logoUrl = business?.logo_url || ''

      // Upload logo if selected
      if (logoFile) {
        const uploadResult = await uploadBusinessLogo(logoFile, business?.id)
        if (uploadResult.success) {
          logoUrl = uploadResult.url
        }
      }

      const formData = {
        ...data,
        logo_url: logoUrl,
      }

      if (business) {
        await updateBusiness({ id: business.id, ...formData })
      } else {
        await createBusiness(formData)
      }

      onSuccess?.()
    } catch (error) {
      console.error('Form submission error:', error)
      alert(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      if (!externalLoading) setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Building2 className="h-5 w-5 mr-2" />
          {business ? 'Edit Business' : 'Add New Business'}
        </CardTitle>
        <CardDescription>
          {business
            ? 'Update your business information'
            : 'Enter your business details to get started'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit(externalOnSubmit || onSubmit)}
          className="space-y-6"
        >
          {/* Logo Upload */}
          <div className="space-y-2">
            <Label>Business Logo</Label>
            <div className="flex items-center space-x-4">
              {logoPreview ? (
                <div className="relative">
                  <img
                    src={logoPreview}
                    alt="Business logo"
                    className="h-20 w-20 rounded-lg object-cover border"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                    onClick={removeLogo}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <div className="h-20 w-20 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                  <Building2 className="h-8 w-8 text-gray-400" />
                </div>
              )}
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {logoPreview ? 'Change Logo' : 'Upload Logo'}
                </Button>
                <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Business Name *</Label>
              <Input
                id="name"
                {...register('name')}
                placeholder="Enter business name"
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                placeholder="business@example.com"
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>
          </div>

          {/* GST and PAN */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="gst_number">GST Number *</Label>
              <Input
                id="gst_number"
                {...register('gst_number')}
                placeholder="29ABCDE1234F1Z5"
                className="font-mono"
              />
              {errors.gst_number && (
                <p className="text-sm text-red-600">
                  {errors.gst_number.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="pan_number">PAN Number *</Label>
              <Input
                id="pan_number"
                {...register('pan_number')}
                placeholder="ABCDE1234F"
                className="font-mono"
              />
              {errors.pan_number && (
                <p className="text-sm text-red-600">
                  {errors.pan_number.message}
                </p>
              )}
            </div>
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="address">Address *</Label>
            <Textarea
              id="address"
              {...register('address')}
              placeholder="Enter complete address"
              rows={3}
            />
            {errors.address && (
              <p className="text-sm text-red-600">{errors.address.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Input id="city" {...register('city')} placeholder="Mumbai" />
              {errors.city && (
                <p className="text-sm text-red-600">{errors.city.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">State *</Label>
              <Input
                id="state"
                {...register('state')}
                placeholder="Maharashtra"
              />
              {errors.state && (
                <p className="text-sm text-red-600">{errors.state.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="pincode">Pincode *</Label>
              <Input
                id="pincode"
                {...register('pincode')}
                placeholder="400001"
              />
              {errors.pincode && (
                <p className="text-sm text-red-600">{errors.pincode.message}</p>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                {...register('phone')}
                placeholder="+91 98765 43210"
              />
              {errors.phone && (
                <p className="text-sm text-red-600">{errors.phone.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                {...register('website')}
                placeholder="https://www.example.com"
              />
              {errors.website && (
                <p className="text-sm text-red-600">{errors.website.message}</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Brief description of your business"
              rows={3}
            />
            {errors.description && (
              <p className="text-sm text-red-600">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Primary Business */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_primary"
              checked={isPrimary}
              onCheckedChange={(checked) => setValue('is_primary', !!checked)}
            />
            <Label htmlFor="is_primary" className="text-sm">
              Set as primary business
            </Label>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-4">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={isLoading || externalLoading}>
              {isLoading || externalLoading
                ? 'Saving...'
                : business
                  ? 'Update Business'
                  : 'Create Business'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
