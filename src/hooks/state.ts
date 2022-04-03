import {
    TypedUseSelectorHook,
    useDispatch as useGenericDispatch,
    useSelector as useGenericSelector
} from 'react-redux'

import type { RootState, AppDispatch } from '@/state/store'

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useDispatch = () => useGenericDispatch<AppDispatch>()
export const useSelector: TypedUseSelectorHook<RootState> = useGenericSelector
