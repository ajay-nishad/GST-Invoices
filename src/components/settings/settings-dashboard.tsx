'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { SubscriptionManagement } from './subscription-management'
import {
  User,
  Building,
  CreditCard,
  Crown,
  Save,
  AlertCircle,
} from 'lucide-react'
import {
  getUserPreferences,
  updateUserPreferences,
  getUserProfile,
  updateUserProfile,
  UserPreferences,
} from '@/lib/actions/user-preferences'
import { useToast } from '@/hooks/use-toast'

export function SettingsDashboard() {
  const [activeTab, setActiveTab] = useState('profile')
  const { toast } = useToast()

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'business', label: 'Business Defaults', icon: Building },
    { id: 'billing', label: 'Billing', icon: CreditCard },
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Settings Navigation */}
      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-4 py-3 text-sm font-medium text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-indigo-50 text-indigo-700 border-r-2 border-indigo-600'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {tab.label}
                  </button>
                )
              })}
            </nav>
          </CardContent>
        </Card>
      </div>

      {/* Settings Content */}
      <div className="lg:col-span-3">
        {activeTab === 'profile' && <ProfileSettings />}
        {activeTab === 'business' && <BusinessDefaultsSettings />}
        {activeTab === 'billing' && <BillingSettings />}
      </div>
    </div>
  )
}

