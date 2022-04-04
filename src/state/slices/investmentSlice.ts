import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { IInvestment } from '@/types/app'
import type { RootState } from '@/types/state'

// Define a type for the slice state
interface IInvestmentsState {
    investments: IInvestment[]
}

const EXAMPLE_INVESTMENTS: IInvestment[] = [
    { id: '0', categoryId: '1', amount: 1500 },
]

// Define the initial state using that type
const initialState: IInvestmentsState = {
    investments: EXAMPLE_INVESTMENTS // []
}

export const investmentsSlice = createSlice({
    name: 'investments',
    initialState,
    reducers: {
        create: (state, action: PayloadAction<IInvestment>) => {
            state.investments = [...state.investments, action.payload]
        },
        get: (state, action: PayloadAction<IInvestment[]>) => {
            state.investments = action.payload
        },
        update: (state, action: PayloadAction<IInvestment>) => {
            state.investments = state.investments.reduce((acc: IInvestment[], investment: IInvestment) => {
                return investment.id === action.payload.id
                    ? [...acc, action.payload]
                    : [...acc, investment]
            }, state.investments)
        },
        destroy: (state, action: PayloadAction<IInvestment>) => {
            state.investments = state.investments.filter((investment: IInvestment) => investment.id !== action.payload.id)
        }
    }
})

export const { create, get, update, destroy } = investmentsSlice.actions

export default investmentsSlice.reducer
