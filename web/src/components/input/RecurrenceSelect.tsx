import { Dialog, DialogProps, DialogTitle, MenuItem, Select, SelectProps } from "@mui/material"
import { useMemo, useState } from "react"


type RecurrenceSelectProps = Partial<Omit<SelectProps, 'children'>>

export default function RecurrenceSelect(props: RecurrenceSelectProps) {
    const [showCustomRecurrenceDialog, setShowCustomRecurrenceDialog] = useState<boolean>(false)

    const selectOptions: any[] = useMemo(() => {
        return []
    }, [])

    return (
        <>
            <Dialog open={showCustomRecurrenceDialog}>
                <DialogTitle>Custom recurrence</DialogTitle>
            </Dialog>
            <Select
                {...props}
            >
                <MenuItem>Does not recur</MenuItem>
            </Select>
        </>
    )
}