# Environment Configuration

This project uses a centralized environment configuration system with Zod validation to ensure type safety and proper validation of environment variables.

## Files Structure

```
src/
├── env.ts              # Main environment configuration
├── env.client.ts       # Client-side environment variables
├── env.server.ts       # Server-side environment variables
└── lib/
    ├── config.ts       # Configuration utilities
    ├── supabase.ts     # Supabase client setup
    ├── razorpay.ts     # Razorpay client setup
    └── env-demo.ts     # Usage examples
```

## Environment Variables

### Required Variables

| Variable                        | Description               | Client/Server |
| ------------------------------- | ------------------------- | ------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Supabase project URL      | Both          |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key    | Both          |
| `SUPABASE_SERVICE_ROLE_KEY`     | Supabase service role key | Server only   |
| `RAZORPAY_KEY_ID`               | Razorpay key ID           | Server only   |
| `RAZORPAY_KEY_SECRET`           | Razorpay key secret       | Server only   |

### Optional Variables

| Variable   | Description      | Default       |
| ---------- | ---------------- | ------------- |
| `NODE_ENV` | Environment mode | `development` |
| `PORT`     | Server port      | `3000`        |

## Usage

### 1. Client-Side Components

```typescript
import { clientEnv } from '@/env.client'
// or
import { config } from '@/lib/config'

function ClientComponent() {
  // ✅ Safe to use in client components
  const supabaseUrl = clientEnv.NEXT_PUBLIC_SUPABASE_URL
  const supabaseUrlFromConfig = config.supabase.url

  return <div>Supabase URL: {supabaseUrl}</div>
}
```

### 2. Server-Side Code (API Routes, Server Components)

```typescript
import { serverEnv } from '@/env.server'
// or
import { config } from '@/lib/config'

export async function serverAction() {
  // ✅ Safe to use in server-side code
  const razorpayKeyId = serverEnv.RAZORPAY_KEY_ID
  const serviceKey = config.supabase.serviceRoleKey

  // Use the variables...
}
```

### 3. Using Pre-configured Clients

```typescript
// Supabase client (works in both client and server)
import { supabase } from '@/lib/supabase'

// Razorpay client (server-side only)
import { razorpay } from '@/lib/razorpay'
```

## Setup Instructions

1. **Copy the example file:**

   ```bash
   cp .env.example .env.local
   ```

2. **Fill in your actual values:**

   ```bash
   # Edit .env.local with your actual credentials
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_actual_service_role_key
   RAZORPAY_KEY_ID=your_actual_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_actual_razorpay_key_secret
   ```

3. **Restart your development server:**
   ```bash
   npm run dev
   ```

## Validation

The environment variables are validated at build time and runtime using Zod schemas. If any required variables are missing or invalid, the application will throw a descriptive error message.

### Error Example

```
❌ Invalid environment variables:
NEXT_PUBLIC_SUPABASE_URL: Invalid Supabase URL
RAZORPAY_KEY_ID: Razorpay key ID is required

💡 Please check your .env file and ensure all required variables are set.
📋 See .env.example for reference.
```

## Security Notes

- **Never commit `.env.local`** - it's already in `.gitignore`
- **Client variables** (prefixed with `NEXT_PUBLIC_`) are exposed to the browser
- **Server variables** are only available in server-side code
- **Use the appropriate import** (`env.client.ts` vs `env.server.ts`) based on your context

## Testing

You can test the environment configuration by:

1. **Visiting the config API:** `http://localhost:3000/api/config`
2. **Checking the console** for validation messages
3. **Running the build:** `npm run build` (will fail if env vars are missing)

## Troubleshooting

### Common Issues

1. **"Invalid environment variables" error:**
   - Check that all required variables are set in `.env.local`
   - Verify the format of URLs and keys

2. **"Cannot find module" error:**
   - Make sure you're using the correct import (`@/env.client` vs `@/env.server`)
   - Check that the file paths are correct

3. **Build failures:**
   - Ensure all environment variables are properly set
   - Check for typos in variable names
   - Verify the `.env.local` file exists and is readable
