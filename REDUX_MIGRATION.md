# Redux Migration Guide

This project has been migrated from React's `useReducer` to Redux Toolkit with slices for better state management.

## What's New

### Redux Store Configuration

- **Location**: `src/lib/store.ts`
- **Features**:
  - Configured with Redux Toolkit
  - TypeScript support with typed hooks
  - Redux DevTools integration
  - Serializable check configuration for Date objects

### Redux Slices

#### 1. Invoice Slice (`src/lib/slices/invoice-slice.ts`)

- Manages authenticated user invoice state
- Includes `isDirty` flag for tracking changes
- Auto-calculates totals when items are modified

#### 2. Guest Invoice Slice (`src/lib/slices/guest-invoice-slice.ts`)

- Manages guest user invoice state
- No `isDirty` flag (simpler state)
- Auto-calculates totals when items are modified

#### 3. Auth Slice (`src/lib/slices/auth-slice.ts`)

- Manages authentication state
- Replaces the previous Context API approach
- Includes error handling and loading states

### Redux-Based Hooks

#### Invoice Management

- **`useReduxInvoiceState()`**: For authenticated users
- **`useReduxGuestInvoiceState()`**: For guest users (includes localStorage persistence)

#### Authentication

- **`useReduxAuth()`**: Complete auth functionality
- **`useReduxUser()`**: Just user data
- **`useReduxSession()`**: Just session data

### Providers

- **`ReduxProvider`**: Main Redux store provider
- **`ReduxAuthProvider`**: Initializes auth state

## Migration Benefits

1. **Better DevTools**: Full Redux DevTools support for debugging
2. **Time-travel debugging**: See state changes over time
3. **Better performance**: Optimized selectors and updates
4. **Easier testing**: Redux Toolkit's testing utilities
5. **Type safety**: Full TypeScript support
6. **Predictable updates**: Immutable state updates with Immer

## Backward Compatibility

The old hooks (`useInvoiceState`, `useGuestInvoiceState`, `useAuth`) are still available and functional. The new Redux-based hooks can be used alongside them during migration.

## Usage Examples

### Using Redux Invoice State

```typescript
import { useReduxInvoiceState } from '@/hooks/use-redux-invoice-state'

function InvoiceForm() {
  const { state, setBusiness, setCustomer, addItem } = useReduxInvoiceState()

  // Use state.business, state.customer, etc.
  // Call setBusiness(), setCustomer(), addItem() as needed
}
```

### Using Redux Auth

```typescript
import { useReduxAuth } from '@/hooks/use-redux-auth'

function AuthComponent() {
  const { user, loading, signOut } = useReduxAuth()

  if (loading) return <div>Loading...</div>
  if (!user) return <div>Not authenticated</div>

  return <button onClick={signOut}>Sign Out</button>
}
```

### Using Redux Guest Invoice State

```typescript
import { useReduxGuestInvoiceState } from '@/hooks/use-redux-guest-invoice-state'

function GuestInvoiceForm() {
  const { state, addItem, clearStorage } = useReduxGuestInvoiceState()

  // State is automatically persisted to localStorage
  // Call clearStorage() to reset and clear localStorage
}
```

## Next Steps

1. **Gradual Migration**: Start using Redux hooks in new components
2. **Component Updates**: Update existing components one by one
3. **Remove Old Hooks**: Once migration is complete, remove the old useReducer-based hooks
4. **Performance Optimization**: Add selectors for better performance if needed

## Redux DevTools

Install the Redux DevTools browser extension to get full debugging capabilities:

- **Chrome**: Redux DevTools Extension
- **Firefox**: Redux DevTools Extension

The store is configured to enable DevTools in development mode.
