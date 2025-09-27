import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { User, Session } from '@supabase/supabase-js'

interface AuthState {
  user: User | null
  session: Session | null
  loading: boolean
  error: string | null
}

const initialState: AuthState = {
  user: null,
  session: null,
  loading: true,
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload
    },
    setSession: (state, action: PayloadAction<Session | null>) => {
      state.session = action.payload
      state.user = action.payload?.user ?? null
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    clearAuth: (state) => {
      state.user = null
      state.session = null
      state.error = null
      state.loading = false
    },
    setAuthState: (
      state,
      action: PayloadAction<{ user: User | null; session: Session | null }>
    ) => {
      state.user = action.payload.user
      state.session = action.payload.session
      state.loading = false
      state.error = null
    },
  },
})

export const {
  setUser,
  setSession,
  setLoading,
  setError,
  clearAuth,
  setAuthState,
} = authSlice.actions

export default authSlice.reducer
