'use client';

import CategoryForm from "@/components/form/CategoryForm";
import AvatarIcon from "@/components/icon/AvatarIcon";
import { DEFAULT_AVATAR } from "@/components/pickers/AvatarPicker";
import { JournalContext } from "@/contexts/JournalContext";
import { NotificationsContext } from "@/contexts/NotificationsContext";
import { createCategory, deleteCategory, undeleteCategory, updateCategory } from "@/database/actions";
import { Category, CreateCategory } from "@/types/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Add, ArrowBack, Close, Delete, NavigateNext, Save } from "@mui/icons-material";
import { Button, IconButton, List, ListItemIcon, ListItemSecondaryAction, ListItemText, MenuItem, Stack, Typography } from "@mui/material";
import { useContext, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

enum ManageCategoriesFormMode {
    VIEW = 'VIEW',
    EDIT = 'EDIT',
    CREATE = 'CREATE',
}

interface ManageCategoriesProps {
    onClose: () => void;
}

const CATEGORY_FORM_CREATE_VALUES: CreateCategory = {
    label: '',
    description: '',
    avatar: {
        ...DEFAULT_AVATAR
    },
}

const FORM_TITLES: Record<ManageCategoriesFormMode, string> = {
    [ManageCategoriesFormMode.VIEW]: 'Categories',
    [ManageCategoriesFormMode.EDIT]: 'Edit Category',
    [ManageCategoriesFormMode.CREATE]: 'Create Category',
}

export default function ManageCategories(props: ManageCategoriesProps) {
    const [formMode, setFormState] = useState<ManageCategoriesFormMode>(ManageCategoriesFormMode.VIEW);

    const { snackbar } = useContext(NotificationsContext);
    const { getCategoriesQuery } = useContext(JournalContext);

    const formTitle = FORM_TITLES[formMode] ?? 'Categories';

    const createCategoryForm = useForm<Category>({
        defaultValues: CATEGORY_FORM_CREATE_VALUES,
        resolver: zodResolver(Category)
    });

    const updateCategoryForm = useForm<Category>({
        defaultValues: CATEGORY_FORM_CREATE_VALUES,
        resolver: zodResolver(Category)
    });

    const handleSelectCategoryForEdit = (category: Category) => {
        updateCategoryForm.reset({ ...category });
        setFormState(ManageCategoriesFormMode.EDIT);
    }

    const beginCreateCategory = () => {
        createCategoryForm.reset(CATEGORY_FORM_CREATE_VALUES);
        setFormState(ManageCategoriesFormMode.CREATE)
    }

    const handleCreateCategory = async (formData: Category) => {
        try {
            await createCategory(formData);
            snackbar({ message: 'Created category' })
            setFormState(ManageCategoriesFormMode.VIEW);
            getCategoriesQuery.refetch();
        } catch {
            snackbar({ message: 'Failed to create category' })
        }
    }

    const handleUpdateCategory = async (formData: Category) => {
        await updateCategory(formData);
        snackbar({ message: 'Updated category' })
        setFormState(ManageCategoriesFormMode.VIEW);
        getCategoriesQuery.refetch();
    }

    const handleDeleteCategory = async () => {
        const category = updateCategoryForm.watch();
        const record = await deleteCategory(category._id);

        snackbar({
            message: 'Deleted category',
            action: {
                label: 'Undo',
                onClick: () => {
                    undeleteCategory(record)
                        .then(() => {
                            getCategoriesQuery.refetch();
                            snackbar({ message: 'Category restored' });
                        })
                        .catch(() => {
                            snackbar({ message: 'Failed to restore category' });
                        });
                }
            }
        })
        setFormState(ManageCategoriesFormMode.VIEW);
        getCategoriesQuery.refetch();
    }

    const handleCancel = () => {
        if (formMode === ManageCategoriesFormMode.VIEW) {
            props.onClose();
        } else {
            setFormState(ManageCategoriesFormMode.VIEW);
        }
    }

    return (
        <Stack>
            <Stack direction='row' justifyContent='space-between' alignItems='center'>
                <Stack direction='row' gap={1} alignItems='center'>
                    <IconButton onClick={() => handleCancel()}>
                        {formMode === ManageCategoriesFormMode.VIEW ? <Close /> : <ArrowBack />}
                    </IconButton>
                    <Typography variant='h6'>{formTitle}</Typography>
                </Stack>
                {formMode === ManageCategoriesFormMode.VIEW && (
                    <Button
                        startIcon={<Add />}
                        onClick={() => beginCreateCategory()}
                        variant='text'
                    >
                        Add Category
                    </Button>
                )}
                {formMode === ManageCategoriesFormMode.EDIT && (
                    <Button
                        startIcon={<Delete />}
                        onClick={() => handleDeleteCategory()}
                        variant='text'
                        color='error'
                    >
                        Delete
                    </Button>
                )}
            </Stack>
            {formMode === ManageCategoriesFormMode.VIEW && (
                <List dense>
                    {Object.values(getCategoriesQuery.data).map((category) =>  {
                        return (
                            <MenuItem onClick={() => handleSelectCategoryForEdit(category)} key={category._id}>
                                <ListItemIcon>
                                    <AvatarIcon avatar={category?.avatar} />
                                </ListItemIcon>
                                <ListItemText
                                    primary={category.label}
                                />
                                <ListItemSecondaryAction>
                                    <NavigateNext />
                                </ListItemSecondaryAction>
                            </MenuItem>
                        )
                    })}
                </List>
            )}
            {formMode === ManageCategoriesFormMode.EDIT && (
                <FormProvider {...updateCategoryForm}>
                    <form onSubmit={updateCategoryForm.handleSubmit(handleUpdateCategory)}>
                        <Stack gap={2} pt={2}>
                            <CategoryForm />
                            <Button type='submit' variant='contained' startIcon={<Save />}>Save</Button>
                        </Stack>
                    </form>
                </FormProvider>
            )}
            {formMode === ManageCategoriesFormMode.CREATE && (
                <FormProvider {...createCategoryForm}>
                    <form onSubmit={createCategoryForm.handleSubmit(handleCreateCategory)}>
                        <Stack gap={2} pt={2}>
                            <CategoryForm />
                            <Button type='submit' variant='contained' startIcon={<Add />}>Create</Button>
                        </Stack>
                    </form>
                </FormProvider>
            )}
        </Stack>
    )
}
