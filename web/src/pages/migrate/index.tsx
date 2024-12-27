import { getDatabaseClient } from '@/database/client'
import { generateGenericUniqueId } from '@/utils/id'
import { Button, Stack, TextField } from '@mui/material'
import { useState } from 'react'

const db = getDatabaseClient()

export default function MigratePage() {
	const [data, setData] = useState<string | null>(null)

	const handleSubmit = () => {
		const jsonData = JSON.parse(data!)
		const records = jsonData.map((record: any) => {
			return {
				...record,
				_id: record._id ?? generateGenericUniqueId(),
			}
		})
		db.bulkDocs(records)

		setData('Done')
	}

	return (
		<Stack>
			<TextField
				label="Enter your JSON data"
				multiline
				rows={10}
				variant="outlined"
				fullWidth
				value={data}
				onChange={(e) => setData(e.target.value)}
			/>
			<Button variant="contained" color="primary" onClick={() => handleSubmit()}>
				Migrate
			</Button>
		</Stack>
	)
}