function ProfileSettings() {
  const [profile, setProfile] = useState({
    full_name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      const data = await getUserProfile()
      setProfile({
        full_name: data.full_name || '',
        email: data.email || '',
        phone: data.phone || '',
        address: data.address || '',
        city: data.city || '',
        state: data.state || '',
        pincode: data.pincode || '',
        country: data.country || 'India',
      })
    } catch (error) {
      console.error('Failed to load profile:', error)
      toast({
        title: 'Error',
        description: 'Failed to load profile data',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await updateUserProfile(profile)
      toast({
        title: 'Success',
        description: 'Profile updated successfully',
      })
    } catch (error) {
      console.error('Failed to update profile:', error)
      toast({
        title: 'Error',
        description: 'Failed to update profile',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-32 bg-gray-100 rounded animate-pulse"></div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="full_name">Full Name</Label>
            <Input
              id="full_name"
              value={profile.full_name}
              onChange={(e) =>
                setProfile({ ...profile, full_name: e.target.value })
              }
              placeholder="Enter your full name"
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={profile.email}
              disabled
              placeholder="Enter your email"
            />
            <p className="text-xs text-gray-500 mt-1">
              Email cannot be changed
            </p>
          </div>
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={profile.phone}
            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            placeholder="Enter your phone number"
          />
        </div>
        <div>
          <Label htmlFor="address">Address</Label>
          <Textarea
            id="address"
            value={profile.address}
            onChange={(e) =>
              setProfile({ ...profile, address: e.target.value })
            }
            placeholder="Enter your address"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              value={profile.city}
              onChange={(e) => setProfile({ ...profile, city: e.target.value })}
              placeholder="Enter your city"
            />
          </div>
          <div>
            <Label htmlFor="state">State</Label>
            <Input
              id="state"
              value={profile.state}
              onChange={(e) =>
                setProfile({ ...profile, state: e.target.value })
              }
              placeholder="Enter your state"
            />
          </div>
          <div>
            <Label htmlFor="pincode">Pincode</Label>
            <Input
              id="pincode"
              value={profile.pincode}
              onChange={(e) =>
                setProfile({ ...profile, pincode: e.target.value })
              }
              placeholder="Enter your pincode"
            />
          </div>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </CardContent>
    </Card>
  )
}

function BusinessDefaultsSettings() {
  const [preferences, setPreferences] = useState<UserPreferences | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadPreferences()
  }, [])

  const loadPreferences = async () => {
    try {
      const data = await getUserPreferences()
      setPreferences(data)
    } catch (error) {
      console.error('Failed to load preferences:', error)
      toast({
        title: 'Error',
        description: 'Failed to load business defaults',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!preferences) return

    setSaving(true)
    try {
      await updateUserPreferences(preferences)
      toast({
        title: 'Success',
        description: 'Business defaults updated successfully',
      })
    } catch (error) {
      console.error('Failed to update preferences:', error)
      toast({
        title: 'Error',
        description: 'Failed to update business defaults',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Business Defaults</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-32 bg-gray-100 rounded animate-pulse"></div>
        </CardContent>
      </Card>
    )
  }

  if (!preferences) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Business Defaults</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center text-red-600">
            <AlertCircle className="h-4 w-4 mr-2" />
            Failed to load business defaults
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Business Defaults</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Tax Settings */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Tax Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="default_tax_rate">Default Tax Rate (%)</Label>
              <Input
                id="default_tax_rate"
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={preferences.default_tax_rate}
                onChange={(e) =>
                  setPreferences({
                    ...preferences,
                    default_tax_rate: parseFloat(e.target.value) || 0,
                  })
                }
                placeholder="18.00"
              />
            </div>
            <div>
              <Label htmlFor="default_currency">Default Currency</Label>
              <Select
                value={preferences.default_currency}
                onValueChange={(value) =>
                  setPreferences({ ...preferences, default_currency: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INR">INR (₹)</SelectItem>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="EUR">EUR (€)</SelectItem>
                  <SelectItem value="GBP">GBP (£)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Separator />

        {/* Template Settings */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Invoice Template</h3>
          <div>
            <Label htmlFor="default_invoice_template">Default Template</Label>
            <Select
              value={preferences.default_invoice_template}
              onValueChange={(value) =>
                setPreferences({
                  ...preferences,
                  default_invoice_template: value,
                })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="classic">Classic</SelectItem>
                <SelectItem value="modern">Modern</SelectItem>
                <SelectItem value="minimal">Minimal</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Separator />

        {/* Invoice Settings */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Invoice Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="invoice_number_prefix">
                Invoice Number Prefix
              </Label>
              <Input
                id="invoice_number_prefix"
                value={preferences.invoice_number_prefix}
                onChange={(e) =>
                  setPreferences({
                    ...preferences,
                    invoice_number_prefix: e.target.value,
                  })
                }
                placeholder="INV"
              />
            </div>
            <div>
              <Label htmlFor="invoice_number_start">Starting Number</Label>
              <Input
                id="invoice_number_start"
                type="number"
                min="1"
                value={preferences.invoice_number_start}
                onChange={(e) =>
                  setPreferences({
                    ...preferences,
                    invoice_number_start: parseInt(e.target.value) || 1,
                  })
                }
                placeholder="1"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="auto_generate_invoice_number"
              checked={preferences.auto_generate_invoice_number}
              onCheckedChange={(checked) =>
                setPreferences({
                  ...preferences,
                  auto_generate_invoice_number: checked as boolean,
                })
              }
            />
            <Label htmlFor="auto_generate_invoice_number">
              Auto-generate invoice numbers
            </Label>
          </div>
        </div>

        <Separator />

        {/* Default Terms */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Default Terms & Conditions</h3>
          <div>
            <Label htmlFor="default_payment_terms">Payment Terms</Label>
            <Input
              id="default_payment_terms"
              value={preferences.default_payment_terms}
              onChange={(e) =>
                setPreferences({
                  ...preferences,
                  default_payment_terms: e.target.value,
                })
              }
              placeholder="Payment due within 30 days"
            />
          </div>
          <div>
            <Label htmlFor="default_notes">Default Notes</Label>
            <Textarea
              id="default_notes"
              value={preferences.default_notes || ''}
              onChange={(e) =>
                setPreferences({
                  ...preferences,
                  default_notes: e.target.value,
                })
              }
              placeholder="Enter default notes for invoices"
            />
          </div>
          <div>
            <Label htmlFor="default_terms_conditions">Terms & Conditions</Label>
            <Textarea
              id="default_terms_conditions"
              value={preferences.default_terms_conditions || ''}
              onChange={(e) =>
                setPreferences({
                  ...preferences,
                  default_terms_conditions: e.target.value,
                })
              }
              placeholder="Enter default terms and conditions"
            />
          </div>
        </div>

        <Button onClick={handleSave} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </CardContent>
    </Card>
  )
}

function BillingSettings() {
  return (
    <div className="space-y-6">
      <SubscriptionManagement />

      {/* Razorpay Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="h-5 w-5 mr-2" />
            Payment Integration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Razorpay Integration</p>
              <p className="text-sm text-gray-500">
                Payment gateway for subscription billing
              </p>
            </div>
            <Badge
              variant="outline"
              className="bg-green-50 text-green-700 border-green-200"
            >
              Connected
            </Badge>
          </div>
          <div className="text-sm text-gray-600">
            <p>• Secure payment processing</p>
            <p>• Automatic subscription management</p>
            <p>• Webhook-based status updates</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
