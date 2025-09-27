'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Building2,
  MoreHorizontal,
  Edit,
  Trash2,
  Plus,
  MapPin,
  Phone,
  Mail,
  Globe,
} from 'lucide-react'
import { getBusinesses, deleteBusiness } from '@/lib/actions/business'
import { BusinessForm } from './business-form'
import { EmptyState } from '@/components/common/empty-state'
import { LoadingSpinner } from '@/components/common/loading-spinner'

export interface Business {
  id: string
  name: string
  gst_number: string
  pan_number: string
  address: string
  city: string
  state: string
  pincode: string
  country: string
  phone: string
  email: string
  website: string
  description: string
  is_primary: boolean
  is_active: boolean
  logo_url: string
  created_at: string
  updated_at: string
}

interface BusinessTableProps {
  businesses?: Business[]
  onEdit?: (business: Business) => void
  onDelete?: (businessId: string) => Promise<void>
  isDeleting?: boolean
}

export function BusinessTable({
  businesses: propBusinesses,
  onEdit,
  onDelete,
  isDeleting,
}: BusinessTableProps = {}) {
  const [businesses, setBusinesses] = useState<Business[]>(propBusinesses || [])
  const [loading, setLoading] = useState(!propBusinesses)
  const [editingBusiness, setEditingBusiness] = useState<Business | null>(null)
  const [showForm, setShowForm] = useState(false)
  const router = useRouter()

  const fetchBusinesses = async () => {
    try {
      setLoading(true)
      const data = await getBusinesses()
      setBusinesses(data)
    } catch (error) {
      console.error('Failed to fetch businesses:', error)
      // Fallback to mock data for development
      const mockBusinesses: Business[] = [
        {
          id: '1',
          name: 'Acme Corporation',
          gst_number: '29ABCDE1234F1Z5',
          pan_number: 'ABCDE1234F',
          address: '123 Business Street, Andheri West',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400058',
          country: 'India',
          phone: '+91 98765 43210',
          email: 'contact@acmecorp.com',
          website: 'https://acmecorp.com',
          description: 'Leading technology solutions provider',
          is_primary: true,
          is_active: true,
          logo_url: '',
          created_at: '2024-01-01T10:00:00Z',
          updated_at: '2024-01-01T10:00:00Z',
        },
      ]
      setBusinesses(mockBusinesses)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!propBusinesses) {
      fetchBusinesses()
    }
  }, [propBusinesses])

  const handleEdit = (business: Business) => {
    if (onEdit) {
      onEdit(business)
      return
    }
    setEditingBusiness(business)
    setShowForm(true)
  }

  const handleDelete = async (businessId: string) => {
    if (onDelete) {
      await onDelete(businessId)
      return
    }
    if (
      confirm(
        'Are you sure you want to delete this business? This action cannot be undone.'
      )
    ) {
      try {
        await deleteBusiness(businessId)
        await fetchBusinesses()
      } catch (error) {
        console.error('Failed to delete business:', error)
        alert('Failed to delete business. Please try again.')
      }
    }
  }

  const handleFormSuccess = () => {
    setShowForm(false)
    setEditingBusiness(null)
    fetchBusinesses()
  }

  const handleFormCancel = () => {
    setShowForm(false)
    setEditingBusiness(null)
  }

  if (loading) {
    return <LoadingSpinner />
  }

  if (showForm) {
    return (
      <BusinessForm
        business={editingBusiness}
        onSuccess={handleFormSuccess}
        onCancel={handleFormCancel}
      />
    )
  }

  if (businesses.length === 0) {
    return (
      <EmptyState
        icon={Building2}
        title="No businesses found"
        description="Get started by adding your first business profile."
        action={{
          label: 'Add Business',
          onClick: () => setShowForm(true),
        }}
      />
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Building2 className="h-5 w-5 mr-2" />
            Businesses ({businesses.length})
          </CardTitle>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Business
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Business</TableHead>
              <TableHead>GST Number</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {businesses.map((business) => (
              <TableRow key={business.id}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    {business.logo_url ? (
                      <img
                        src={business.logo_url}
                        alt={business.name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-gray-500" />
                      </div>
                    )}
                    <div>
                      <div className="font-medium">{business.name}</div>
                      {business.is_primary && (
                        <Badge variant="default" className="text-xs">
                          Primary
                        </Badge>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-mono text-sm">
                      {business.gst_number}
                    </div>
                    <div className="text-xs text-gray-500">
                      PAN: {business.pan_number}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-1 text-sm">
                    <MapPin className="h-3 w-3 text-gray-400" />
                    <span>
                      {business.city}, {business.state}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    {business.phone && (
                      <div className="flex items-center space-x-1 text-sm">
                        <Phone className="h-3 w-3 text-gray-400" />
                        <span>{business.phone}</span>
                      </div>
                    )}
                    {business.email && (
                      <div className="flex items-center space-x-1 text-sm">
                        <Mail className="h-3 w-3 text-gray-400" />
                        <span>{business.email}</span>
                      </div>
                    )}
                    {business.website && (
                      <div className="flex items-center space-x-1 text-sm">
                        <Globe className="h-3 w-3 text-gray-400" />
                        <span className="truncate max-w-32">
                          {business.website}
                        </span>
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={business.is_active ? 'default' : 'secondary'}>
                    {business.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(business)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => handleDelete(business.id)}
                        disabled={isDeleting}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
