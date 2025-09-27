import { NextResponse } from 'next/server'
import { config, isDevelopment } from '@/lib/config'

/**
 * API route to demonstrate server-side environment variable usage
 * This route shows how to safely access environment variables on the server
 */
export async function GET() {
  try {
    // ✅ Safe to use server-side environment variables here
    const environmentInfo = {
      environment: config.app.env,
      isDevelopment,
      isProduction: config.app.isProduction,
      port: config.app.port,

      // Only expose public configuration to client
      publicConfig: {
        supabaseUrl: config.supabase.url,
        // Don't expose secrets like service role key or Razorpay keys
      },

      // Server-only information (not sent to client)
      serverOnly: {
        hasSupabaseServiceKey: !!config.supabase.serviceRoleKey,
        hasRazorpayConfig:
          !!config.razorpay.keyId && !!config.razorpay.keySecret,
      },
    }

    return NextResponse.json({
      success: true,
      data: environmentInfo,
      message: 'Environment configuration loaded successfully',
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to load environment configuration',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
