import { configureStore } from '@reduxjs/toolkit'
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux'
import invoiceReducer from './slices/invoice-slice'
import guestInvoiceReducer from './slices/guest-invoice-slice'
import authReducer from './slices/auth-slice'

// Minimal store configuration to isolate the issue
export function createStore() {
  return configureStore({
    reducer: {
      invoice: invoiceReducer,
      guestInvoice: guestInvoiceReducer,
      auth: authReducer,
    },
    // Use minimal middleware configuration
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
    devTools: process.env.NODE_ENV !== 'production', // enable devtools only in dev
  })
}

export const store = createStore()

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
