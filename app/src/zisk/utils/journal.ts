import {
	Avatar,
	Category,
	ChildJournalEntry,
	EntryArtifact,
	EntryTask,
	ReservedTagKey,
	TransferEntry,
	ZiskDocument,
	type JournalEntry,
} from '@/types/schema'
import { generateJournalEntryId, generateTaskId } from './id'
import dayjs from 'dayjs'
import { RESERVED_TAGS } from '@/constants/tags'
import { DEFAULT_AVATAR } from '@/components/pickers/AvatarPicker'

/**
 * Strips optional fields from a JournalEntry object
 */
export const simplifyJournalEntry = (entry: JournalEntry): JournalEntry => {
	if (!entry.tagIds?.length) {
		delete entry.tagIds
	}
	if (!entry.relatedEntryIds?.length) {
		delete entry.relatedEntryIds
	}
	if (!entry.categoryId) {
		delete entry.categoryId
	}
	if (!entry.notes) {
		delete entry.notes
	}

	return {
		...entry,
	}
}

export const parseJournalEntryAmount = (amount: string): number | undefined => {
	const sanitizedAmount = String(amount).replace(/[^0-9.-]/g, '');
	if (!amount || !sanitizedAmount) {
		return undefined;
	}

	const parsedAmount = parseFloat(sanitizedAmount)
	if (isNaN(parsedAmount)) {
		return parsedAmount
	} else if (amount.startsWith('+')) {
		return parsedAmount
	} else {
		return -parsedAmount
	}
}

export const serializeJournalEntryAmount = (amount: number): string => {
	const leadingSign = amount < 0 ? '' : '+'
	return `${leadingSign}${amount.toFixed(2)}`
}

export const calculateNetAmount = (entry: JournalEntry | TransferEntry): number => {
	const children: JournalEntry[] = (entry.type === 'TRANSFER_ENTRY' ? null : entry.children) ?? []
	const netAmount: number = children.reduce(
		(acc: number, child) => {
			return acc + (parseJournalEntryAmount(child.amount) ?? 0)
		},
		parseJournalEntryAmount(entry.amount) ?? 0
	)

	return netAmount
}

export const makeJournalEntry = (formData: Partial<JournalEntry>, journalId: string): JournalEntry => {
	const now = new Date().toISOString()

	const entry: JournalEntry = {
		_id: formData._id ?? generateJournalEntryId(),
		type: 'JOURNAL_ENTRY',
		createdAt: now,
		date: formData.date || dayjs(now).format('YYYY-MM-DD'),
		amount: formData.amount || '',
		memo: formData.memo || '',
		journalId,
	}

	return entry
}

export const makeTransferEntry = (formData: Partial<TransferEntry>, journalId: string): TransferEntry => {
	const now = new Date().toISOString()

	const entry: TransferEntry = {
		_id: formData._id ?? generateJournalEntryId(),
		type: 'TRANSFER_ENTRY',
		createdAt: now,
		date: formData.date || dayjs(now).format('YYYY-MM-DD'),
		amount: formData.amount || '',
		memo: formData.memo || '',
		journalId,
	}

	return entry
}

export const makeEntryArtifact = (formData: Partial<EntryArtifact>, journalId: string): EntryArtifact => {
	const now = new Date().toISOString()

	const entryArtifact: EntryArtifact = {
		_id: formData._id ?? generateTaskId(),
		type: 'ENTRY_ARTIFACT',
		originalFileName: formData.originalFileName ?? '',
    	contentType: formData.contentType ?? '',
		size: formData.size ?? 0,
		createdAt: now,
		journalId,
	}

	return entryArtifact
}

export const makeEntryTask = (formData: Partial<EntryTask>, journalId: string): EntryTask => {
	// const now = new Date().toISOString()

	const newTask: EntryTask = {
		_id: formData._id ?? generateTaskId(),
		type: 'ENTRY_TASK',
		description: formData.description ?? '',
		completedAt: formData.completedAt ?? null,
		journalId,
	}

	return newTask
}

export const journalEntryHasTasks = (entry: JournalEntry | TransferEntry): boolean => {
	if (!entry.tasks) {
		return false
	}
	return entry.tasks.length > 0
}

const tagIdBelongsToReservedTag = (tagId: string): tagId is ReservedTagKey => {
	return ReservedTagKey.options.includes(tagId as ReservedTagKey)
}

/**
 * Determines if an entry has any user-defined tags, namely any entry tag which
 * isn't a Reserved Tag.
 */
export const journalEntryHasUserDefinedTags = (entry: JournalEntry | TransferEntry): boolean => {
	const entryTagIds = entry.tagIds ?? []
	return entryTagIds.length > 0 && entryTagIds.some((tagId) => !tagIdBelongsToReservedTag(tagId))
}

/**
 * @deprecated Use enumerateJournalEntryReservedTag instead.
 */
export const journalEntryIsFlagged = (entry: JournalEntry | TransferEntry): boolean => {
	const entryTagIds = entry.tagIds ?? []
	return entryTagIds.some((tagId) => tagId === RESERVED_TAGS.FLAGGED._id)
}

/**
 * @deprecated Use enumerateJournalEntryReservedTag instead.
 */
export const journalEntryHasApproximateTag = (entry: JournalEntry | TransferEntry): boolean => {
	const entryTagIds = entry.tagIds ?? []
	return entryTagIds.some((tagId) => tagId === RESERVED_TAGS.APPROXIMATE._id)
}

export const documentIsJournalEntryOrChildJournalEntry = (doc: ZiskDocument): doc is JournalEntry | ChildJournalEntry => {
	return ['JOURNAL_ENTRY', 'CHILD_JOURNAL_ENTRY'].includes(doc.type)
}

export const journalOrTransferEntryIsTransferEntry = (doc: JournalEntry | TransferEntry): doc is TransferEntry => {
	return doc.type === 'TRANSFER_ENTRY'
}

export const documentIsChildJournalEntry = (doc: ZiskDocument): doc is ChildJournalEntry => {
	return doc.type === 'CHILD_JOURNAL_ENTRY'
}

export const documentIsCategory = (doc: ZiskDocument): doc is Category => {
	return doc.type === 'CATEGORY'
}

export const generateRandomAvatar = (): Avatar => {
	const primaryColor = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`
	return {
		...DEFAULT_AVATAR,
		primaryColor,
	}
}

export const enumerateJournalEntryReservedTag = (entry: JournalEntry | TransferEntry):
	{ parent: Set<ReservedTagKey>, children: Set<ReservedTagKey> } => {
		const parentTagIds: string[] = entry.tagIds ?? []
		let childTagIds: string[]
		if (documentIsJournalEntryOrChildJournalEntry(entry)) {
			childTagIds = entry.children?.flatMap((child) => child.tagIds ?? []) ?? []
		} else {
			childTagIds = []
		}
		return {
			parent: new Set<ReservedTagKey>(parentTagIds.filter(tagIdBelongsToReservedTag)),
			children: new Set<ReservedTagKey>(childTagIds.filter(tagIdBelongsToReservedTag)),
		}
	}
