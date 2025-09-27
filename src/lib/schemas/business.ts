import { z } from 'zod'

export const businessSchema = z.object({
  name: z
    .string()
    .min(1, 'Business name is required')
    .max(255, 'Business name must be less than 255 characters'),
  gst_number: z
    .string()
    .min(1, 'GST number is required')
    .regex(
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
      'Invalid GST number format'
    ),
  pan_number: z
    .string()
    .min(1, 'PAN number is required')
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN number format'),
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
  country: z.string().min(1, 'Country is required').default('India'),
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .regex(/^(\+91|91)?[6-9]\d{9}$/, 'Invalid phone number format'),
  email: z.string().email('Invalid email format'),
  website: z.string().optional(),
  description: z.string().optional(),
  is_primary: z.boolean().default(false),
  logo_url: z.string().optional(),
})

export const businessUpdateSchema = businessSchema.partial().extend({
  id: z.string().uuid('Invalid business ID'),
})

export type BusinessFormData = z.infer<typeof businessSchema>
export type BusinessUpdateData = z.infer<typeof businessUpdateSchema>
