import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { Budget } from '@/types/app'
import type { RootState } from '@/types/state'

// Define a type for the slice state
interface IBudgetsState {
    budgets: Budget[]
}

const EXAMPLE_BUDGETS: Budget[] = [
    { id: '0', categoryId: '0', type: 'absolute', amount: 30 },
    { id: '1', categoryId: '1', type: 'savings', quota: 1600 },
    { id: '2', categoryId: '2', type: 'absolute', amount: 240 },
    { id: '3', categoryId: '3', type: 'absolute', amount: 100 },
    { id: '4', categoryId: '4', type: 'absolute', amount: 200 },
    { id: '5', categoryId: '5', type: 'absolute', amount: 100 },
    { id: '6', categoryId: '6', type: 'absolute', amount: 50 },
    { id: '7', categoryId: '7', type: 'absolute', amount: 200 },
]

// Define the initial state using that type
const initialState: IBudgetsState = {
    budgets: EXAMPLE_BUDGETS // []
}

export const budgetsSlice = createSlice({
    name: 'budgets',
    initialState,
    reducers: {
        create: (state, action: PayloadAction<Budget>) => {
            state.budgets = [...state.budgets, action.payload]
        },
        get: (state, action: PayloadAction<Budget[]>) => {
            state.budgets = action.payload
        },
        update: (state, action: PayloadAction<Budget>) => {
            state.budgets = state.budgets.reduce((acc: Budget[], budget: Budget) => {
                return budget.id === action.payload.id
                    ? [...acc, action.payload]
                    : [...acc, budget]
            }, state.budgets)
        },
        destroy: (state, action: PayloadAction<Budget>) => {
            state.budgets = state.budgets.filter((budget: Budget) => budget.id !== action.payload.id)
        }
    }
})

export const { create, get, update, destroy } = budgetsSlice.actions

export default budgetsSlice.reducer
