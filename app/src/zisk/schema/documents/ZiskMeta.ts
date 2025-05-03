import z from "zod"
import { DocumentSchema } from "../support/document"
import { Mixin } from "../support/mixin"
import { UserSettings } from "../models/UserSettings"

export const [CreateZiskMeta, ZiskMeta] = DocumentSchema.new(
	{ 
		kind: z.literal('zisk:meta'),
	},
	z.interface({
		label: z.string(),
		activeJournalId: z.string().nullable(),
		userSettings: UserSettings,
	}),
	z.interface({
		...Mixin.derived.timestamps(),
	})
)

export type CreateZiskMeta = z.output<typeof CreateZiskMeta>
export type ZiskMeta = z.output<typeof ZiskMeta>
