import React from 'react'

import {
    AppBar,
    Button,
    Collapse,
    Fab,
    Icon,
    Menu,
    MenuItem,
    Typography
} from '@mui/material'

import { Budget, IAbsoluteBudget, ICategory } from '../types'
import CategoryList from '../components/CatagoryList'
import ColorText from '../components/ColorText'
import ItemCreator from '../components/ItemCreator'

// import { colors } from '../components/ColorSwatch'

const categories : ICategory[] = [
    { id: '0', name: 'Books', color: 'eucalyptus' },
    { id: '1', name: 'Tuition', color: 'pre-teens' },
    { id: '2', name: 'Restaurant & Takeout', color: 'yellow-red' },
    { id: '3', name: 'Girlfriend Tax', color: 'coral' },
    { id: '4', name: 'Groceries', color: 'blue' },
    { id: '5', name: 'Misc.', color: 'twenty-twenty' },
    { id: '6', name: 'Clothes', color: 'chocolate-banana' },
    { id: '7', name: 'Gas', color: 'moss' },
]

const budgets: Budget[] = [
    { categoryId: '0', type: 'absolute', amount: 30 },
    { categoryId: '1', type: 'absolute', amount: 1600 },
    { categoryId: '2', type: 'absolute', amount: 240 },
    { categoryId: '3', type: 'absolute', amount: 100 },
    { categoryId: '4', type: 'absolute', amount: 200 },
    { categoryId: '5', type: 'absolute', amount: 100 },
    { categoryId: '6', type: 'absolute', amount: 50 },
    { categoryId: '7', type: 'absolute', amount: 200 },
]

const makeDollars = (d: number): string => {
    return d % 1 === 0
        ? `$${d}`
        : `$${Math.round(d * 100) / 100}`
}

const calculateSpending = (categoryId: string, budgets: Budget[]): number => {
    return budgets.filter((budget: Budget) => budget.categoryId === categoryId)
        .reduce((acc: number, budget: IAbsoluteBudget) => {
            return acc + budget.amount
        }, 0)
}

const HomePage = () => {
    const [income, setIncome] = React.useState(4000)
    const [showBreakdown, setShowBreakdown] = React.useState(true)

    return (
        <div>
            <AppBar>Budgeting</AppBar>
            <Typography variant='overline'>Income</Typography>
            <Typography variant='h2'>{`+${makeDollars(income)}`}</Typography>
            <Typography variant='overline'>Total Spending Limit</Typography>
            <Collapse in={showBreakdown} component='ul'>
                {categories.map((category: ICategory) => (
                    <li style={{ display: 'flex', alignItems: 'baseline'}}>
                        <Typography variant='h2'>
                            <ColorText colorString={category.color}>
                                {`${makeDollars(calculateSpending(category.id, budgets))} `}
                            </ColorText>
                        </Typography>
                        <Typography variant='h6' color='#999'>
                            {`on ${category.name}`}
                        </Typography>
                    </li>
                ))}
            </Collapse>
            <Typography variant='h2'>{`-${makeDollars(1)}`}</Typography>
            <Typography variant='overline'>Savings</Typography>
            <Typography variant='h2'>{`≥${makeDollars(income - 1)}`}</Typography>
            <CategoryList categories={categories} />

            <ItemCreator />
        </div>
    )
}

export default HomePage
