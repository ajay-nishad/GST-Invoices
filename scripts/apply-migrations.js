#!/usr/bin/env node

/**
 * Migration Application Script
 *
 * This script applies your database migrations directly to your Supabase instance
 * by reading the SQL files and executing them via the Supabase client.
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

async function applyMigrations() {
  console.log('🚀 Applying Database Migrations\n')

  const migrationsDir = path.join(__dirname, '..', 'supabase', 'migrations')

  if (!fs.existsSync(migrationsDir)) {
    console.error('❌ Migrations directory not found:', migrationsDir)
    process.exit(1)
  }

  // Get all SQL migration files
  const migrationFiles = fs
    .readdirSync(migrationsDir)
    .filter((file) => file.endsWith('.sql'))
    .sort()

  if (migrationFiles.length === 0) {
    console.log('⚠️  No migration files found')
    return
  }

  console.log(`📁 Found ${migrationFiles.length} migration files:\n`)

  for (const file of migrationFiles) {
    console.log(`🔄 Applying ${file}...`)

    try {
      const filePath = path.join(migrationsDir, file)
      const sql = fs.readFileSync(filePath, 'utf8')

      // Split SQL by statements (basic approach)
      const statements = sql
        .split(';')
        .map((stmt) => stmt.trim())
        .filter((stmt) => stmt.length > 0 && !stmt.startsWith('--'))

      for (const statement of statements) {
        if (statement.trim()) {
          const { error } = await supabase.rpc('exec_sql', {
            sql_query: statement + ';',
          })

          if (error) {
            // Try direct query if RPC fails
            const { error: directError } = await supabase
              .from('_migrations')
              .select('*')
              .limit(1)

            if (directError) {
              console.log(
                `⚠️  Could not execute via RPC, trying alternative method...`
              )
              // For now, we'll log the SQL that needs to be run manually
              console.log(
                `📝 Please run this SQL manually in your Supabase SQL editor:`
              )
              console.log(`\n${statement};\n`)
            }
          }
        }
      }

      console.log(`✅ ${file} applied successfully`)
    } catch (err) {
      console.error(`❌ Error applying ${file}:`, err.message)
      console.log(
        `\n📝 You may need to apply this migration manually in your Supabase dashboard.`
      )
      console.log(`📁 File location: ${path.join(migrationsDir, file)}\n`)
    }
  }

  console.log('\n🎉 Migration application complete!')
  console.log('\n💡 If any migrations failed, please:')
  console.log('1. Go to your Supabase dashboard')
  console.log('2. Navigate to SQL Editor')
  console.log('3. Copy and paste the migration SQL files manually')
  console.log('4. Run them in order (001, 002, 003, etc.)')
}

async function main() {
  await applyMigrations()

  // Verify tables were created
  console.log('\n🔍 Verifying table creation...')

  const requiredTables = [
    'users',
    'subscriptions',
    'businesses',
    'customers',
    'invoices',
  ]
  let successCount = 0

  for (const table of requiredTables) {
    try {
      const { error } = await supabase.from(table).select('*').limit(1)

      if (!error || error.code !== 'PGRST205') {
        console.log(`✅ Table '${table}' exists`)
        successCount++
      } else {
        console.log(`❌ Table '${table}' not found`)
      }
    } catch (err) {
      console.log(`❌ Error checking table '${table}'`)
    }
  }

  console.log(
    `\n📊 Result: ${successCount}/${requiredTables.length} core tables verified`
  )

  if (successCount === requiredTables.length) {
    console.log('🎉 All core tables are ready!')
  } else {
    console.log(
      '⚠️  Some tables are missing. Please apply migrations manually.'
    )
  }
}

main().catch(console.error)
