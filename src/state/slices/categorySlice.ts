import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { ICategory } from '@/types/app'
import type { RootState } from '@/types/state'

// Define a type for the slice state
interface ICategoriesState {
    categories: ICategory[]
}

const EXAMPLE_CATEGORIES: ICategory[] = [
    { id: '0', name: 'Books', color: 'eucalyptus' },
    { id: '1', name: 'Tuition', color: 'pre-teens' },
    { id: '2', name: 'Restaurant & Takeout', color: 'yellow-red' },
    { id: '3', name: 'Girlfriend Tax', color: 'coral' },
    { id: '4', name: 'Groceries', color: 'blue' },
    { id: '5', name: 'Misc.', color: 'twenty-twenty' },
    { id: '6', name: 'Clothes', color: 'chocolate-banana' },
    { id: '7', name: 'Gas', color: 'moss' },
]

// Define the initial state using that type
const initialState: ICategoriesState = {
    categories: EXAMPLE_CATEGORIES // []
}

export const categoriesSlice = createSlice({
    name: 'categories',
    initialState,
    reducers: {
        create: (state, action: PayloadAction<ICategory>) => {
            state.categories = [...state.categories, action.payload]
        },
        get: (state, action: PayloadAction<ICategory[]>) => {
            state.categories = action.payload
        },
        update: (state, action: PayloadAction<ICategory>) => {
            state.categories = state.categories.reduce((acc: ICategory[], category: ICategory) => {
                return category.id === action.payload.id
                    ? [...acc, action.payload]
                    : [...acc, category]
            }, state.categories)
        },
        destroy: (state, action: PayloadAction<ICategory>) => {
            state.categories = state.categories.filter((category: ICategory) => category.id !== action.payload.id)
        }
    }
})

export const { create, get, update, destroy } = categoriesSlice.actions

export default categoriesSlice.reducer
