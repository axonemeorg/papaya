'use client'

import CategoryForm from '@/components/form/CategoryForm'
import AvatarIcon from '@/components/icon/AvatarIcon'
import { DEFAULT_AVATAR } from '@/components/pickers/AvatarPicker'
import { JournalContext } from '@/contexts/JournalContext'
import { NotificationsContext } from '@/contexts/NotificationsContext'
import { createCategory, deleteCategory, undeleteCategory, updateCategory } from '@/database/actions'
import { Category, CreateCategory } from '@/types/schema'
import { pluralize as p } from '@/utils/string'
import { zodResolver } from '@hookform/resolvers/zod'
import { Add, Save, Search } from '@mui/icons-material'
import {
	Button,
	Divider,
	IconButton,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemSecondaryAction,
	ListItemText,
	MenuItem,
	MenuList,
	Paper,
	Stack,
	TextField,
	Typography,
} from '@mui/material'
import { useContext, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

enum ManageCategoriesFormMode {
	VIEW = 'VIEW',
	EDIT = 'EDIT',
	CREATE = 'CREATE',
}

interface ManageCategoriesProps {
	onClose: () => void
}

const CATEGORY_FORM_CREATE_VALUES: CreateCategory = {
	label: '',
	description: '',
	avatar: {
		...DEFAULT_AVATAR,
	},
}

const FORM_TITLES: Record<ManageCategoriesFormMode, string> = {
	[ManageCategoriesFormMode.VIEW]: 'Categories',
	[ManageCategoriesFormMode.EDIT]: 'Edit Category',
	[ManageCategoriesFormMode.CREATE]: 'Create Category',
}

export default function ManageCategories(props: ManageCategoriesProps) {
	const [formMode, setFormState] = useState<ManageCategoriesFormMode>(ManageCategoriesFormMode.VIEW)

	const { snackbar } = useContext(NotificationsContext)
	const { getCategoriesQuery, journal } = useContext(JournalContext)

	const formTitle = FORM_TITLES[formMode] ?? 'Categories'

	const createCategoryForm = useForm<CreateCategory>({
		defaultValues: CATEGORY_FORM_CREATE_VALUES,
		resolver: zodResolver(CreateCategory),
	})

	const updateCategoryForm = useForm<Category>({
		defaultValues: CATEGORY_FORM_CREATE_VALUES,
		resolver: zodResolver(Category),
	})

	const handleSelectCategoryForEdit = (category: Category) => {
		updateCategoryForm.reset({ ...category })
		setFormState(ManageCategoriesFormMode.EDIT)
	}

	const beginCreateCategory = () => {
		createCategoryForm.reset(CATEGORY_FORM_CREATE_VALUES)
		setFormState(ManageCategoriesFormMode.CREATE)
	}

	const handleCreateCategory = async (formData: CreateCategory) => {
		if (!journal) {
			return
		}
		try {
			await createCategory(formData, journal._id)
			snackbar({ message: 'Created category' })
			setFormState(ManageCategoriesFormMode.VIEW)
			getCategoriesQuery.refetch()
		} catch {
			snackbar({ message: 'Failed to create category' })
		}
	}

	const handleUpdateCategory = async (formData: Category) => {
		await updateCategory(formData)
		snackbar({ message: 'Updated category' })
		setFormState(ManageCategoriesFormMode.VIEW)
		getCategoriesQuery.refetch()
	}

	const handleDeleteCategory = async () => {
		const category = updateCategoryForm.watch()
		const record = await deleteCategory(category._id)

		snackbar({
			message: 'Deleted category',
			action: {
				label: 'Undo',
				onClick: () => {
					undeleteCategory(record)
						.then(() => {
							getCategoriesQuery.refetch()
							snackbar({ message: 'Category restored' })
						})
						.catch(() => {
							snackbar({ message: 'Failed to restore category' })
						})
				},
			},
		})
		setFormState(ManageCategoriesFormMode.VIEW)
		getCategoriesQuery.refetch()
	}

	const handleCancel = () => {
		if (formMode === ManageCategoriesFormMode.VIEW) {
			props.onClose()
		} else {
			setFormState(ManageCategoriesFormMode.VIEW)
		}
	}

	const categories = Object.values(getCategoriesQuery.data)

	return (
		<Stack gap={3}>
			<Stack direction="row" justifyContent="space-between" alignItems="center">
				<TextField
					slotProps={{
						input: {
							startAdornment: <Search />,
						}
					}}
					label="Search all categories"
					size='small'
				/>
				<Button startIcon={<Add />} onClick={() => beginCreateCategory()} variant="contained" size='small'>
					Add Category
				</Button>
{/* 			
				{formMode === ManageCategoriesFormMode.EDIT && (
					<Button startIcon={<Delete />} onClick={() => handleDeleteCategory()} variant="text" color="error">
						Delete
					</Button>
				)} */}
			</Stack>
			<Paper>
				<Stack p={2} direction="row" justifyContent="space-between" alignItems="center">
					<Typography>
						<>{categories.length} {p(categories.length, 'categor', 'y', 'ies')}</>
					</Typography>
				</Stack>
				<Divider />
				<MenuList>
					{Object.values(getCategoriesQuery.data).map((category) => {
						return (
							<ListItem
								onClick={() => handleSelectCategoryForEdit(category)} key={category._id}
								secondaryAction={
									<Button>Hello</Button>
								}
							>
								<ListItemIcon>
									<AvatarIcon avatar={category?.avatar} />
								</ListItemIcon>
								<ListItemText primary={category.label} />
							</ListItem>
						)
					})}
				</MenuList>
			</Paper>
			{formMode === ManageCategoriesFormMode.EDIT && (
				<FormProvider {...updateCategoryForm}>
					<form onSubmit={updateCategoryForm.handleSubmit(handleUpdateCategory)}>
						<Stack gap={2} pt={2}>
							<CategoryForm />
							<Button type="submit" variant="contained" startIcon={<Save />}>
								Save
							</Button>
						</Stack>
					</form>
				</FormProvider>
			)}
			{formMode === ManageCategoriesFormMode.CREATE && (
				<FormProvider {...createCategoryForm}>
					<form onSubmit={createCategoryForm.handleSubmit(handleCreateCategory)}>
						<Stack gap={2} pt={2}>
							<CategoryForm />
							<Button type="submit" variant="contained" startIcon={<Add />}>
								Create
							</Button>
						</Stack>
					</form>
				</FormProvider>
			)}
		</Stack>
	)
}
