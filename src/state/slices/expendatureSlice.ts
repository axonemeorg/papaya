import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { IExpendature } from '@/types/app'
import type { RootState } from '@/types/state'

// Define a type for the slice state
interface IExpendaturesState {
    expendatures: IExpendature[]
}

const EXAMPLE_EXPENDATURES: IExpendature[] = [
    { id: '0', amount: 22.03, categoryId: '0', timestamp: new Date() },
    { id: '1', amount: 15.90, categoryId: '1', timestamp: new Date() },
    { id: '2', amount: 45.30, categoryId: '1', timestamp: new Date() },
    { id: '3', amount: 8.90, categoryId: '1', timestamp: new Date() },
    { id: '4', amount: 24.99, categoryId: '3', timestamp: new Date() },
    { id: '5', amount: 46.35, categoryId: '4', timestamp: new Date() },
    { id: '6', amount: 12.03, categoryId: '5', timestamp: new Date() },
    { id: '7', amount: 22, categoryId: '5', timestamp: new Date() },
    { id: '8', amount: 163.20, categoryId: '6', timestamp: new Date() },
    { id: '9', amount: 100, categoryId: '7', timestamp: new Date() },
]

// Define the initial state using that type
const initialState: IExpendaturesState = {
    expendatures: EXAMPLE_EXPENDATURES // []
}

export const expendaturesSlice = createSlice({
    name: 'expendatures',
    initialState,
    reducers: {
        create: (state, action: PayloadAction<IExpendature>) => {
            state.expendatures = [...state.expendatures, action.payload]
        },
        get: (state, action: PayloadAction<IExpendature[]>) => {
            state.expendatures = action.payload
        },
        update: (state, action: PayloadAction<IExpendature>) => {
            state.expendatures = state.expendatures.reduce((acc: IExpendature[], expendature: IExpendature) => {
                return expendature.id === action.payload.id
                    ? [...acc, action.payload]
                    : [...acc, expendature]
            }, state.expendatures)
        },
        destroy: (state, action: PayloadAction<IExpendature>) => {
            state.expendatures = state.expendatures.filter((expendature: IExpendature) => expendature.id !== action.payload.id)
        }
    }
})

export const { create, get, update, destroy } = expendaturesSlice.actions

export default expendaturesSlice.reducer
