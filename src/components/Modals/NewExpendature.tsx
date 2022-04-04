import React from 'react'

import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField
} from '@mui/material'

import { makeFormName } from '@/utils/string'

const NewExpendature = () => {
    const [newExpendature, setNewExpendature] = React.useState(null)


    return (
        <Dialog open={false}>
            <DialogTitle>New Expendature</DialogTitle>
            <DialogContent>
                <TextField
                    label='Amount'
                    type='string'
                    name={makeFormName('new-expendature__amount')}
                    required
                />
                <TextField
                    label='Memo'
                    type='string'
                    name={makeFormName('new-expendature__memo')}
                />
            </DialogContent>
            <DialogActions>
                <Button>Cancel</Button>
                <Button color='primary' variant='contained'>Create</Button>
            </DialogActions>
        </Dialog>
    )
}