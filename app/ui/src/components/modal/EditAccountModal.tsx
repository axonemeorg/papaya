import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'
import { Save } from '@mui/icons-material'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, useMediaQuery, useTheme } from '@mui/material'
import { NotificationsContext } from '@ui/contexts/NotificationsContext'
import { updateAccount } from '@ui/database/actions'
import { Account } from '@ui/schema/documents/Account'
import { useContext, useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import AccountForm from '../form/AccountForm'

interface EditAccountModalProps {
  open: boolean
  initialValues: Account
  onClose: () => void
  onSaved: () => void
}

export default function EditAccountModal(props: EditAccountModalProps) {
  const { snackbar } = useContext(NotificationsContext)

  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))

  const updateAccountForm = useForm<Account>({
    defaultValues: {
      ...props.initialValues,
    },
    resolver: standardSchemaResolver(Account),
  })

  const handleUpdateAccount = async (formData: Account) => {
    await updateAccount(formData)
    snackbar({ message: 'Updated account' })
    props.onClose()
    props.onSaved()
  }

  useEffect(() => {
    updateAccountForm.reset({ ...props.initialValues })
  }, [props.initialValues])

  useEffect(() => {
    if (props.open) {
      updateAccountForm.reset()
    }
  }, [props.open])

  return (
    <FormProvider {...updateAccountForm}>
      <Dialog open={props.open} fullWidth fullScreen={fullScreen} onClose={props.onClose} maxWidth="md">
        <form onSubmit={updateAccountForm.handleSubmit(handleUpdateAccount)}>
          <DialogTitle>Edit Account</DialogTitle>
          <DialogContent sx={{ overflow: 'initial' }}>
            <AccountForm />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => props.onClose()}>Cancel</Button>
            <Button type="submit" variant="contained" startIcon={<Save />}>
              Save
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </FormProvider>
  )
}
