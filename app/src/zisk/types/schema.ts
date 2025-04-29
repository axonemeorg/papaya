import { z } from 'zod'









export const BaseJournalEntry = DocumentMetadata
	.merge(BelongsToJournal)
	.merge(AmountRecord)
	.merge(
		z.object({
			kind: z.literal('zisk:entry'),
			memo: z.string(),
			tagIds: z.array(z.string()).optional(),
			categoryId: z.string().optional(),
			parsedNetAmount: z.number().optional(),
			sourceAccountId: z.string().optional(),
			date: z.string().optional(),
			notes: z.string().optional(),
			tasks: z.array(EntryTask).optional(),
			artifacts: z.array(EntryArtifact).optional(),
			recurs: EntryRecurrency.optional(),
			recurrenceOf: z.string().optional(),
			relatedEntryIds: z.array(z.string()).optional(),
			createdAt: z.string(),
			updatedAt: z.string().nullable().optional(),
		})
)

export type BaseJournalEntry = z.output<typeof BaseJournalEntry>

export const JournalEntry = BaseJournalEntry.merge(
	z.object({
		children: z.array(BaseJournalEntry).optional(),
		transfer: z.object({
			destAccountId: z.string()
		}).optional(),
	})
)
export type JournalEntry = z.output<typeof JournalEntry>

// export const TentativeJournalEntry = JournalEntry.merge(
// 	z.object({
// 		kind: TENTATIVE_JOURNAL_ENTRY_RECURRENCE,
// 		recurrenceOf: z.string(),
// 	})
// )
// export type TentativeJournalEntry = z.output<typeof TentativeJournalEntry>

// export const NonspecificEntry = z.union([
// 	JournalEntry,
// 	TentativeJournalEntry,
// ])

// export type NonspecificEntry = z.output<typeof NonspecificEntry>

export const ChildJournalEntry = BaseJournalEntry.merge(z.object({
	parentEntry: JournalEntry,
	// kind: z.literal('CHILD_JOURNAL_ENTRY'), // Not needed?
}))

export type ChildJournalEntry = z.output<typeof ChildJournalEntry>

export const CreateQuickJournalEntry = AmountRecord.merge(z.object({
	memo: z.string().optional(),
	categoryId: z.string().optional(),
}))

export type CreateQuickJournalEntry = z.output<typeof CreateQuickJournalEntry>

export const CreateEntryTag = z.object({
	label: z.string(),
	description: z.string(),
})

export type CreateEntryTag = z.output<typeof CreateEntryTag>

export const ReservedTagKey = z.enum([
	'FLAGGED',
	'NEEDS_REVIEW',
	'WAS_REVIEWED',
	'APPROXIMATE',
	'PENDING',
])

export type ReservedTagKey = z.output<typeof ReservedTagKey>

export const ReservedTag = CreateEntryTag.merge(z.object({
	_id: ReservedTagKey,
	kind: z.literal('RESERVED_TAG'),
	/**
	 * The Reserved Tag is not selectable within the app.
	 */
	disabled: z.boolean().optional(),
	/**
	 * The Reserved Tag is no longer used.
	 */
	archived: z.boolean().optional(),
}))

export type ReservedTag = z.output<typeof ReservedTag>

export const EntryTag = DocumentMetadata.merge(BelongsToJournal).merge(CreateEntryTag).merge(
	z.object({
		kind: z.literal('zisk:tag'),
		createdAt: z.string(),
		updatedAt: z.string().nullable(),
	})
)

export type EntryTag = z.output<typeof EntryTag>

export const CreateAccount = z.object({
	label: z.string(),
	description: z.string(),
	avatar: Avatar,
})

export type CreateAccount = z.output<typeof CreateAccount>

export const Account = DocumentMetadata.merge(BelongsToJournal).merge(CreateCategory).merge(
	z.object({
		kind: z.literal('zisk:account'),
		createdAt: z.string(),
		updatedAt: z.string().nullable().optional(),
	})
)

export type Account = z.output<typeof Account>

export const AnnualPeriod = z.object({
	year: z.number().min(1900).max(2999)
})

export type AnnualPeriod = z.output<typeof AnnualPeriod>


export const MonthlyPeriod = AnnualPeriod.extend({
	month: z.number().min(1).max(12)
})

export type MonthlyPeriod = z.output<typeof MonthlyPeriod>

export const WeeklyPeriod = MonthlyPeriod.extend({
	day: z.number().min(1).max(31)
})

export type WeeklyPeriod = z.output<typeof WeeklyPeriod>

export const DatePeriod = z.union([AnnualPeriod, MonthlyPeriod, WeeklyPeriod])

export type DatePeriod = z.output<typeof DatePeriod>

export const DateRange = z.object({
	before: z.string().optional(),
	after: z.string().optional(),
})

export type DateRange = z.output<typeof DateRange>

export const DateView = z.union([DatePeriod, DateRange])

export type DateView = z.output<typeof DateView>

export enum DateViewSymbol {
	WEEKLY = 'w',
	MONTHLY = 'm',
	YEARLY = 'y',
	RANGE = 'r',
}

