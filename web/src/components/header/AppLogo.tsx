import { Stack, Typography } from "@mui/material";
import Link from "next/link";

export default function AppLogo() {
    return (
        <Link href={'/'} style={{ textDecoration: 'none', color: 'inherit' }}>
            <Typography variant='h6'>Zisk</Typography>
        </Link>
    )
}
