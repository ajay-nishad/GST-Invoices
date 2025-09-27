'use server'

import { createClient } from '@/lib/supabase/server'

export async function uploadBusinessLogo(file: File, businessId?: string) {
  const supabase = await createClient()
  if (!supabase) {
    throw new Error('Database connection failed')
  }

  // Get authenticated user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()
  if (authError || !user) {
    throw new Error('Unauthorized')
  }

  try {
    // Generate unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${user.id}/${businessId || 'new'}-${Date.now()}.${fileExt}`
    const filePath = `business-logos/${fileName}`

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('business-assets')
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false,
      })

    if (error) {
      console.error('Upload error:', error)
      throw new Error('Failed to upload file')
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('business-assets')
      .getPublicUrl(filePath)

    return {
      success: true,
      url: urlData.publicUrl,
      path: filePath,
    }
  } catch (error) {
    console.error('Storage error:', error)
    throw new Error('Failed to upload file')
  }
}

export async function deleteBusinessLogo(filePath: string) {
  const supabase = await createClient()
  if (!supabase) {
    throw new Error('Database connection failed')
  }

  // Get authenticated user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()
  if (authError || !user) {
    throw new Error('Unauthorized')
  }

  try {
    const { error } = await supabase.storage
      .from('business-assets')
      .remove([filePath])

    if (error) {
      console.error('Delete error:', error)
      throw new Error('Failed to delete file')
    }

    return { success: true }
  } catch (error) {
    console.error('Storage error:', error)
    throw new Error('Failed to delete file')
  }
}
