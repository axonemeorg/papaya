import {
	EnhancedJournalEntry,
	EntryArtifact,
	type JournalEntry,
} from '@/types/schema'
import { generateJournalEntryId } from './id'

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
	if (!entry.categoryIds?.length) {
		delete entry.categoryIds
	}
	if (!entry.paymentMethodId) {
		delete entry.paymentMethodId
	}
	if (!entry.notes) {
		delete entry.notes
	}

	return {
		...entry,
	}
}

export const parseJournalEntryAmount = (amount: string): number => {
	const sanitizedAmount = String(amount).replace(/[^0-9.-]/g, '');
	if (!amount || !sanitizedAmount) {
		return 0;
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

export const enhanceJournalEntry = (
	parent: JournalEntry,
	children: JournalEntry[],
	artifacts: EntryArtifact[]
): EnhancedJournalEntry => {
	const allCategoryIds = Array.from(
		new Set([...(parent.categoryIds ?? []), ...children.flatMap((child) => child.categoryIds ?? [])])
	)

	const netAmount: number = children.reduce(
		(acc: number, child) => {
			return acc + parseJournalEntryAmount(child.amount)
		},
		parseJournalEntryAmount(parent.amount)
	)

	return {
		...parent,
		children,
		artifacts,
		allCategoryIds,
		netAmount,
	}
}

export const createJournalEntry = (formData: Partial<JournalEntry>, journalId: string): JournalEntry => {
	const now = new Date().toISOString()

	const journalEntry: JournalEntry = {
		...formData,
		_id: generateJournalEntryId(),
		type: 'JOURNAL_ENTRY',
		createdAt: now,
		amount: formData.amount || '',
		memo: formData.memo || '',
		journalId,
	}

	return journalEntry
}
