import { Stack, Typography } from "@mui/material";
import Link from "next/link";

export default function AppLogo() {
    return (
        <Link href={'/'} style={{ textDecoration: 'none', color: 'inherit' }}>
            {/* <Typography variant='h6'>Zisk</Typography> */}
            <img src='/images/logo64.png' style={{ height: 32 }} />
        </Link>
    )
}
