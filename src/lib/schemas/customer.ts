import { z } from 'zod'

export const customerSchema = z.object({
  name: z
    .string()
    .min(1, 'Customer name is required')
    .max(255, 'Customer name must be less than 255 characters'),
  gst_number: z
    .string()
    .regex(
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
      'Invalid GST number format'
    )
    .optional()
    .or(z.literal('')),
  email: z.string().email('Invalid email format'),
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .regex(/^(\+91|91)?[6-9]\d{9}$/, 'Invalid phone number format'),
  address: z
    .string()
    .min(1, 'Address is required')
    .max(500, 'Address must be less than 500 characters'),
  city: z
    .string()
    .min(1, 'City is required')
    .max(100, 'City must be less than 100 characters'),
  state: z
    .string()
    .min(1, 'State is required')
    .max(100, 'State must be less than 100 characters'),
  pincode: z
    .string()
    .min(1, 'Pincode is required')
    .regex(/^[1-9][0-9]{5}$/, 'Invalid pincode format'),
  country: z.string().default('India'),
  customer_type: z.enum(['individual', 'business']).default('individual'),
  notes: z
    .string()
    .max(1000, 'Notes must be less than 1000 characters')
    .optional(),
})

export const customerUpdateSchema = customerSchema.partial().extend({
  id: z.string().uuid('Invalid customer ID'),
})

export type CustomerFormData = z.infer<typeof customerSchema>
export type CustomerUpdateData = z.infer<typeof customerUpdateSchema>
