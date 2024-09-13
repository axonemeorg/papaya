'use client';

import CategoryForm from "@/components/form/CategoryForm";
import CategoryIcon from "@/components/icon/CategoryIcon";
import { CategoryContext } from "@/contexts/CategoryContext";
import { Category } from "@/types/get";
import { CreateCategory } from "@/types/post";
import { UpdateCategory } from "@/types/put";
import { zodResolver } from "@hookform/resolvers/zod";
import { Add, ArrowBack, ArrowRight, Close, NavigateNext, Save } from "@mui/icons-material";
import { Box, Button, Drawer, IconButton, List, ListItemIcon, ListItemSecondaryAction, ListItemText, MenuItem, Stack, Typography } from "@mui/material";
import { useContext, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

enum ManageCategoriesFormState {
    VIEW = 'VIEW',
    EDIT = 'EDIT',
    CREATE = 'CREATE',
}

interface ManageCategoriesProps {
    onClose: () => void;
}

const categoryFormCreateValues = {
    categoryId: '',
    label: '',
    description: '',
}

const formTitles: Record<ManageCategoriesFormState, string> = {
    [ManageCategoriesFormState.VIEW]: 'Categories',
    [ManageCategoriesFormState.EDIT]: 'Edit Category',
    [ManageCategoriesFormState.CREATE]: 'Create Category',
}

export default function ManageCategories(props: ManageCategoriesProps) {
    const [formState, setFormState] = useState<ManageCategoriesFormState>(ManageCategoriesFormState.VIEW);
    const { categories } = useContext(CategoryContext);

    const formTitle = formTitles[formState] ?? 'Categories';

    const categoryForm = useForm<CreateCategory | UpdateCategory>({
        defaultValues: categoryFormCreateValues,
        resolver: zodResolver(UpdateCategory)
    });

    const handleSelectCategoryForEdit = (category: Category) => {
        categoryForm.reset({ ...category });
        setFormState(ManageCategoriesFormState.EDIT);
    }

    const handleCreateCategory = () => {
        categoryForm.reset(categoryFormCreateValues);
        setFormState(ManageCategoriesFormState.CREATE)
    }

    const handleCancel = () => {
        if (formState === ManageCategoriesFormState.VIEW) {
            props.onClose();
        } else {
            setFormState(ManageCategoriesFormState.VIEW);
        }
    }

    console.log(formState);

    return (
        <Stack>
            <Stack direction='row' justifyContent='space-between' alignItems='center'>
                <Stack direction='row' gap={1} alignItems='center'>
                    <IconButton onClick={() => handleCancel()}>
                        {formState === ManageCategoriesFormState.VIEW ? <Close /> : <ArrowBack />}
                    </IconButton>
                    <Typography variant='h6'>{formTitle}</Typography>
                </Stack>
                {formState === ManageCategoriesFormState.VIEW && (
                    <Button
                        startIcon={<Add />}
                        onClick={() => handleCreateCategory()}
                    >
                        Add Category
                    </Button>
                )}
            </Stack>
            {formState === ManageCategoriesFormState.VIEW && (
                <List dense>
                    {categories.map((category) =>  {
                        return (
                            <MenuItem onClick={() => handleSelectCategoryForEdit(category)} key={category.categoryId}>
                                <ListItemIcon>
                                    {/* <Icon color={category.avatarPrimaryColor}>{category.</Icon> */}
                                    <CategoryIcon category={category} />
                                </ListItemIcon>
                                <ListItemText
                                    primary={category.label}
                                    // secondary={category.description}
                                />
                                <ListItemSecondaryAction>
                                    <NavigateNext />
                                </ListItemSecondaryAction>
                            </MenuItem>
                        )
                    })}
                </List>
            )}
            {formState === ManageCategoriesFormState.EDIT && (
                <FormProvider {...categoryForm}>
                    <form>
                        <Stack gap={2} pt={2}>
                            <CategoryForm />
                            <Button type='submit' variant='contained' startIcon={<Save />}>Save</Button>
                        </Stack>
                    </form>
                </FormProvider>
            )}
            {formState === ManageCategoriesFormState.CREATE && (
                <FormProvider {...categoryForm}>
                    <form>
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
