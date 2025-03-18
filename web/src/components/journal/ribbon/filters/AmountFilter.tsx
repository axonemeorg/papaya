import AmountField from "@/components/input/AmountField";
import CategoryAutocomplete from "@/components/input/CategoryAutocomplete";
import { JournalSliceContext } from "@/contexts/JournalSliceContext";
import { AmountRange } from "@/types/schema";
import { Stack, Table, TableBody, TableCell, TableRow, Typography } from "@mui/material";
import { useContext } from "react";

export default function AmountFilter() {
    const journalSliceContext = useContext(JournalSliceContext)

    const range: AmountRange | undefined = journalSliceContext.amount

    return (
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
                            value={range?.minimum ?? ''}
                            onChange={(event) => {
                                journalSliceContext.onChangeAmountRange({
                                    ...range,
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
                            value={range?.maximum ?? ''}
                            onChange={(event) => {
                                journalSliceContext.onChangeAmountRange({
                                    ...range,
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
    )
}
