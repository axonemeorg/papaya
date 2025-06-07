import { NotificationsContext } from "@/contexts/NotificationsContext";
import { ZiskContext } from "@/contexts/ZiskContext";
import { useDebounce } from "@/hooks/useDebounce";
import { parseServerUrl } from "@/utils/server";
import { LeakAdd } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
  Button,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Stack,
  TextField
} from "@mui/material";
import { useContext, useMemo, useState } from "react";

interface JoinServerModalProps {
  open: boolean
  onClose: () => void
}

const INITIAL_SERVER_URL = 'http://localhost:9475/'
// const INITIAL_SERVER_URL = ''

export default function JoinServerModal(props: JoinServerModalProps) {
  const [serverUrl, setServerUrl] = useState<string>(INITIAL_SERVER_URL)
  const [serverCheckLookup, setServerCheckLookup] = useState<Record<string, boolean>>({})

  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [serverNickname, setServerNickname] = useState<string>('')
  const [willUpdateSyncStrategy, setWillUpdateSyncStrategy] = useState<boolean>(true)

  const checkServerUrl = async (url: string | null): Promise<boolean> => {
    if (!url) {
      return false
    }
    console.log('Checking url')
    const parsedUrl = parseServerUrl(url);
    const healthCheckUrl = `${parsedUrl}api`
    console.log('parsedUrl:', parsedUrl)
    console.log('healthCheckUrl:', healthCheckUrl)

    const response = await fetch(healthCheckUrl)
    const json = await response.json()
    const healthCheckOk = Object.entries(json).some(([key, value]) => key === 'zisk' && Boolean(value))

    setServerCheckLookup((prev) => {
      const next = { ...prev }
      next[parsedUrl] = healthCheckOk
      return next
    })

    return healthCheckOk
  }

  const [debouncedCheckServer] = useDebounce(async (url: string) => {
    return checkServerUrl(url)
  }, 500)

  const { snackbar } = useContext(NotificationsContext)
  const ziskContext = useContext(ZiskContext)

  const disableSignIn = false;

  const handleChangeServerUrl = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const url = event.target.value
    setServerUrl(url)
    debouncedCheckServer(url)
  }

  const healthCheck: 'PENDING' | 'OK' | 'FAIL' = useMemo(() => {
    const parsedUrl: string | null = parseServerUrl(serverUrl)
    if (!parsedUrl) {
      return 'PENDING'
    }

    const healthCheck: boolean | undefined = serverCheckLookup[parsedUrl]
    if (healthCheck === undefined) {
      return 'PENDING'
    }
    return healthCheck === true ? 'OK' : 'FAIL'
  }, [serverCheckLookup, serverUrl])

  return (
    <Dialog {...props} fullWidth maxWidth={'sm'}>
      <DialogTitle>Join Server</DialogTitle>
      <DialogContent>
        <Stack mt={2} gap={1}>
          <TextField
            value={serverUrl}
            onChange={handleChangeServerUrl}
            label='Server URL'
            placeholder='your.server.com'
            fullWidth
            required
            error={healthCheck === 'FAIL'}
            helperText={healthCheck === 'PENDING' ? undefined : (healthCheck === 'OK' ? 'Server OK' : 'Failed to connect to server')}
          />
          <Collapse in={false}>
            <Paper variant='outlined' sx={(theme) => ({ background: 'none', borderRadius: theme.shape.borderRadius, alignSelf: 'flex-start' })}>
              {/* <ServerWidget
                serverName={serverData?.serverName}
                serverNickname={serverNickname}
                serverUrl={serverUrl}
                userName={username}
                status={serverData?.status}
                version={serverData?.version}
                actions={
                  <Button
                    onClick={() => setServerHealthCheckOk(false)}
                    color='error'
                    startIcon={<LeakRemove />}
                  >
                    Disconnect
                  </Button>
                }
              /> */}
            </Paper>
          </Collapse>
          <TextField
            label='Username'
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            fullWidth
            required
          />
          <TextField
            label='Password'
            type='password'
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            fullWidth
            required
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <LoadingButton
          variant='contained'
          startIcon={<LeakAdd />}
          // onClick={() => handleSignIn()}
          disabled={disableSignIn}
          loading={false}
        >
          Join Server
        </LoadingButton>
        <Button onClick={() => props.onClose()}>Close</Button>
      </DialogActions>
    </Dialog>
  )
}