export const AmountRange = z.object({
	gt: z.string().optional(),
	lt: z.string().optional(),
	absolute: z.boolean().optional(),
})

export type AmountRange = z.output<typeof AmountRange>

export const JournalSlice = z.object({
	dateView: DateView,
	tagIds: z.array(z.string()).optional(),
	reservedTags: z.array(ReservedTagKey).optional(),
	categoryIds: z.array(z.string()).optional(),
	amount: AmountRange.optional(),
	hasAttachments: z.boolean().optional(),
})

export type JournalSlice = z.output<typeof JournalSlice>

export const BasicAnalytics = z.object({
	/**
	 * Absolute sum of all accrued gains
	 */
	sumGain: z.number(),
	/**
	 * Absolute sum of all incurred losses
	 */
	sumLoss: z.number(),
	/**
	 * Data array for chart display
	 */
	chart: z.object({
		data: z.array(z.number()),
		labels: z.array(z.string()),
	})
})

export type BasicAnalytics = z.output<typeof BasicAnalytics>

export const CategoryAnalytics = z.object({
	spendByCategoryId: z.record(z.string(), z.number())
})

export type CategoryAnalytics = z.output<typeof CategoryAnalytics>

export const Analytics = z.object({
	basic: BasicAnalytics,
	categories: CategoryAnalytics,
})

export type Analytics = z.output<typeof Analytics>

export const CloudZiskServer = z.object({
	serverType: z.literal('ZISK_CLOUD'),
	user: z.object({
		username: z.string(),
		avatar: Avatar,
	})
})

export type CloudZiskServer = z.output<typeof CloudZiskServer>

export const NoneZiskServer = z.object({
	serverType: z.literal('NONE')
})

export type NoneZiskServer = z.output<typeof NoneZiskServer>

export const CustomZiskServer = CloudZiskServer.merge(z.object({
	serverType: z.literal('CUSTOM'),
	serverUrl: z.string(),
	serverName: z.string().optional(),
	serverNickname: z.string().optional(),
}))

export type CustomZiskServer = z.output<typeof CustomZiskServer>

export const ZiskServer = z.union([
	CustomZiskServer,
	NoneZiskServer,
	CloudZiskServer,
])

export type ZiskServer = z.output<typeof ZiskServer>

export const CouchDbSyncingStrategy = z.object({
	strategyType: z.literal('COUCH_DB'),
	couchDbUrl: z.string(),
})

export type CouchDbSyncingStrategy = z.output<typeof CouchDbSyncingStrategy>

export const LocalSyncingStrategy = z.object({
	strategyType: z.literal('LOCAL'),
})

export type LocalSyncingStrategy = z.output<typeof LocalSyncingStrategy>

export const ServerSyncingStrategy = z.object({
	strategyType: z.literal('CUSTOM_SERVER_OR_ZISK_CLOUD'),
	// serverUrl: z.string(),
})

export type ServerSyncingStrategy = z.output<typeof ServerSyncingStrategy>

export const SyncingStrategy = z.union([
	LocalSyncingStrategy,
	ServerSyncingStrategy,
	CouchDbSyncingStrategy,
])

export type SyncingStrategy = z.output<typeof SyncingStrategy>

export const ZiskSettings = z.object({
	appearance: z.object({
		// theme: z.union([z.literal('LIGHT'), z.literal('DARK'), z.literal('SYSTEM')]),
		// animations: z.union([z.literal('NORMAL'), z.literal('FAST'), z.literal('OFF')]),
		menuExpanded: z.boolean(),
	}),
	server: ZiskServer,
	syncingStrategy: SyncingStrategy,
})

export type ZiskSettings = z.output<typeof ZiskSettings>

export const ZiskMeta = IdentifierMetadata.merge(
	z.object({
		kind: z.literal('ZISK_META'),
		activeJournalId: z.string().nullable(),
		settings: ZiskSettings,
		createdAt: z.string(),
	})
)

export type ZiskMeta = z.output<typeof ZiskMeta>

export const CreateJournalMeta = z.object({
	journalName: z.string().min(1, 'Journal name must be at least 1 character'),
	avatar: Avatar,
})

export type CreateJournalMeta = z.output<typeof CreateJournalMeta>

export enum JournalVersion {
    INITIAL_VERSION = '2025-03-01',
    ADD_PARSE_AMOUNT_TO_ENTRIES = '2025-03-02',
    REPLACE_CATEGORY_IDS = '2025-03-23',
}

export const Journal = IdentifierMetadata.merge(CreateJournalMeta).merge(
	z.object({
		kind: z.literal('zisk:journal'),
		journalVersion: z.nativeEnum(JournalVersion),
		createdAt: z.string(),
		updatedAt: z.string().nullable(),
	})
)

export type Journal = z.output<typeof Journal>

export const ZiskDocument = z.union([
	Category,
	JournalEntry,
	ChildJournalEntry,
	EntryTag,
	Journal,
])

export type ZiskDocument = z.output<typeof ZiskDocument>
