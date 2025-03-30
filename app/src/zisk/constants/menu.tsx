import { AccountBalance, Category, ReceiptLong, Settings } from '@mui/icons-material'
import { ReactNode } from 'react'

export type NavMenuItem = {
	icon: ReactNode
	label: string
	description: string
	to: string
	disabled?: boolean
	hidden?: boolean
}

export const APP_MENU = [
	{
		icon: <ReceiptLong fontSize="small" />,
		label: 'Journal',
		description: 'Organize your expenses',
		to: '/journal'
	},
	// {
	// 	icon: <Insights fontSize="small" />,
	// 	label: 'Analyze',
	// 	description: 'Understand your spending',
	// 	// disabled: true,
	// 	pathPattern: /\/analyze(\/.*)?$/,
	// },
	{
		icon: <Category fontSize="small" />,
		label: 'Categories',
		description: 'Create spending categories',
		to: '/categories'
	},
	{
		icon: <AccountBalance fontSize="small" />,
		label: 'Accounts and Transfers',
		description: 'Manage accounts and transfers',
		to: '/accounts',
	},
	{
		icon: <Settings fontSize="small" />,
		label: 'Settings',
		description: 'Manage journals and edit Zisk settings',
		to: '/settings'
	},
]
