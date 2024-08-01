
import { Grid, Icon } from '@mui/material';

import icons from '@/constants/icons';

interface IconPickerProps {
    
}

export default function IconPicker() {



    return (
        <Grid container columns={12}>
            {(icons as unknown as any[]).map((icon) => {
                return (
                    <Grid item xs={3}>
                        <Icon>{icon.name}</Icon>
                    </Grid>
                )
            })}

        </Grid>
    )
}
