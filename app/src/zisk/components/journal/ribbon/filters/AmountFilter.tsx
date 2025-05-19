import AmountField from "@/components/input/AmountField";
import { JournalFilterContext } from "@/contexts/JournalFilterContext";
import { AmountRange } from "@/schema/support/search/facet";
import { Stack, Table, TableBody, TableCell, TableRow, Typography } from "@mui/material";
import { useContext } from "react";

export const DEFAULT_AMOUNT_RANGE: AmountRange = {
    // absolute: true,
    gt: '',
    lt: '',
    currency: 'CAD',
}

export default function AmountFilter() {
    const journalFilterContext = useContext(JournalFilterContext)

    const amountRange: AmountRange = {
        ...DEFAULT_AMOUNT_RANGE,
        // ...journalSliceContext.amount // TODO
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
                                    throw new Error("Not implemented")
                                    // journalSliceContext.onChangeAmountRange({
                                    //     ...amountRange,
                                    //     gt: event.target.value,
                                    // })
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
                                    throw new Error("Not implemented")
                                    // journalSliceContext.onChangeAmountRange({
                                    //     ...amountRange,
                                    //     lt: event.target.value,
                                    // })
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
