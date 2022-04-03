import React from 'react'

import {
    Fab,
    Icon,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
} from '@mui/material'

interface IItemCreatorProps {

}

const ItemCreator = (props: IItemCreatorProps) => {
    const [menuRef, setMenuRef] = React.useState(null)
    const menuOpen: boolean = Boolean(menuRef)

    return (
        <>
            <Menu ref={menuRef} open={menuOpen} onClose={() => setMenuRef(null)}>
                <MenuItem>
                    <ListItemIcon><Icon>add</Icon></ListItemIcon>
                    <ListItemText>Category</ListItemText>    
                </MenuItem>
                <MenuItem>
                    <ListItemIcon><Icon>add</Icon></ListItemIcon>
                    <ListItemText>Budget</ListItemText>    
                </MenuItem>
                <MenuItem>
                    <ListItemIcon><Icon>add</Icon></ListItemIcon>
                    <ListItemText>Expendature</ListItemText>    
                </MenuItem>
            </Menu>
            <Fab onClick={(event) => setMenuRef(event.currentTarget)} color='primary'>
                <Icon>add</Icon>
            </Fab>
        </>
    )
}

export default ItemCreator
