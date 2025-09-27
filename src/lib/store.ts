import { configureStore } from '@reduxjs/toolkit'
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux'
import invoiceReducer from './slices/invoice-slice'
import guestInvoiceReducer from './slices/guest-invoice-slice'
import authReducer from './slices/auth-slice'

export const store = configureStore({
  reducer: {
    invoice: invoiceReducer,
    guestInvoice: guestInvoiceReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['invoice/setLastSaved', 'guestInvoice/setLastSaved'],
        ignoredPaths: ['invoice.lastSaved', 'guestInvoice.lastSaved'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

// Typed hooks
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
