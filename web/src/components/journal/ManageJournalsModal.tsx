import { JournalContext } from '@/contexts/JournalContext'
import { JournalMeta } from '@/types/schema'
import { Add } from '@mui/icons-material'
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	Grid2 as Grid,
	ListItemIcon,
	ListItemText,
	MenuItem,
	MenuList,
	Typography,
} from '@mui/material'
import { useContext, useEffect, useMemo, useState } from 'react'
import JournalDetailsAndActivity from './JournalDetailsAndActivity'
import AvatarIcon from '../icon/AvatarIcon'
import JournalCreator from './JournalCreator'
import { PLACEHOLDER_UNNAMED_JOURNAL_NAME } from '@/constants/journal'

type ManageJournalsModalMode = 'SELECT' | 'CREATE'

interface ManageJournalsModal {
	open: boolean
	initialMode: ManageJournalsModalMode
	onClose: () => void
	onSelect: (journal: JournalMeta) => void
}

export default function ManageJournalsModal(props: ManageJournalsModal) {
	const [mode, setMode] = useState<ManageJournalsModalMode>(props.initialMode)

	const journalContext = useContext(JournalContext)

	const [selectedJournal, setSelectedJournal] = useState<JournalMeta | null>(journalContext.journal)

	useEffect(() => {
		setSelectedJournal(journalContext.journal)
	}, [journalContext.journal])

	const journals: JournalMeta[] = useMemo(() => {
		return Object.values(journalContext.getJournalsQuery.data)
	}, [journalContext.getJournalsQuery.data])

	const handleSelectJournal = (journal: JournalMeta) => {
		setSelectedJournal(journal)
		setMode('SELECT')
	}

	const handleContinue = () => {
		if (!selectedJournal) {
			return
		}
		props.onSelect(selectedJournal)
	}

	return (
		<Dialog open={props.open} fullWidth maxWidth="md">
			<Grid container columns={12}>
				<Grid size={5}>
					<DialogContent>
						<DialogContentText>Please select a journal.</DialogContentText>
					</DialogContent>
					<MenuList>
						{journals.map((journal) => {
							return (
								<MenuItem key={journal._id} onClick={() => handleSelectJournal(journal)}>
									<ListItemIcon>
										<AvatarIcon avatar={journal.avatar} />
									</ListItemIcon>
									<ListItemText
										primary={
											<Typography sx={{ fontStyle: !journal.journalName ? 'italic' : undefined }}>
												{journal.journalName || PLACEHOLDER_UNNAMED_JOURNAL_NAME}
											</Typography>
										}
									/>
								</MenuItem>
							)
						})}
					</MenuList>
					<DialogContent sx={{ pt: 0 }}>
						<Button onClick={() => setMode('CREATE')} startIcon={<Add />}>
							Create New Journal
						</Button>
					</DialogContent>
				</Grid>
				<Grid size={7}>
					<DialogContent>
						{mode === 'SELECT' ? (
							<JournalDetailsAndActivity
								details={selectedJournal}
								size={null}
								lastActivity={null}
								activity={[]}
							/>
						) : (
							<JournalCreator onCreated={setSelectedJournal} />
						)}
					</DialogContent>
				</Grid>
			</Grid>
			<DialogActions>
				{journalContext.journal && <Button onClick={() => props.onClose()}>Cancel</Button>}
				<Button variant="contained" disabled={!selectedJournal} onClick={() => handleContinue()}>
					Switch
				</Button>
			</DialogActions>
		</Dialog>
	)
}
