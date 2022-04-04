import { configureStore } from '@reduxjs/toolkit'

import categoriesReducer from '@/state/slices/categorySlice'
import budgetsReducer from '@/state/slices/budgetSlice'
import expendaturesReducer from '@/state/slices/expendatureSlice'
import investmentsReducer from '@/state/slices/investmentSlice'

const store = configureStore({
	reducer: {
		budgets: budgetsReducer,
		categories: categoriesReducer,
		expendatures: expendaturesReducer,
		investments: investmentsReducer
	},
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

export default store