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

import { Budget, IAbsoluteBudget, ICategory } from '@/types/app'
import { makeDollars } from '@/utils/string'

import CategoryList from '@/components/CatagoryList'
import ColorText from '@/components/ColorText'
import ItemCreator from '@/components/ItemCreator'

const calculateSpending = (categoryId: string, budgets: Budget[]): number => {
    return budgets.filter((budget: Budget) => budget.categoryId === categoryId)
        .reduce((acc: number, budget: IAbsoluteBudget) => {
            return acc + budget.amount
        }, 0)
}

const HomePage = () => {
    const [income, setIncome] = React.useState(4000)
    const [showBreakdown, setShowBreakdown] = React.useState(true)

    const categories = []

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
                                {`${makeDollars(calculateSpending(category.id, []))} `}
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
            <CategoryList />

            <ItemCreator />
        </div>
    )
}

export default HomePage
