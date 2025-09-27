import { z } from 'zod'

export const itemSchema = z.object({
  name: z
    .string()
    .min(1, 'Item name is required')
    .max(255, 'Item name must be less than 255 characters'),
  description: z
    .string()
    .max(1000, 'Description must be less than 1000 characters')
    .optional(),
  hsn_sac_code: z
    .string()
    .min(1, 'HSN/SAC code is required')
    .regex(/^[0-9]{4,8}$/, 'HSN/SAC code must be 4-8 digits'),
  price: z
    .number()
    .min(0, 'Price must be positive')
    .max(999999.99, 'Price must be less than ₹10,00,000'),
  tax_rate: z
    .number()
    .min(0, 'Tax rate must be positive')
    .max(100, 'Tax rate must be less than 100%'),
  unit: z
    .string()
    .min(1, 'Unit is required')
    .max(50, 'Unit must be less than 50 characters'),
  category: z
    .string()
    .max(100, 'Category must be less than 100 characters')
    .optional(),
  is_active: z.boolean().default(true),
})

export const itemUpdateSchema = itemSchema.partial().extend({
  id: z.string().uuid('Invalid item ID'),
})

export type ItemFormData = z.infer<typeof itemSchema>
export type ItemUpdateData = z.infer<typeof itemUpdateSchema>
