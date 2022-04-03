import { Color } from "./components/ColorSwatch"

export interface ICategory {
    id: string
    name: string
    color: Color
    description?: string
    // budgets: Budget[]
}

export interface IBudget {
    categoryId: string
    memo?: string
}

export interface IPercentageBudget extends IBudget {
    type: 'percentage'
    percentage: number
}

export interface IAbsoluteBudget extends IBudget {
    type: 'absolute'
    amount: number
}

export interface IOccuranceBudget extends IBudget {
    type: 'occurance'
    value: number
}

export type Budget = IPercentageBudget | IAbsoluteBudget | IOccuranceBudget

export interface IExpendature {
    amount: number
    categoryId: string
}
