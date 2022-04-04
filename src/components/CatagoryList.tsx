import React from 'react'

import {
    Divider,
    Icon,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    MenuItem
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
                <MenuItem key={index}>
                    <ListItemIcon>
                        <ColorSwatch colorString={category.color} square />
                    </ListItemIcon>
                    <ListItemText primary={category.name} secondary={category.description}></ListItemText>
                </MenuItem>
            ))}
            <Divider />
            <MenuItem>
                <ListItemIcon><Icon>add</Icon></ListItemIcon>
                <ListItemText primary='Create Category' />
            </MenuItem>
        </List>
    )
}

export default CategoryList
