# Authentication System

This project implements a complete authentication system using Supabase Auth with both client-side and server-side support.

## Architecture

### Client-Side Authentication

- **AuthProvider**: React context provider that manages user session state
- **useAuth()**: Hook for accessing authentication methods and user state
- **useUser()**: Convenience hook for user data only
- **useSession()**: Convenience hook for session data only

### Server-Side Authentication

- **Server Components**: Use `requireUser()` or `requireUserWithProfile()` for protected routes
- **API Routes**: Use `getUser()` or `getUserWithProfile()` for optional authentication
- **Middleware**: Built-in session management with cookies

## File Structure

```
src/
├── lib/
│   ├── supabase/
│   │   ├── browser.ts          # Client-side Supabase client
│   │   └── server.ts           # Server-side Supabase clients
│   └── auth.ts                 # Server-side auth utilities
├── providers/
│   └── auth-provider.tsx       # React context provider
└── components/
    ├── login-form.tsx          # Login form component
    ├── signup-form.tsx         # Signup form component
    ├── logout-button.tsx       # Logout button component
    └── auth-buttons.tsx        # Conditional auth buttons
```

## Usage Examples

### Client-Side Components

```typescript
import { useAuth, useUser } from '@/providers/auth-provider'

function MyComponent() {
  const { user, loading, signOut } = useAuth()
  const { user: userData } = useUser() // Alternative syntax

  if (loading) return <div>Loading...</div>
  if (!user) return <div>Please sign in</div>

  return (
    <div>
      <p>Welcome, {user.email}!</p>
      <button onClick={signOut}>Sign Out</button>
    </div>
  )
}
```

### Server Components (Protected Routes)

```typescript
import { requireUserWithProfile } from '@/lib/auth'

export default async function ProtectedPage() {
  // This will redirect to login if not authenticated
  const { user, profile } = await requireUserWithProfile()

  return (
    <div>
      <h1>Welcome, {profile?.full_name || user.email}!</h1>
    </div>
  )
}
```

### Server Components (Optional Auth)

```typescript
import { getCurrentUser } from '@/lib/auth'

export default async function OptionalAuthPage() {
  const user = await getCurrentUser()

  return (
    <div>
      {user ? (
        <p>Welcome back, {user.email}!</p>
      ) : (
        <p>Please sign in to access more features</p>
      )}
    </div>
  )
}
```

### API Routes

```typescript
import { getUser } from '@/lib/supabase/server'

export async function GET() {
  const user = await getUser()

  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return Response.json({ user })
}
```

## Authentication Flow

1. **Sign Up**: User creates account → Email confirmation → Profile created
2. **Sign In**: User enters credentials → Session created → Redirect to dashboard
3. **Session Management**: Automatic token refresh and persistence
4. **Sign Out**: Session cleared → Redirect to home page

## Database Schema

The authentication system expects the following Supabase tables:

### `profiles` table

```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);
```

## Environment Variables

Required environment variables for authentication:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## Security Features

- **Row Level Security (RLS)**: Database-level security policies
- **JWT Tokens**: Secure session management
- **PKCE Flow**: Enhanced security for authentication
- **Server-Side Validation**: All auth checks happen on the server
- **Type Safety**: Full TypeScript support with proper types

## Routes

### Public Routes

- `/` - Home page (shows auth buttons)
- `/auth/login` - Login page
- `/auth/signup` - Signup page

### Protected Routes

- `/dashboard` - Main dashboard (requires authentication)

### API Routes

- `/api/config` - Environment configuration (server-side only)

## Error Handling

The authentication system includes comprehensive error handling:

- **Network errors**: Graceful fallbacks and retry logic
- **Validation errors**: User-friendly error messages
- **Session errors**: Automatic cleanup and redirect
- **Type errors**: Compile-time type checking

## Development

### Testing Authentication

1. **Start the development server**: `npm run dev`
2. **Visit**: `http://localhost:3000`
3. **Sign up**: Create a new account
4. **Check email**: Confirm your email address
5. **Sign in**: Use your credentials
6. **Access dashboard**: Should redirect to `/dashboard`

### Debugging

- Check browser console for client-side errors
- Check server logs for server-side errors
- Use the debug section on the dashboard page
- Verify environment variables are set correctly

## Production Considerations

- **Email Templates**: Customize Supabase email templates
- **Domain Configuration**: Set up custom domains in Supabase
- **Rate Limiting**: Implement rate limiting for auth endpoints
- **Monitoring**: Set up error tracking and monitoring
- **Backup**: Regular database backups
