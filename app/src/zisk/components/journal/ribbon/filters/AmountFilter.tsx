import AmountField from "@/components/input/AmountField";
import { JournalSliceContext } from "@/contexts/JournalSliceContext";
import { AmountRange } from "@/types/schema";
import { Stack, Table, TableBody, TableCell, TableRow, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { useContext } from "react";

export const DEFAULT_AMOUNT_RANGE: AmountRange = {
    absolute: true,
    minimum: '',
    maximum: '',
}

export default function AmountFilter() {
    const journalSliceContext = useContext(JournalSliceContext)

    const amountRange: AmountRange = {
        ...DEFAULT_AMOUNT_RANGE,
        ...journalSliceContext.amount
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
                                disableSignChange
                                value={amountRange?.minimum ?? ''}
                                onChange={(event) => {
                                    journalSliceContext.onChangeAmountRange({
                                        ...amountRange,
                                        minimum: event.target.value,
                                    })
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
                                disableSignChange
                                value={amountRange?.maximum ?? ''}
                                onChange={(event) => {
                                    journalSliceContext.onChangeAmountRange({
                                        ...amountRange,
                                        maximum: event.target.value,
                                    })
                                }}
                                label={undefined}
                                variant='standard'
                            />
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
            <ToggleButtonGroup
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
            </ToggleButtonGroup>
        </Stack>
    )
}
