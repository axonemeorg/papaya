import { prettyPrintServerUrl } from "@/utils/server";
import { Grow, Paper, Stack, Table, TableBody, TableCell, TableRow, Typography } from "@mui/material";

interface ServerWidgetProps {
    serverName: string
    serverUrl: string
    status: string
    version: string
    serverNickname?: string
    userName?: string
}

export default function ServerWidget(props: ServerWidgetProps) {
    const printedServerName = props.serverNickname || props.serverName

    return (
        <Paper variant='outlined' sx={(theme) => ({ background: 'none', py: 2, px: 2.5, my: 2, borderRadius: theme.shape.borderRadius })}>
            <Stack direction='row' gap={1} sx={{ flexWrap: 'nowrap' }}>
                <Typography variant='h5'>
                    {printedServerName}
                </Typography>
                <Grow in={Boolean(props.userName)}>
                    <Typography variant='h5'>
                        <Typography variant="inherit" component='span' color='textDisabled' sx={{ mr: 1 }}>@</Typography>
                        {props.userName}
                    </Typography>
                </Grow>
            </Stack>
            <Typography>{prettyPrintServerUrl(props.serverUrl)}</Typography>
            <Table size='small' sx={{ width: 150, mt: 1 }}>
                <TableBody sx={{ '& pre': { m: 0 }, '& td': { border: 0 }}}>
                    <TableRow sx={{ height: 24 }}>
                        <TableCell align="left" padding={'none'}>Version</TableCell>
                        <TableCell align="right" padding={'none'}><pre>{props.version}</pre></TableCell>
                    </TableRow>
                    <TableRow sx={{ height: 24 }}>
                        <TableCell align="left" padding={'none'}>Status</TableCell>
                        <TableCell align="right" padding={'none'}><pre>{props.status}</pre></TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </Paper>
    )
}