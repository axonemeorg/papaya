import { ZISK_META_KEY } from '@/constants/database'
import { ZiskMeta } from '@/types/schema'

export const createDefaultZiskMeta = (): ZiskMeta => {
	return {
		_id: ZISK_META_KEY,
		activeJournalId: null,
	}
}
