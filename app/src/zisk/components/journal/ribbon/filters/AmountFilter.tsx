import AmountField from "@/components/input/AmountField";
import { JournalSnapshotContext } from "@/contexts/JournalSnapshopContext";
import { AmountRange } from "@/schema/support/slice";
import { Stack, Table, TableBody, TableCell, TableRow, Typography } from "@mui/material";
import { useContext } from "react";
import { JournalFilterSlot } from "../JournalFilterPicker";

export const DEFAULT_AMOUNT_RANGE: AmountRange = {
    currency: 'USD', // Default currency
    gt: '',
    lt: '',
    // absolute: false,
}

export default function AmountFilter() {
    const journalSnapshotContext = useContext(JournalSnapshotContext)

    const amountRange: AmountRange = {
        ...DEFAULT_AMOUNT_RANGE,
        ...(journalSnapshotContext.memoryFilters[JournalFilterSlot.AMOUNT] as AmountRange || {})
    }

    return (
        <Stack gap={1}>
            <Table sx={{
                '& td': {
                    px: 0,
                    py: 1,
                    border: 0,

                    '& input': {
                        // padding: 0,
                    }
                }
            }}>
                <TableBody>
                    <TableRow>
                        <TableCell>
                            <Typography variant='body2' color='textSecondary'>
                                More than
                            </Typography>
                        </TableCell>
                        <TableCell>
                            <AmountField
                                size='small'
                                fullWidth={false}
                                disableSignChange={false}
                                value={amountRange?.gt ?? ''}
                                onChange={(event) => {
                                    journalSnapshotContext.setMemoryFilter(JournalFilterSlot.AMOUNT, {
                                        ...amountRange,
                                        gt: event.target.value,
                                    });
                                }}
                                label={undefined}
                                variant='standard'
                            />
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            <Typography variant='body2' color='textSecondary'>
                                Less than
                            </Typography>
                        </TableCell>
                        <TableCell>
                            <AmountField
                                size='small'
                                fullWidth={false}
                                disableSignChange={false}
                                value={amountRange?.lt ?? ''}
                                onChange={(event) => {
                                    journalSnapshotContext.setMemoryFilter(JournalFilterSlot.AMOUNT, {
                                        ...amountRange,
                                        lt: event.target.value,
                                    });
                                }}
                                label={undefined}
                                variant='standard'
                            />
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
            {/* <ToggleButtonGroup
                exclusive
                value={amountRange.absolute ? 'ABSOLUTE' : 'SIGNED'}
                onChange={(_event, newValue: 'ABSOLUTE' | 'SIGNED') => {
                    journalSliceContext.onChangeAmountRange({
                        ...amountRange,
                        absolute: newValue === 'ABSOLUTE',
                    })
                }}
            >
                <ToggleButton value={'ABSOLUTE'}>
                    Absolute
                </ToggleButton>
                <ToggleButton value={'SIGNED'}>
                    Signed
                </ToggleButton>
            </ToggleButtonGroup> */}
        </Stack>
    )
}
