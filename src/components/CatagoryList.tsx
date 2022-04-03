import React from 'react'

import {
    List,
    ListItem,
    ListItemIcon,
    ListItemText
} from '@mui/material'

import { ICategory } from '@/types/app'

import ColorSwatch from '@/components/ColorSwatch'

interface ICategoryListProps {
    categories: ICategory[]
    onChange: (categories: ICategory[]) => void
    onCreate: (name: string, color: string) => void
}

const CategoryList = (props: ICategoryListProps) => {
    const { categories } = props

    return (
        <List>
            {categories.map((category: ICategory, index: number) => (
                <ListItem key={index}>
                    <ListItemIcon><ColorSwatch colorString={category.color} /></ListItemIcon>
                    <ListItemText primary={category.name} secondary={category.description}></ListItemText>
                </ListItem>
            ))}
        </List>
    )
}

export default CategoryList
