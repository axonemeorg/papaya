import { Color } from "@/components/ColorSwatch"

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

export type Color =
    | 'coral'
    | 'penelope'
    | 'sunday'
    | 'grimace'
    | 'blue'
    | 'ocean'
    | 'pre-teens'
    | 'eucalyptus'
    | 'moss'
    | 'sunshine'
    | 'yellow-red'
    | 'ginger-beard'
    | 'chocolate-banana'
    | 'matte'
    | 'twenty-twenty'

export const colorNamess: Record<Color, string> = {
    'coral': 'Coral',
    'penelope': 'Penelope',
    'sunday': 'Sunday',
    'grimace': 'Grimace',
    'blue': 'Blue',
    'ocean': 'Ocean',
    'pre-teens': 'Pre-teens',
    'eucalyptus': 'Eucalyptus',
    'moss': 'Moss',
    'sunshine': 'Sunshine',
    'yellow-red': 'Yellow-Red',
    'ginger-beard': 'Ginger Beard',
    'chocolate-banana': 'Chocolate Banana',
    'matte': 'Matte',
    'twenty-twenty': 'Twenty-Twenty'
}
