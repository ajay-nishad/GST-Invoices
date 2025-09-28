#!/usr/bin/env node

/**
 * Database Schema Verification Script
 *
 * This script checks if the required tables exist in your Supabase database
 * and provides instructions for applying migrations if they're missing.
 */

import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load environment variables
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables')
  console.error(
    'Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY'
  )
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const requiredTables = [
  'users',
  'subscriptions',
  'businesses',
  'customers',
  'items',
  'invoices',
  'invoice_items',
  'payments',
]

async function checkTables() {
  console.log('🔍 Checking database schema...\n')

  const missingTables = []

  for (const table of requiredTables) {
    try {
      const { data, error } = await supabase.from(table).select('*').limit(1)

      if (error && error.code === 'PGRST205') {
        missingTables.push(table)
        console.log(`❌ Table '${table}' not found`)
      } else if (error) {
        console.log(
          `⚠️  Table '${table}' exists but has issues: ${error.message}`
        )
      } else {
        console.log(`✅ Table '${table}' exists`)
      }
    } catch (err) {
      console.log(`❌ Error checking table '${table}': ${err.message}`)
      missingTables.push(table)
    }
  }

  console.log('\n📊 Summary:')
  console.log(
    `✅ Found: ${requiredTables.length - missingTables.length}/${requiredTables.length} tables`
  )

  if (missingTables.length > 0) {
    console.log(`❌ Missing: ${missingTables.length} tables`)
    console.log('\n🔧 To fix this issue:')
    console.log('1. Make sure you have the Supabase CLI installed:')
    console.log('   npm install -g supabase')
    console.log('\n2. Initialize Supabase (if not done):')
    console.log('   supabase init')
    console.log('\n3. Link to your project:')
    console.log('   supabase link --project-ref YOUR_PROJECT_REF')
    console.log('\n4. Apply migrations:')
    console.log('   supabase db push')
    console.log(
      '\n5. Or run migrations manually in your Supabase dashboard SQL editor'
    )

    // List migration files
    const migrationsDir = path.join(__dirname, '..', 'supabase', 'migrations')
    if (fs.existsSync(migrationsDir)) {
      const migrationFiles = fs
        .readdirSync(migrationsDir)
        .filter((file) => file.endsWith('.sql'))
        .sort()

      console.log('\n📁 Available migration files:')
      migrationFiles.forEach((file) => {
        console.log(`   - ${file}`)
      })
    }
  } else {
    console.log('🎉 All required tables are present!')
  }
}

async function testSubscriptionQuery() {
  console.log('\n🧪 Testing subscription query...')

  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .limit(1)

    if (error) {
      console.log(`❌ Subscription query failed: ${error.message}`)
      return false
    } else {
      console.log('✅ Subscription query successful')
      console.log(`📊 Found ${data?.length || 0} subscription records`)
      return true
    }
  } catch (err) {
    console.log(`❌ Subscription query error: ${err.message}`)
    return false
  }
}

async function main() {
  console.log('🚀 GST Invoice Database Schema Checker\n')

  await checkTables()
  await testSubscriptionQuery()

  console.log('\n✨ Check complete!')
}

main().catch(console.error)
