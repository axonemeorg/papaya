import { Typography } from "@mui/material";
import { PropsWithChildren } from "react";

interface SpanChipProps extends PropsWithChildren {
    backgroundColor?: string;
}

export default function SpanChip(props: SpanChipProps) {
    return (
        <Typography
            component='span'
            variant='inherit'
            sx={{
                display: 'inline-block',
                borderRadius: '64px',
                backgroundColor: props.backgroundColor ?? '#000',
                px: 3,
                // py: 1,
            }}
        >
            {props.children}
        </Typography>
    );
}
