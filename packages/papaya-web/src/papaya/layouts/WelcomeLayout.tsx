import AppLogo from '@/components/nav/header/AppLogo'
import { Close } from '@mui/icons-material'
import { Box, Container, Grid, IconButton, Paper, Stack, Tooltip, Typography } from '@mui/material'
import { PropsWithChildren } from 'react'

interface WelcomeLayoutProps extends PropsWithChildren {
  //
}

export default function WelcomeLayout(props: PropsWithChildren) {
  return (
    <Stack
      component="main"
      sx={{
        height: '100dvh',
        display: 'grid',
        gridTemplateRows: 'auto 1fr',
        gridTemplateColumns: '1fr',
        p: 4,
        gap: 4,
      }}
    >
      <Stack gap={4} direction="row" alignItems="center">
        <AppLogo />
        {/* <Button variant='outlined'>Close</Button> */}
      </Stack>
      <Stack component={Paper} alignItems='center' sx={(theme) => ({ borderRadius: theme.spacing(3), overflow: 'hidden' })}>
        <Grid container columns={12} sx={{ flex: 1, width: '100%' }}>
          <Grid size={5} sx={{ position: 'relative', py: 8 }} display='flex' alignItems='center'>
            <Container maxWidth='lg' disableGutters sx={{ px: 3 }}>
              <Box pb={4}>
                <Typography variant='h3'>Papaya</Typography>
              </Box>
            </Container>
          </Grid>
          <Grid size={7} sx={{ position: 'relative', py: 8 }} display='flex' alignItems='center'>
            <Stack position='absolute' top={0} right={0} sx={(theme) => ({ zIndex: 2, width: theme.spacing(8), height: theme.spacing(8), alignItems: 'center', justifyContent: 'center' })}>
              <Tooltip title='Close'>
                <IconButton size='large'>
                  <Close />
                </IconButton>
              </Tooltip>
            </Stack>
            <Container maxWidth='lg' sx={{ px: 3 }} disableGutters>
              {props.children}
            </Container>
          </Grid>
        </Grid>
      </Stack>
    </Stack>
  )
}
