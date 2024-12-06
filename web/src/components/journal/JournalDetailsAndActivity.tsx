import { JournalMeta } from "@/types/schema";
import { getRelativeTime } from "@/utils/date";
import { Grid2 as Grid, Stack, Tab, Tabs, Typography } from "@mui/material";
import dayjs from "dayjs";
import { useMemo, useState } from "react";

interface JournalDetailsAndActivityProps {
    details: JournalMeta;
    size: number;
    lastActivity: string;
    activity: never[];
}

type JournalProperty = {
    label: string;
    value: string;
}

const JOURNAL_TYPE_LABEL_MAP = {
    'JOURNAL': 'Zisk Journal',
}

export default function JournalDetailsAndActivity(props: JournalDetailsAndActivityProps) {
    const [tab, setTab] = useState<number>(0);

    const properties: JournalProperty[] = useMemo(() => {
        return [
            {
                label: 'Type',
                value: JOURNAL_TYPE_LABEL_MAP[props.details.type],
            },
            {
                label: 'Last Activity',
                value: getRelativeTime(props.lastActivity),
            },
            {
                label: 'Version',
                value: String(props.details.journalVersion),
            },
            {
                label: 'Modified',
                value: props.details.updatedAt ? new Date(props.details.updatedAt).toLocaleDateString() : 'Never',
            },
            {
                label: 'Created',
                value: dayjs(props.details.createdAt).format('MMM D, YYYY'),
            },
        ];

    }, [props.activity, props.details, props.size]);

    return (
        <Stack>
            <Tabs value={tab} onChange={(_, value) => setTab(value)}>
                <Tab label="Details" />
                <Tab label="Activity" />
            </Tabs>
            {tab === 0 && (
                <Grid container columns={12}>
                    {properties.map((property) => (
                        <Grid size={12} sx={{ display: 'flex', flexFlow: 'column nowrap' }} key={property.label}>
                            <Typography variant="body1">{property.label}</Typography>
                            <Typography variant='body2'>{property.value}</Typography>
                        </Grid>
                    ))}
                </Grid>
            )}
            {tab === 1 && (
                <>
                    <Typography>Not available.</Typography>
                </>
            )}
        </Stack>
    );
}
