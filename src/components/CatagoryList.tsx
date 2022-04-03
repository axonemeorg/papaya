import React from 'react'

import {
    List,
    ListItem,
    ListItemIcon,
    ListItemText
} from '@mui/material'

import { useDispatch, useSelector } from '@/hooks/state'
import { create, get, update, destroy } from '@/state/slices/categorySlice'
import { ICategory } from '@/types/app'

import ColorSwatch from '@/components/ColorSwatch'

const CategoryList = () => {
    const dispatch = useDispatch()
    const categories: ICategory[] = useSelector((state) => state.categories.categories)

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
