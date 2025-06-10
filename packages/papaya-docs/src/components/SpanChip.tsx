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
                px: 3,
                backgroundColor: `rgba(255, 255, 255, .19)`,
                backdropFilter: `blur(5px)`,
                border: `1px solid rgba(200, 200, 200, 0.28)`,
            }}
        >
            {props.children}
        </Typography>
    );
}
